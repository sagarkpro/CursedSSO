import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { PasswordField } from "@/components/ui/PasswordField";
import { Button } from "@/components/ui/Button";
import { SocialButtons } from "@/components/shared/SocialButtons";
import { useLogin } from "@/hooks/useLogin";
import { getErrorMessage } from "@/utils/api";
import { saveAccessToken } from "@/utils/authStorage";
import { getFieldErrors, loginSchema } from "@/utils/validation";

const greetings = ["Good to see you again ✦", "Let's get you signed in", "Welcome back to the grid"];

interface LoginFormValues {
	email: string;
	password: string;
}

type LoginFieldErrors = Partial<Record<keyof LoginFormValues, string>>;

export default function LoginPage() {
	const [form, setForm] = useState<LoginFormValues>({
		email: "",
		password: "",
	});
	const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
	const [error, setError] = useState<string | null>(null);
	const [greetingIndex] = useState(() => Math.floor(Math.random() * greetings.length));
	const loginMutation = useLogin();

	const updateField = (field: keyof LoginFormValues, value: string) => {
		setForm((current) => ({
			...current,
			[field]: value,
		}));
		setFieldErrors((current) => ({
			...current,
			[field]: undefined,
		}));
		setError(null);
	};

	const handleLogin = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);
		const parsed = loginSchema.safeParse(form);

		if (!parsed.success) {
			setFieldErrors(getFieldErrors(parsed.error));
			return;
		}

		setFieldErrors({});
		loginMutation.mutate(parsed.data, {
			onSuccess: ({ accessToken }) => {
				saveAccessToken(accessToken);
				toast.success("Logged in successfully");
			},
			onError: (mutationError) => {
				const message = getErrorMessage(mutationError);
				setError(message);
				toast.error(message);
			},
		});
	};

	return (
		<div>
			<div className="flex flex-col space-y-6">
				<div className="flex flex-col space-y-2 text-center sm:text-left">
					<h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">Welcome back</h1>
					<p className="text-sm text-neutral-400">{greetings[greetingIndex]}</p>
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

				<form onSubmit={handleLogin} className="flex flex-col space-y-4">
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
								value={form.email}
								onChange={(event) => updateField("email", event.target.value)}
								error={fieldErrors.email}
							/>
						</div>

						<div className="space-y-1.5">
							<div className="flex items-center justify-between ml-1">
								<label htmlFor="password" className="text-xs font-medium text-neutral-300">
									Password
								</label>
								<a href="#" className="text-xs font-medium text-rose-300 hover:text-rose-200 transition-colors">
									Forgot password?
								</a>
							</div>
							<PasswordField
								id="password"
								placeholder="••••••••"
								autoComplete="current-password"
								value={form.password}
								onChange={(event) => updateField("password", event.target.value)}
								error={fieldErrors.password}
							/>
						</div>
					</div>

					<Button type="submit" className="w-full mt-2" isLoading={loginMutation.isPending}>
						{loginMutation.isPending ? "Signing in..." : "Sign in"}
					</Button>
				</form>

				<SocialButtons />

				<p className="text-center text-sm text-neutral-400 mt-4">
					Don't have an account?{" "}
					<Link to="/register" className="font-medium text-foreground hover:text-rose-300 transition-colors underline decoration-white/20 hover:decoration-rose-300/50 underline-offset-4">
						Create one
					</Link>
				</p>
			</div>
		</div>
	);
}
