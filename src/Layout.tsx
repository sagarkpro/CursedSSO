import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { BrandMark } from "./components/shared/BrandMark";
import { motion } from "framer-motion";
interface AppShellProps {
	children?: ReactNode;
	/** Show the top-right "Need help?" link. Defaults to true. */
	showHelp?: boolean;
}
/**
 * Base layout chrome shared across full-page screens (auth, 404, etc.).
 * Provides: dark background, ambient rose + cool glows, brand mark, version tag.
 * Children are responsible for their own centering / inner layout.
 */
export function Layout({ children, showHelp = true }: AppShellProps) {
	return (
		<div className="min-h-screen w-full bg-background text-foreground overflow-hidden relative selection:bg-rose-300/30">
			{/* Ambient Background Glows */}
			<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-300/[0.06] blur-[120px] pointer-events-none" />
			<div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/[0.03] blur-[120px] pointer-events-none" />

			{/* Top bar — brand mark left, optional help link right */}
			<div className="absolute top-0 left-0 w-full p-6 lg:px-12 lg:py-8 flex justify-between items-center z-20">
				<BrandMark />
				{showHelp && (
					<a href="#" className="text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors">
						Need help?
					</a>
				)}
			</div>

			{/* Content slot */}
			<div className="relative z-10 min-h-screen w-full">
				<div className="flex min-h-screen w-full">
					{/* Left Column: Auth Form */}
					<div className="w-full lg:w-[60%] flex flex-col justify-center items-center p-6 sm:p-12 relative">
						<motion.div
							initial={{
								opacity: 0,
								y: 20,
							}}
							animate={{
								opacity: 1,
								y: 0,
							}}
							transition={{
								duration: 0.5,
								ease: [0.16, 1, 0.3, 1],
							}}
							className="w-full max-w-[420px] mt-16 md:mt-0"
						>
							<div className="bg-card border border-card-border backdrop-blur-xl rounded-2xl p-8 sm:p-10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">{children ?? <Outlet />}</div>
						</motion.div>
					</div>

					{/* Right Column: Decorative Visual (desktop only) */}
					<div className="hidden lg:flex w-[40%] relative border-l border-white/[0.04] bg-white/[0.01] items-center justify-center overflow-hidden">
						<div className="relative w-full h-full flex items-center justify-center">
							<motion.div
								className="absolute w-[300px] h-[300px] rounded-full border border-white/[0.05] bg-gradient-to-br from-white/[0.02] to-transparent backdrop-blur-3xl"
								animate={{
									y: [0, -20, 0],
									rotate: [0, 5, 0],
								}}
								transition={{
									duration: 8,
									repeat: Infinity,
									ease: "easeInOut",
								}}
							/>

							<motion.div
								className="absolute w-[200px] h-[200px] rounded-full border border-rose-300/[0.1] bg-gradient-to-tr from-rose-300/[0.02] to-transparent backdrop-blur-2xl ml-32 mt-32"
								animate={{
									y: [0, 30, 0],
									x: [0, -10, 0],
								}}
								transition={{
									duration: 10,
									repeat: Infinity,
									ease: "easeInOut",
									delay: 1,
								}}
							/>

							<motion.div
								className="absolute z-10 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl flex items-center gap-4"
								initial={{
									opacity: 0,
									x: 20,
								}}
								animate={{
									opacity: 1,
									x: 0,
									y: [0, -10, 0],
								}}
								transition={{
									opacity: {
										duration: 0.8,
										delay: 0.5,
									},
									x: {
										duration: 0.8,
										delay: 0.5,
										ease: "easeOut",
									},
									y: {
										duration: 6,
										repeat: Infinity,
										ease: "easeInOut",
										delay: 0.5,
									},
								}}
							>
								<div className="w-8 h-8 rounded-full bg-rose-300/20 flex items-center justify-center">
									<div className="w-3 h-3 rounded-full bg-rose-300 animate-pulse" />
								</div>
								<div>
									<div className="text-sm font-medium text-white">Authentication Active</div>
									<div className="text-xs text-neutral-400">Secure connection established</div>
								</div>
							</motion.div>
						</div>

						{/* 2xl screen accent */}
						<div className="hidden 2xl:flex absolute top-12 right-12 items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05] backdrop-blur-md">
							<div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
							<span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">All systems nominal</span>
						</div>
					</div>
				</div>
			</div>

			{/* Version tag */}
			<div className="hidden md:block absolute bottom-6 left-1/2 -translate-x-1/2 lg:left-12 lg:translate-x-0 text-[10px] font-mono text-neutral-600 tracking-wider z-20">v0.1.0-beta</div>
		</div>
	);
}
