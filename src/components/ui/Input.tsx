import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	error?: string;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => {
	return (
		<div className="relative w-full">
			<input
				ref={ref}
				className={cn(
					"flex h-12 w-full rounded-xl border border-input-border bg-input px-4 py-2 text-sm text-foreground shadow-sm transition-all duration-200 placeholder:text-neutral-500 focus:border-rose-300/60 focus:outline-none focus:ring-4 focus:ring-rose-300/10 disabled:cursor-not-allowed disabled:opacity-50",
					error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10",
					className,
				)}
				{...props}
			/>
			{error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
		</div>
	);
});
