import { useMutation } from "@tanstack/react-query";
import { requestPasswordReset, updatePassword } from "@/api/resetPassword";

export function useRequestPasswordReset() {
	return useMutation({
		mutationFn: (email: string) => requestPasswordReset(email),
	});
}

export function useUpdatePassword() {
	return useMutation({
		mutationFn: updatePassword,
	});
}
