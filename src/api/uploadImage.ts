import { post } from "@/utils/api";

export interface UploadImageRequest {
	email: string;
	profileImage: File;
}

export function uploadImage({ email, profileImage }: UploadImageRequest) {
	const formData = new FormData();
	formData.append("profileImage", profileImage);

	return post<string>(`/api/auth/${encodeURIComponent(email)}/upload-profile-image`, formData);
}
