import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, MailCheck, ArrowLeft } from "lucide-react";
import { OtpInput } from "@/components/shared/OtpInput";
import { Button } from "@/components/ui/Button";

const RESEND_SECONDS = 30;

export default function VerifyPage() {
	const [code, setCode] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
	useEffect(() => {
		if (secondsLeft <= 0) return;
		const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
		return () => clearInterval(t);
	}, [secondsLeft]);
	const handleVerify = (e?: React.FormEvent) => {
		e?.preventDefault();
		if (code.length !== 6) {
			setError("Please enter all 6 characters of the code.");
			return;
		}
		setIsLoading(true);
		setError(null);
		setTimeout(() => {
			setIsLoading(false);
			// Demo: show error so the error state is visible
			setError("That code didn't match. Double-check and try again.");
		}, 1500);
	};
	const handleResend = () => {
		if (secondsLeft > 0) return;
		setCode("");
		setError(null);
		setSecondsLeft(RESEND_SECONDS);
	};
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
							We sent a 6-character code to <span className="text-neutral-200 font-medium">you@example.com</span>. Paste or type it below.
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
						onChange={(v) => {
							setCode(v);
							if (error) setError(null);
						}}
						onComplete={() => {
							// Auto-submit on complete for a snappier feel
							setTimeout(() => handleVerify(), 150);
						}}
						error={Boolean(error)}
					/>

					<div className="flex items-center justify-center text-xs text-neutral-500">
						{secondsLeft > 0 ? (
							<span>
								Resend code in <span className="text-neutral-300 font-mono">{String(secondsLeft).padStart(2, "0")}s</span>
							</span>
						) : (
							<button type="button" onClick={handleResend} className="text-rose-300 hover:text-rose-200 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/40 rounded-md px-1">
								Resend code
							</button>
						)}
					</div>

					<Button type="submit" className="w-full" isLoading={isLoading} disabled={code.length !== 6}>
						{isLoading ? "Verifying…" : "Verify and continue"}
					</Button>
				</form>

				<div className="flex items-center justify-center gap-1.5 text-sm text-neutral-400 pt-2">
					<ArrowLeft className="w-3.5 h-3.5" />
					<Link to="/login" className="font-medium text-foreground hover:text-rose-300 transition-colors underline decoration-white/20 hover:decoration-rose-300/50 underline-offset-4">
						Use a different email
					</Link>
				</div>
			</div>
		</div>
	);
}
