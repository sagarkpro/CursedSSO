import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Upload, X, User } from "lucide-react";
import { toast } from "sonner";
import { useUploadImage } from "@/hooks/useUploadImage";
import { getErrorMessage } from "@/utils/api";
import { emailSchema, profileImageSchema } from "@/utils/validation";
import { cn } from "@/lib/utils";

interface ProfilePictureUploadProps {
	email: string;
}

export function ProfilePictureUpload({ email }: ProfilePictureUploadProps) {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [validationError, setValidationError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const previewUrlRef = useRef<string | null>(null);
	const uploadImageMutation = useUploadImage();

	useEffect(() => {
		return () => {
			if (previewUrlRef.current) {
				URL.revokeObjectURL(previewUrlRef.current);
			}
		};
	}, []);

	const setPreview = (file: File | null) => {
		if (previewUrlRef.current) {
			URL.revokeObjectURL(previewUrlRef.current);
		}

		const nextPreviewUrl = file ? URL.createObjectURL(file) : null;
		previewUrlRef.current = nextPreviewUrl;
		setPreviewUrl(nextPreviewUrl);
	};

	const showValidationError = (message: string) => {
		setValidationError(message);
		toast.error(message);
	};

	const uploadFile = (file: File) => {
		if (uploadImageMutation.isPending) return;

		const parsedEmail = emailSchema.safeParse(email);
		if (!parsedEmail.success) {
			showValidationError("Enter a valid email before uploading an image.");
			return;
		}

		const parsedImage = profileImageSchema.safeParse(file);
		if (!parsedImage.success) {
			showValidationError(parsedImage.error.issues[0]?.message || "Choose a valid image file.");
			return;
		}

		setValidationError(null);
		uploadImageMutation.mutate(
			{
				email: parsedEmail.data,
				profileImage: parsedImage.data,
			},
			{
				onSuccess: () => {
					setPreview(file);
					toast.success("Profile image uploaded successfully");
				},
				onError: (error) => {
					toast.error(getErrorMessage(error));
				},
			},
		);
	};

	const openFilePicker = () => {
		const parsedEmail = emailSchema.safeParse(email);
		if (!parsedEmail.success) {
			showValidationError("Enter a valid email before uploading an image.");
			return;
		}

		setValidationError(null);
		fileInputRef.current?.click();
	};

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) uploadFile(file);
		event.target.value = "";
	};

	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
		if (uploadImageMutation.isPending) return;
		setIsDragging(true);
	};
	const handleDragLeave = (event: DragEvent) => {
		event.preventDefault();
		setIsDragging(false);
	};
	const handleDrop = (event: DragEvent) => {
		event.preventDefault();
		setIsDragging(false);
		const file = event.dataTransfer.files?.[0];
		if (file) uploadFile(file);
	};

	const clearImage = (event: MouseEvent) => {
		event.stopPropagation();
		setPreview(null);
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
					uploadImageMutation.isPending && "cursor-wait",
				)}
				onClick={() => !previewUrl && !uploadImageMutation.isPending && openFilePicker()}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				<AnimatePresence mode="wait">
					{uploadImageMutation.isPending ? (
						<motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
							<Loader2 className="w-6 h-6 text-rose-300 animate-spin" />
						</motion.div>
					) : previewUrl ? (
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
								<button type="button" onClick={clearImage} className="p-1.5 bg-white/20 hover:bg-red-500/80 rounded-full text-white transition-colors backdrop-blur-sm">
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

			{uploadImageMutation.isPending ? (
				<p className="text-xs text-neutral-500 font-medium">Uploading profile picture...</p>
			) : (
				!previewUrl && <p className="text-xs text-neutral-500 font-medium">Upload a profile picture</p>
			)}
			{validationError && <p className="text-xs text-red-400 text-center">{validationError}</p>}
		</div>
	);
}
