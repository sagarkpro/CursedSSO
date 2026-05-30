import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
export function ProfilePictureUpload() {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
		}
	};
	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};
	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	};
	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		const file = e.dataTransfer.files?.[0];
		if (file && file.type.startsWith("image/")) {
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
		}
	};
	const clearImage = (e: React.MouseEvent) => {
		e.stopPropagation();
		setPreviewUrl(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};
	return (
		<div className="w-full flex flex-col items-center gap-4">
			<input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

			<div
				className={cn(
					"relative w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-all duration-300 group overflow-hidden",
					isDragging ? "border-rose-300 bg-rose-300/10 scale-105" : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10",
					previewUrl && "border-solid border-white/10 shadow-lg",
				)}
				onClick={() => !previewUrl && fileInputRef.current?.click()}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				<AnimatePresence mode="wait">
					{previewUrl ? (
						<motion.div
							key="preview"
							initial={{
								opacity: 0,
								scale: 0.8,
							}}
							animate={{
								opacity: 1,
								scale: 1,
							}}
							exit={{
								opacity: 0,
								scale: 0.8,
							}}
							className="w-full h-full relative"
						>
							<img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover rounded-full" />
							<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
								<button onClick={clearImage} className="p-1.5 bg-white/20 hover:bg-red-500/80 rounded-full text-white transition-colors backdrop-blur-sm">
									<X className="w-4 h-4" />
								</button>
							</div>
						</motion.div>
					) : (
						<motion.div
							key="placeholder"
							initial={{
								opacity: 0,
							}}
							animate={{
								opacity: 1,
							}}
							exit={{
								opacity: 0,
							}}
							className="flex flex-col items-center justify-center text-neutral-400 group-hover:text-neutral-200 transition-colors"
						>
							<User className="w-8 h-8 mb-1 opacity-50" />
							<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full backdrop-blur-[2px]">
								<Upload className="w-6 h-6 text-white" />
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{!previewUrl && <p className="text-xs text-neutral-500 font-medium">Upload a profile picture</p>}
		</div>
	);
}
