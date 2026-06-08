import { post } from "@/utils/api";

export interface LoginRequest {
	email: string;
	password: string;
	loginId: string;
}

export interface LoginSuccessData {
	redirectUri: string;
}

export function login(payload: LoginRequest) {
	return post<LoginSuccessData>("/api/auth/login", payload);
}
