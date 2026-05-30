export interface ApiResponse<T> {
	success: true;
	data: T;
	error?: {
		message?: string;
	};
}

export class ApiError extends Error {
	status?: number;

	constructor(message: string, status?: number) {
		super(message);
		this.name = "ApiError";
		this.status = status;
	}
}

type JsonBody = object;
type RequestBody = JsonBody | FormData;
type RequestOptions = Omit<RequestInit, "body" | "method">;

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "");

function buildUrl(path: string) {
	if (!apiBaseUrl) {
		throw new ApiError("API base URL is not configured.");
	}

	return `${apiBaseUrl}/${path.replace(/^\/+/, "")}`;
}

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
	let payload: unknown;

	try {
		payload = await response.json();
	} catch {
		throw new ApiError("The server returned an invalid response.", response.status);
	}

	if (!payload || typeof payload !== "object" || !("success" in payload) || typeof payload.success !== "boolean") {
		throw new ApiError("The server returned an invalid response.", response.status);
	}

	return payload as ApiResponse<T>;
}

async function request<T>(method: string, path: string, body?: RequestBody, options: RequestOptions = {}): Promise<T> {
	const headers = new Headers(options.headers);
	headers.set("Accept", "application/json");

	const isFormData = body instanceof FormData;
	if (body && !isFormData) {
		headers.set("Content-Type", "application/json");
	}

	let response: Response;
	try {
		response = await fetch(buildUrl(path), {
			...options,
			method,
			headers,
			body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}

		throw new ApiError("Unable to reach the server. Please try again.");
	}

	const payload = await parseResponse<T>(response);

	if (!response.ok || !payload.success) {
		const message = payload.success ? `Request failed with status ${response.status}.` : payload.error?.message;
		throw new ApiError(message || "Something went wrong. Please try again.", response.status);
	}

	return payload.data;
}

export function get<T>(path: string, options?: RequestOptions) {
	return request<T>("GET", path, undefined, options);
}

export function post<T, TBody extends RequestBody = JsonBody>(path: string, body?: TBody, options?: RequestOptions) {
	return request<T>("POST", path, body, options);
}

export function put<T, TBody extends RequestBody = JsonBody>(path: string, body?: TBody, options?: RequestOptions) {
	return request<T>("PUT", path, body, options);
}

export function patch<T, TBody extends RequestBody = JsonBody>(path: string, body?: TBody, options?: RequestOptions) {
	return request<T>("PATCH", path, body, options);
}

export function del<T>(path: string, options?: RequestOptions) {
	return request<T>("DELETE", path, undefined, options);
}

export function getErrorMessage(error: unknown) {
	return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}
