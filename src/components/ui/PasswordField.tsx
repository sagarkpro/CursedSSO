import React, { useState, forwardRef } from "react";
import { Input, type InputProps } from "./Input";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/utils";
export const PasswordField = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
	const [showPassword, setShowPassword] = useState(false);
	return (
		<div className="relative w-full">
			<Input ref={ref} type={showPassword ? "text" : "password"} className={cn("pr-10", className)} {...props} />
			<button
				type="button"
				onClick={() => setShowPassword(!showPassword)}
				className="absolute right-3 top-3 text-neutral-500 hover:text-neutral-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/40 rounded-md p-0.5"
				aria-label={showPassword ? "Hide password" : "Show password"}
			>
				{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
			</button>
		</div>
	);
});
