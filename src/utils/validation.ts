import { z, type ZodError } from "zod";

const requiredText = (label: string) => z.string().trim().min(1, `${label} is required.`);

export const emailSchema = z.string().trim().email("Enter a valid email address.");

export const loginSchema = z.object({
	email: emailSchema,
	password: z.string().min(1, "Password is required."),
});

export const registerSchema = z.object({
	firstName: requiredText("First name"),
	lastName: requiredText("Last name"),
	username: requiredText("Username"),
	email: emailSchema,
	password: z
		.string()
		.min(8, "Password must contain at least 8 characters.")
		.regex(/[A-Z]/, "Password must contain an uppercase letter.")
		.regex(/[a-z]/, "Password must contain a lowercase letter.")
		.regex(/[0-9]/, "Password must contain a number.")
		.regex(/[^A-Za-z0-9]/, "Password must contain a special character."),
});

export const otpSchema = z.object({
	otp: z.string().regex(/^[A-Z0-9]{6}$/, "Enter the complete 6-character code."),
});

export const profileImageSchema = z
	.instanceof(File)
	.refine((file) => file.type.startsWith("image/"), "Choose a valid image file.");

export function getFieldErrors(error: ZodError) {
	const fieldErrors: Record<string, string> = {};

	for (const issue of error.issues) {
		const field = issue.path[0];
		if (typeof field === "string" && !fieldErrors[field]) {
			fieldErrors[field] = issue.message;
		}
	}

	return fieldErrors;
}
