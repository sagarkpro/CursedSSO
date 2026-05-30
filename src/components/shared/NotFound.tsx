import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "../ui/Button";
const quips = ["You wandered off the map.", "This page took a day off ✦", "Nothing to see here — but the vibes are immaculate.", "Lost in the void.", "404. Even our compass is confused."];
export function NotFound() {
	const [quip] = useState(() => quips[Math.floor(Math.random() * quips.length)]);
	return (
		<div className="flex min-h-screen w-full items-center justify-center p-6 sm:p-12">
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
					duration: 0.6,
					ease: [0.16, 1, 0.3, 1],
				}}
				className="relative w-full max-w-[520px] flex flex-col items-center text-center"
			>
				{/* Decorative orbiting rings around the 404 */}
				<div className="relative mb-8 flex items-center justify-center">
					<motion.div
						className="absolute w-[220px] h-[220px] rounded-full border border-white/[0.05]"
						animate={{
							rotate: 360,
						}}
						transition={{
							duration: 30,
							repeat: Infinity,
							ease: "linear",
						}}
					>
						<div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-rose-300/60 shadow-[0_0_12px_rgba(253,164,175,0.6)]" />
					</motion.div>
					<motion.div
						className="absolute w-[160px] h-[160px] rounded-full border border-rose-300/[0.12]"
						animate={{
							rotate: -360,
						}}
						transition={{
							duration: 18,
							repeat: Infinity,
							ease: "linear",
						}}
					>
						<div className="absolute top-1/2 -right-0.5 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/40" />
					</motion.div>

					{/* Soft glow */}
					<div className="absolute w-[180px] h-[180px] rounded-full bg-rose-300/[0.08] blur-3xl" />

					{/* The 404 */}
					<h1 className="relative text-[88px] sm:text-[112px] leading-none font-medium tracking-tighter text-foreground">
						4<span className="text-rose-300">0</span>4
					</h1>
				</div>

				<p className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-mono mb-3">Page not found</p>

				<motion.h2
					key={quip}
					initial={{
						opacity: 0,
						y: 6,
					}}
					animate={{
						opacity: 1,
						y: 0,
					}}
					transition={{
						duration: 0.4,
					}}
					className="text-xl sm:text-2xl font-medium tracking-tight text-foreground mb-3"
				>
					{quip}
				</motion.h2>

				<p className="text-sm text-neutral-400 max-w-sm mb-8">The page you're looking for doesn't exist or has been moved. Let's get you back to somewhere familiar.</p>

				<div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
					<Link to="/login" className="w-full sm:w-auto">
						<Button className="w-full gap-2">
							<ArrowLeft className="w-4 h-4" />
							Back to sign in
						</Button>
					</Link>
					<a href="#" className="w-full sm:w-auto">
						<Button variant="outline" className="w-full gap-2">
							<Compass className="w-4 h-4" />
							Explore docs
						</Button>
					</a>
				</div>
			</motion.div>
		</div>
	);
}
