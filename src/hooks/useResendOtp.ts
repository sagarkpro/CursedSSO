import { useMutation } from "@tanstack/react-query";
import { resendOtp } from "@/api/resendOtp";

export function useResendOtp() {
	return useMutation({
		mutationFn: resendOtp,
	});
}
