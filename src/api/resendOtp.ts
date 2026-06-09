import { post } from "@/utils/api";

export interface ResendOtpRequest {
	email: string;
}

export function resendOtp(payload: ResendOtpRequest) {
	return post<string>("/api/auth/resend-otp", payload);
}
