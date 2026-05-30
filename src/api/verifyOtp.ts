import { post } from "@/utils/api";
import type { AuthTokenData } from "./login";

export interface VerifyOtpRequest {
	email: string;
	otp: string;
}

export function verifyOtp(payload: VerifyOtpRequest) {
	return post<AuthTokenData>("/api/auth/verify-otp", payload);
}
