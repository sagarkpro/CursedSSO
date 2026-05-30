import { ProfilePictureUpload } from "@/components/shared/ProfilePictureUpload";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordField } from "@/components/ui/PasswordField";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
	const [isLoading, setIsLoading] = useState(false);

	const handleRegister = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		// Simulate network request
		setTimeout(() => {
			setIsLoading(false);
		}, 2000);
	};

	return (
		<div>
			<div className="flex flex-col space-y-6">
				<div className="flex flex-col space-y-2 text-center sm:text-left">
					<h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">Create an account</h1>
					<p className="text-sm text-neutral-400">Join the grid. It only takes a minute.</p>
				</div>

				<form onSubmit={handleRegister} className="flex flex-col space-y-5">
					<div className="flex justify-center mb-2">
						<ProfilePictureUpload />
					</div>

					<div className="space-y-4">
						<div className="space-y-1.5">
							<label htmlFor="name" className="text-xs font-medium text-neutral-300 ml-1">
								Full Name
							</label>
							<Input id="name" type="text" placeholder="Jane Doe" required autoComplete="name" />
						</div>

						<div className="space-y-1.5">
							<label htmlFor="email" className="text-xs font-medium text-neutral-300 ml-1">
								Email
							</label>
							<Input id="email" type="email" placeholder="name@example.com" required autoComplete="email" />
						</div>

						<div className="space-y-1.5">
							<label htmlFor="password" className="text-xs font-medium text-neutral-300 ml-1">
								Password
							</label>
							<PasswordField id="password" placeholder="Create a strong password" required autoComplete="new-password" />
						</div>
					</div>

					<Button type="submit" className="w-full mt-2" isLoading={isLoading}>
						{isLoading ? "Creating account..." : "Create account"}
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
