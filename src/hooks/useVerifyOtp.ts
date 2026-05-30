import { useMutation } from "@tanstack/react-query";
import { verifyOtp } from "@/api/verifyOtp";

export function useVerifyOtp() {
	return useMutation({
		mutationFn: verifyOtp,
	});
}
