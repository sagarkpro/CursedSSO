import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "outline" | "ghost";
	isLoading?: boolean;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "primary", isLoading, children, disabled, ...props }, ref) => {
	const variants = {
		primary: "bg-rose-300 text-neutral-900 hover:bg-rose-200 active:scale-[0.98] focus-visible:ring-rose-300/40 shadow-[0_0_20px_rgba(253,164,175,0.2)] hover:shadow-[0_0_25px_rgba(253,164,175,0.3)]",
		secondary: "bg-white/[0.06] text-foreground hover:bg-white/[0.1] active:scale-[0.98]",
		outline: "border border-white/[0.08] text-foreground hover:bg-white/[0.04] active:scale-[0.98]",
		ghost: "text-neutral-400 hover:text-foreground hover:bg-white/[0.04] active:scale-[0.98]",
	};
	return (
		<button
			ref={ref}
			disabled={disabled || isLoading}
			className={cn(
				"relative inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none",
				variants[variant],
				className,
			)}
			{...props}
		>
			{isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
			{children}
		</button>
	);
});
