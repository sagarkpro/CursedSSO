import { post } from "@/utils/api";

export interface LoginRequest {
	email: string;
	password: string;
}

export interface AuthTokenData {
	accessToken: string;
}

export function login(payload: LoginRequest) {
	return post<AuthTokenData>("/api/auth/login", payload);
}
