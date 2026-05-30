import React, { useEffect, useState, useRef } from "react";
import { cn } from "../../lib/utils";
interface OtpInputProps {
	length?: number;
	value: string;
	onChange: (value: string) => void;
	onComplete?: (value: string) => void;
	error?: boolean;
	autoFocus?: boolean;
	disabled?: boolean;
}
const ALPHANUMERIC = /^[A-Z0-9]$/;
export function OtpInput({ length = 6, value, onChange, onComplete, error = false, autoFocus = true, disabled = false }: OtpInputProps) {
	const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
	const completedValueRef = useRef<string | null>(null);
	const [focusedIndex, setFocusedIndex] = useState<number | null>(autoFocus ? 0 : null);
	// Normalize value to array of chars, padded with empty strings
	const chars = Array.from(
		{
			length,
		},
		(_, i) => value[i] ?? "",
	);
	useEffect(() => {
		if (autoFocus) {
			inputsRef.current[0]?.focus();
		}
	}, [autoFocus]);
	useEffect(() => {
		if (value.length !== length) {
			completedValueRef.current = null;
			return;
		}

		if (onComplete && completedValueRef.current !== value) {
			completedValueRef.current = value;
			onComplete(value);
		}
	}, [value, length, onComplete]);
	const setCharAt = (index: number, char: string) => {
		const next = chars.slice();
		next[index] = char;
		onChange(next.join(""));
	};
	const focusInput = (index: number) => {
		const clamped = Math.max(0, Math.min(length - 1, index));
		inputsRef.current[clamped]?.focus();
		inputsRef.current[clamped]?.select();
	};
	const handleChange = (index: number, raw: string) => {
		// Strip non-alphanumeric, uppercase
		const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
		if (!cleaned) return;
		if (cleaned.length === 1) {
			setCharAt(index, cleaned);
			if (index < length - 1) focusInput(index + 1);
		} else {
			// Multi-char input (e.g. mobile autofill or fast typing) — distribute across boxes
			const next = chars.slice();
			let cursor = index;
			for (const c of cleaned) {
				if (cursor >= length) break;
				next[cursor] = c;
				cursor++;
			}
			onChange(next.join(""));
			focusInput(Math.min(cursor, length - 1));
		}
	};
	const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
		const key = e.key;
		if (key === "Backspace") {
			e.preventDefault();
			if (chars[index]) {
				setCharAt(index, "");
			} else if (index > 0) {
				setCharAt(index - 1, "");
				focusInput(index - 1);
			}
		} else if (key === "ArrowLeft") {
			e.preventDefault();
			focusInput(index - 1);
		} else if (key === "ArrowRight") {
			e.preventDefault();
			focusInput(index + 1);
		} else if (key === "Delete") {
			e.preventDefault();
			setCharAt(index, "");
		} else if (ALPHANUMERIC.test(key.toUpperCase()) && key.length === 1) {
			// Overwrite current box if it already has a value
			if (chars[index]) {
				e.preventDefault();
				setCharAt(index, key.toUpperCase());
				if (index < length - 1) focusInput(index + 1);
			}
		}
	};
	const handlePaste = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		const pasted = e.clipboardData
			.getData("text")
			.toUpperCase()
			.replace(/[^A-Z0-9]/g, "");
		if (!pasted) return;
		const next = chars.slice();
		let cursor = index;
		for (const c of pasted) {
			if (cursor >= length) break;
			next[cursor] = c;
			cursor++;
		}
		onChange(next.join(""));
		focusInput(Math.min(cursor, length - 1));
	};
	return (
		<div className="flex items-center justify-center gap-2 sm:gap-2.5 w-full">
			{chars.map((char, i) => {
				const filled = Boolean(char);
				const isFocused = focusedIndex === i;
				return (
					<input
						key={i}
						ref={(el) => {
							inputsRef.current[i] = el;
						}}
						type="text"
						inputMode="text"
						autoComplete={i === 0 ? "one-time-code" : "off"}
						maxLength={1}
						disabled={disabled}
						value={char}
						onChange={(e) => handleChange(i, e.target.value)}
						onKeyDown={(e) => handleKeyDown(i, e)}
						onPaste={(e) => handlePaste(i, e)}
						onFocus={(e) => {
							setFocusedIndex(i);
							e.currentTarget.select();
						}}
						onBlur={() => setFocusedIndex(null)}
						aria-label={`Character ${i + 1} of ${length}`}
						className={cn(
							"w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-medium font-mono uppercase",
							"rounded-xl border bg-input text-foreground caret-rose-300",
							"transition-all duration-200 outline-none",
							"border-input-border",
							filled && "border-white/20 bg-white/[0.06]",
							isFocused && "border-rose-300/60 ring-4 ring-rose-300/15 bg-white/[0.06]",
							error && "border-red-500/50 ring-red-500/10",
							disabled && "cursor-not-allowed opacity-60",
							"placeholder:text-neutral-700",
						)}
						placeholder="•"
					/>
				);
			})}
		</div>
	);
}
