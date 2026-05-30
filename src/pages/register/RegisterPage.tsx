import { ProfilePictureUpload } from "@/components/shared/ProfilePictureUpload";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordField } from "@/components/ui/PasswordField";
import { useRegister } from "@/hooks/useRegister";
import { getErrorMessage } from "@/utils/api";
import { savePendingVerificationEmail } from "@/utils/authStorage";
import { getFieldErrors, registerSchema } from "@/utils/validation";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface RegisterFormValues {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	password: string;
}

type RegisterFieldErrors = Partial<Record<keyof RegisterFormValues, string>>;

export default function RegisterPage() {
	const navigate = useNavigate();
	const registerMutation = useRegister();
	const [form, setForm] = useState<RegisterFormValues>({
		firstName: "",
		lastName: "",
		username: "",
		email: "",
		password: "",
	});
	const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});

	const updateField = (field: keyof RegisterFormValues, value: string) => {
		setForm((current) => ({
			...current,
			[field]: value,
		}));
		setFieldErrors((current) => ({
			...current,
			[field]: undefined,
		}));
	};

	const handleRegister = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const parsed = registerSchema.safeParse(form);

		if (!parsed.success) {
			setFieldErrors(getFieldErrors(parsed.error));
			return;
		}

		setFieldErrors({});
		registerMutation.mutate(
			{
				...parsed.data,
				role: "SUPERUSER",
			},
			{
				onSuccess: ({ email }) => {
					savePendingVerificationEmail(email);
					toast.success("Registration successful");
					navigate("/verify");
				},
				onError: (error) => {
					toast.error(getErrorMessage(error));
				},
			},
		);
	};

	return (
		<div>
			<div className="flex flex-col space-y-6">
				<div className="flex flex-col space-y-2 text-center sm:text-left">
					<h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">Create an account</h1>
					<p className="text-sm text-neutral-400">Join the grid. It only takes a minute.</p>
				</div>

				<form onSubmit={handleRegister} className="flex flex-col space-y-5">
					<div className="space-y-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-1.5">
								<label htmlFor="firstName" className="text-xs font-medium text-neutral-300 ml-1">
									First name
								</label>
								<Input id="firstName" type="text" placeholder="Jane" autoComplete="given-name" value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} error={fieldErrors.firstName} />
							</div>

							<div className="space-y-1.5">
								<label htmlFor="lastName" className="text-xs font-medium text-neutral-300 ml-1">
									Last name
								</label>
								<Input id="lastName" type="text" placeholder="Doe" autoComplete="family-name" value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} error={fieldErrors.lastName} />
							</div>
						</div>

						<div className="space-y-1.5">
							<label htmlFor="email" className="text-xs font-medium text-neutral-300 ml-1">
								Email
							</label>
							<Input id="email" type="email" placeholder="name@example.com" autoComplete="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} error={fieldErrors.email} />
						</div>

						<div className="flex justify-center py-1">
							<ProfilePictureUpload email={form.email} />
						</div>

						<div className="space-y-1.5">
							<label htmlFor="username" className="text-xs font-medium text-neutral-300 ml-1">
								Username
							</label>
							<Input id="username" type="text" placeholder="janedoe" autoComplete="username" value={form.username} onChange={(event) => updateField("username", event.target.value)} error={fieldErrors.username} />
						</div>

						<div className="space-y-1.5">
							<label htmlFor="password" className="text-xs font-medium text-neutral-300 ml-1">
								Password
							</label>
							<PasswordField id="password" placeholder="Create a strong password" autoComplete="new-password" value={form.password} onChange={(event) => updateField("password", event.target.value)} error={fieldErrors.password} />
						</div>
					</div>

					<Button type="submit" className="w-full mt-2" isLoading={registerMutation.isPending}>
						{registerMutation.isPending ? "Creating account..." : "Create account"}
					</Button>
				</form>

				<p className="text-center text-sm text-neutral-400 mt-4">
					Already have an account?{" "}
					<Link to="/login" className="font-medium text-foreground hover:text-rose-300 transition-colors underline decoration-white/20 hover:decoration-rose-300/50 underline-offset-4">
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
}
