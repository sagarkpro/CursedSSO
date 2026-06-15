import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, MailCheck, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { OtpInput } from "@/components/shared/OtpInput";
import { Button } from "@/components/ui/Button";
import { useVerifyOtp } from "@/hooks/useVerifyOtp";
import { useResendOtp } from "@/hooks/useResendOtp";
import { getErrorMessage } from "@/utils/api";
import { clearPendingVerificationEmail, getPendingVerificationEmail, saveAccessToken } from "@/utils/authStorage";
import { otpSchema } from "@/utils/validation";

const RESEND_SECONDS = 30;

export default function VerifyPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const loginId = searchParams.get("login_id");
	const otpParam = searchParams.get("otp");
	const [email] = useState(() => getPendingVerificationEmail());
	const [code, setCode] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
	const submittingRef = useRef(false);
	const hasAutoSubmitted = useRef(false);
	const { mutate: verifyOtp, isPending } = useVerifyOtp();
	const { mutate: resendOtp, isPending: isResending } = useResendOtp();

	useEffect(() => {
		if (!email) {
			navigate(loginId ? `/register?login_id=${loginId}` : "/register", { replace: true });
		}
	}, [email, navigate, loginId]);

	useEffect(() => {
		if (secondsLeft <= 0) return;
		const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
		return () => clearInterval(t);
	}, [secondsLeft]);

	const submitCode = useCallback(
		(otp: string) => {
			if (!email || submittingRef.current) return;

			const parsed = otpSchema.safeParse({
				otp,
			});
			if (!parsed.success) {
				setError(parsed.error.issues[0]?.message || "Enter the complete 6-character code.");
				return;
			}

			submittingRef.current = true;
			setError(null);
			verifyOtp(
				{
					email,
					otp: parsed.data.otp,
				},
				{
					onSuccess: ({ accessToken }) => {
						saveAccessToken(accessToken);
						clearPendingVerificationEmail();
						toast.success("OTP verified successfully");
						navigate(loginId ? `/login?login_id=${loginId}` : "/login", { replace: true });
					},
					onError: (mutationError) => {
						const message = getErrorMessage(mutationError);
						setError(message);
						toast.error(message);
					},
					onSettled: () => {
						submittingRef.current = false;
					},
				},
			);
		},
		[email, verifyOtp, loginId, navigate],
	);

	useEffect(() => {
		if (!email || !otpParam || hasAutoSubmitted.current) return;
		const upperOtp = otpParam.toUpperCase();
		setCode(upperOtp);
		submitCode(upperOtp);
		hasAutoSubmitted.current = true;
	}, [email, otpParam, submitCode]);

	const handleVerify = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		submitCode(code);
	};

	const handleResend = () => {
		if (secondsLeft > 0 || isResending || !email) return;
		resendOtp(
			{ email },
			{
				onSuccess: () => {
					setCode("");
					setError(null);
					setSecondsLeft(RESEND_SECONDS);
					toast.success("OTP resent successfully");
				},
				onError: (mutationError) => {
					const message = getErrorMessage(mutationError);
					setError(message);
					toast.error(message);
				},
			},
		);
	};

	if (!email) {
		return null;
	}

	return (
		<div>
			<div className="flex flex-col space-y-6">
				<div className="flex flex-col space-y-3 text-center sm:text-left">
					<div className="inline-flex items-center justify-center sm:justify-start">
						<div className="w-11 h-11 rounded-xl bg-rose-300/10 border border-rose-300/20 flex items-center justify-center">
							<MailCheck className="w-5 h-5 text-rose-300" />
						</div>
					</div>
					<div className="space-y-1.5">
						<h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">Check your email</h1>
						<p className="text-sm text-neutral-400">
							We sent a 6-character code to <span className="text-neutral-200 font-medium">{email}</span>. Paste or type it below.
						</p>
					</div>
				</div>

				<AnimatePresence mode="wait">
					{error && (
						<motion.div
							initial={{
								opacity: 0,
								height: 0,
								y: -10,
							}}
							animate={{
								opacity: 1,
								height: "auto",
								y: 0,
							}}
							exit={{
								opacity: 0,
								height: 0,
								y: -10,
							}}
							className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-3"
						>
							<AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
							<p className="text-sm text-red-200">{error}</p>
						</motion.div>
					)}
				</AnimatePresence>

				<form onSubmit={handleVerify} className="flex flex-col space-y-5">
					<OtpInput
						value={code}
						onChange={(value) => {
							setCode(value);
							if (error) setError(null);
						}}
						onComplete={submitCode}
						error={Boolean(error)}
						disabled={isPending}
					/>

					<div className="flex items-center justify-center text-xs text-neutral-500">
						{secondsLeft > 0 ? (
							<span>
								Resend code in <span className="text-neutral-300 font-mono">{String(secondsLeft).padStart(2, "0")}s</span>
							</span>
						) : (
							<button type="button" onClick={handleResend} disabled={isResending} className="text-rose-300 hover:text-rose-200 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/40 rounded-md px-1 disabled:opacity-60">
								{isResending ? "Sending..." : "Resend code"}
							</button>
						)}
					</div>

					<Button type="submit" className="w-full" isLoading={isPending} disabled={code.length !== 6}>
						{isPending ? "Verifying..." : "Verify and continue"}
					</Button>
				</form>

				<div className="flex items-center justify-center gap-1.5 text-sm text-neutral-400 pt-2">
					<ArrowLeft className="w-3.5 h-3.5" />
					<Link
						to={loginId ? `/register?login_id=${loginId}` : "/register"}
						onClick={clearPendingVerificationEmail}
						className="font-medium text-foreground hover:text-rose-300 transition-colors underline decoration-white/20 hover:decoration-rose-300/50 underline-offset-4"
					>
						Use a different email
					</Link>
				</div>
			</div>
		</div>
	);
}
