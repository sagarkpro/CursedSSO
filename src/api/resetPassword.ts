import { patch, post } from "@/utils/api";

export function requestPasswordReset(email: string) {
	return post<{ success: boolean }>(`/api/auth/${encodeURIComponent(email)}/help-a-goldfish-find-its-password`);
}

export interface UpdatePasswordRequest {
	email: string;
	token: string;
	password: string;
}

export function updatePassword(payload: UpdatePasswordRequest) {
	return patch<{ success: boolean }>("/api/auth/update-password", payload);
}
