import { post } from "@/utils/api";

export interface RegisterRequest {
	email: string;
	username: string;
	password: string;
	firstName: string;
	lastName: string;
	role: "SUPERUSER";
}

export interface RegisterData {
	email: string;
	id: string;
}

export function register(payload: RegisterRequest) {
	return post<RegisterData>("/api/auth/register", payload);
}
