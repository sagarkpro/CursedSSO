import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { PasswordField } from "@/components/ui/PasswordField";
import { Button } from "@/components/ui/Button";
import { SocialButtons } from "@/components/shared/SocialButtons";

const greetings = ["Good to see you again ✦", "Let's get you signed in", "Welcome back to the grid"];

export default function LoginPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [greetingIndex, setGreetingIndex] = useState(0);

	useEffect(() => {
		setGreetingIndex(Math.floor(Math.random() * greetings.length));
	}, []);

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);
		// Simulate network request
		setTimeout(() => {
			// Randomly fail sometimes for demo purposes, or just fail if we want to show the error state
			// Let's just show an error after 1.5s to demonstrate the UI
			setIsLoading(false);
			setError("Invalid email or password. Please try again.");
		}, 1500);
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
							<Input id="email" type="email" placeholder="name@example.com" required autoComplete="email" />
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
							<PasswordField id="password" placeholder="••••••••" required autoComplete="current-password" />
						</div>
					</div>

					<Button type="submit" className="w-full mt-2" isLoading={isLoading}>
						{isLoading ? "Signing in..." : "Sign in"}
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
