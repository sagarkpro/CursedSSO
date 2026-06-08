import { post } from "@/utils/api";

export interface VerifyOtpRequest {
	email: string;
	otp: string;
}

export interface AuthTokenData {
	accessToken: string;
}

export function verifyOtp(payload: VerifyOtpRequest) {
	return post<AuthTokenData>("/api/auth/verify-otp", payload);
}
