import { motion } from "framer-motion";
export function BrandMark() {
	return (
		<div className="flex items-center gap-2 select-none">
			<div className="relative flex items-center justify-center w-8 h-8 rounded-full border border-white/20 bg-white/5 shadow-[0_0_15px_rgba(253,164,175,0.15)]">
				<motion.div
					className="w-2.5 h-2.5 rounded-full bg-rose-300"
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.8, 1, 0.8],
					}}
					transition={{
						duration: 3,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
			</div>
			<span className="font-medium tracking-tight text-lg text-foreground">halo</span>
		</div>
	);
}
