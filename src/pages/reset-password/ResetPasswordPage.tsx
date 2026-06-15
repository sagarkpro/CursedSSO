import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { PasswordField } from "@/components/ui/PasswordField";
import { Button } from "@/components/ui/Button";
import { useRequestPasswordReset, useUpdatePassword } from "@/hooks/useResetPassword";
import { getErrorMessage } from "@/utils/api";
import { clearPendingLoginId, getPendingLoginId } from "@/utils/authStorage";
import { getFieldErrors, resetPasswordRequestSchema, updatePasswordSchema } from "@/utils/validation";

interface RequestFormValues {
	email: string;
}

interface UpdateFormValues {
	password: string;
}

type RequestFieldErrors = Partial<Record<keyof RequestFormValues, string>>;
type UpdateFieldErrors = Partial<Record<keyof UpdateFormValues, string>>;

export default function ResetPasswordPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const locationState = location.state as { email?: string } | null;
	const locationEmail = locationState?.email;
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");
	const email = searchParams.get("email");
	const isUpdateMode = Boolean(token && email);
	const loginId = getPendingLoginId() ?? searchParams.get("login_id");
	const loginHref = loginId ? `/login?login_id=${loginId}` : "/login";

	const requestMutation = useRequestPasswordReset();
	const updateMutation = useUpdatePassword();

	const [requestForm, setRequestForm] = useState<RequestFormValues>({ email: locationEmail ?? "" });
	const [requestFieldErrors, setRequestFieldErrors] = useState<RequestFieldErrors>({});

	const [updateForm, setUpdateForm] = useState<UpdateFormValues>({ password: "" });
	const [updateFieldErrors, setUpdateFieldErrors] = useState<UpdateFieldErrors>({});

	const [serverError, setServerError] = useState<string | null>(null);

	const updateRequestField = (field: keyof RequestFormValues, value: string) => {
		setRequestForm((current) => ({ ...current, [field]: value }));
		setRequestFieldErrors((current) => ({ ...current, [field]: undefined }));
		setServerError(null);
	};

	const updateUpdateField = (field: keyof UpdateFormValues, value: string) => {
		setUpdateForm((current) => ({ ...current, [field]: value }));
		setUpdateFieldErrors((current) => ({ ...current, [field]: undefined }));
		setServerError(null);
	};

	const handleRequestSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setServerError(null);
		const parsed = resetPasswordRequestSchema.safeParse(requestForm);
		if (!parsed.success) {
			setRequestFieldErrors(getFieldErrors(parsed.error));
			return;
		}
		setRequestFieldErrors({});
		requestMutation.mutate(parsed.data.email, {
			onSuccess: () => {
				toast.success("If that email belongs to a human in our system, a password rescue mission is already underway.");
			},
			onError: (error) => {
				const message = getErrorMessage(error);
				setServerError(message);
				toast.error(message);
			},
		});
	};

	const handleUpdateSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setServerError(null);
		const parsed = updatePasswordSchema.safeParse(updateForm);
		if (!parsed.success) {
			setUpdateFieldErrors(getFieldErrors(parsed.error));
			return;
		}
		setUpdateFieldErrors({});
		updateMutation.mutate(
			{ email: email!, token: token!, password: parsed.data.password },
			{
				onSuccess: () => {
					toast.success("Password updated successfully. Your goldfish can finally remember it again.");
					clearPendingLoginId();
					navigate(loginHref);
				},
				onError: (error) => {
					const message = getErrorMessage(error);
					setServerError(message);
					toast.error(message);
				},
			},
		);
	};

	if (isUpdateMode) {
		return (
			<div>
				<div className="flex flex-col space-y-6">
					<div className="flex flex-col space-y-2 text-center sm:text-left">
						<h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">Set new password</h1>
						<p className="text-sm text-neutral-400">Choose a strong password for your account.</p>
					</div>

					<AnimatePresence mode="wait">
						{serverError && (
							<motion.div
								initial={{ opacity: 0, height: 0, y: -10 }}
								animate={{ opacity: 1, height: "auto", y: 0 }}
								exit={{ opacity: 0, height: 0, y: -10 }}
								className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-3"
							>
								<AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
								<p className="text-sm text-red-200">{serverError}</p>
							</motion.div>
						)}
					</AnimatePresence>

					<form onSubmit={handleUpdateSubmit} className="flex flex-col space-y-4">
						<div className="space-y-4">
							<div className="space-y-1.5">
								<label htmlFor="password" className="text-xs font-medium text-neutral-300 ml-1">
									New password
								</label>
								<PasswordField
									id="password"
									placeholder="Create a strong password"
									autoComplete="new-password"
									value={updateForm.password}
									onChange={(event) => updateUpdateField("password", event.target.value)}
									error={updateFieldErrors.password}
								/>
							</div>

						</div>

						<Button type="submit" className="w-full mt-2" isLoading={updateMutation.isPending}>
							{updateMutation.isPending ? "Updating password..." : "Update password"}
						</Button>
					</form>

					<p className="text-center text-sm text-neutral-400 mt-4">
						Remembered it?{" "}
						<Link to={loginHref} className="font-medium text-foreground hover:text-rose-300 transition-colors underline decoration-white/20 hover:decoration-rose-300/50 underline-offset-4">
							Sign in
						</Link>
					</p>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className="flex flex-col space-y-6">
				<div className="flex flex-col space-y-2 text-center sm:text-left">
					<h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">Reset your password</h1>
					<p className="text-sm text-neutral-400">Enter your email and we'll send a recovery link.</p>
				</div>

				<AnimatePresence mode="wait">
					{serverError && (
						<motion.div
							initial={{ opacity: 0, height: 0, y: -10 }}
							animate={{ opacity: 1, height: "auto", y: 0 }}
							exit={{ opacity: 0, height: 0, y: -10 }}
							className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-3"
						>
							<AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
							<p className="text-sm text-red-200">{serverError}</p>
						</motion.div>
					)}
				</AnimatePresence>

				<form onSubmit={handleRequestSubmit} className="flex flex-col space-y-4">
					<div className="space-y-4">
						<div className="space-y-1.5">
							<label htmlFor="email" className="text-xs font-medium text-neutral-300 ml-1">
								Email
							</label>
							<Input
								id="email"
								type="email"
								placeholder="name@example.com"
								autoComplete="email"
								value={requestForm.email}
								onChange={(event) => updateRequestField("email", event.target.value)}
								error={requestFieldErrors.email}
							/>
						</div>
					</div>

					<Button type="submit" className="w-full mt-2" isLoading={requestMutation.isPending}>
						{requestMutation.isPending ? "Sending link..." : "Send recovery link"}
					</Button>
				</form>

				<p className="text-center text-sm text-neutral-400 mt-4">
					Remembered it?{" "}
					<Link to={loginHref} className="font-medium text-foreground hover:text-rose-300 transition-colors underline decoration-white/20 hover:decoration-rose-300/50 underline-offset-4">
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
}
