export const ACCESS_TOKEN_KEY = "accessToken";
export const PENDING_VERIFICATION_EMAIL_KEY = "pendingVerificationEmail";
export const PENDING_LOGIN_ID_KEY = "pendingLoginId";

export function saveAccessToken(accessToken: string) {
	localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

export function savePendingVerificationEmail(email: string) {
	localStorage.setItem(PENDING_VERIFICATION_EMAIL_KEY, email);
}

export function getPendingVerificationEmail() {
	return localStorage.getItem(PENDING_VERIFICATION_EMAIL_KEY);
}

export function clearPendingVerificationEmail() {
	localStorage.removeItem(PENDING_VERIFICATION_EMAIL_KEY);
}

export function savePendingLoginId(loginId: string) {
	localStorage.setItem(PENDING_LOGIN_ID_KEY, loginId);
}

export function getPendingLoginId() {
	return localStorage.getItem(PENDING_LOGIN_ID_KEY);
}

export function clearPendingLoginId() {
	localStorage.removeItem(PENDING_LOGIN_ID_KEY);
}
