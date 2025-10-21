/*
	auth.ts
	Tiny fetch wrapper around the backend auth endpoints. Frontend apps can import this module
	to avoid duplicating URL strings or response typing. The functions intentionally mirror the
	backend service contract so swapping transport layers later (e.g. GraphQL, gRPC) is easier.
*/

import type { User } from "@repo/types/user";

export interface AuthTokens {
	tokenType: "Bearer";
	accessToken: string;
	accessTokenExpiresAt: string;
	refreshToken: string;
	refreshTokenExpiresAt: string;
}

export interface SessionView {
	id: string;
	userId: string;
	refreshTokenVersion: number;
	passwordVersion: number;
	status: "active" | "revoked" | "expired" | "replaced";
	ipAddress?: string;
	userAgent?: string;
	createdAt: string;
	lastSeenAt: string;
	expiresAt: string;
	revokedAt?: string;
	revokedReason?: string;
}

export interface AuthenticationResult {
	user: User;
	session: SessionView;
	tokens: AuthTokens;
}

export interface RegisterRequest {
	email: string;
	password: string;
	issueSession?: boolean;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RefreshRequest {
	refreshToken: string;
}

export interface LogoutRequest {
	sessionId: string;
	userId?: string;
	reason?: string;
}

export interface LogoutAllRequest {
	userId: string;
	excludeSessionId?: string;
	reason?: string;
}

export interface AuthClientOptions {
	baseUrl?: string;
	fetchImpl?: typeof fetch;
}

const inferBaseUrl = (): string => {
	const env = ((): Record<string, string | undefined> | undefined => {
		if (typeof globalThis === "undefined") return undefined;
		const maybeProcess = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
		return maybeProcess?.env;
	})();

	if (env?.VITE_API_BASE) {
		return env.VITE_API_BASE;
	}

	if (env?.API_BASE) {
		return env.API_BASE;
	}
	if (typeof window !== "undefined") {
		const fromWindow = (window as unknown as { __API_BASE?: string }).__API_BASE;
		if (fromWindow) return fromWindow;
		return `${window.location.origin}`;
	}
	return "http://localhost:5174";
};

export function createAuthClient(options: AuthClientOptions = {}) {
	const baseUrl = options.baseUrl ?? inferBaseUrl();
	const fetchImpl = options.fetchImpl ?? globalThis.fetch.bind(globalThis);

	const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
		const response = await fetchImpl(`${baseUrl}${path}`, {
			headers: { "content-type": "application/json", ...(init.headers ?? {}) },
			...init,
		});
		if (response.status === 204) {
			return undefined as T;
		}
		const payload = await response.json().catch(() => undefined);
		if (!response.ok) {
			throw new Error(payload?.error ?? `request_failed:${response.status}`);
		}
		return payload as T;
	};

	return {
		register: (input: RegisterRequest) =>
			request<AuthenticationResult | { user: User }>("/auth/register", {
				method: "POST",
				body: JSON.stringify(input),
			}),

		login: (input: LoginRequest) =>
			request<AuthenticationResult>("/auth/login", {
				method: "POST",
				body: JSON.stringify(input),
			}),

		refresh: (input: RefreshRequest) =>
			request<AuthenticationResult>("/auth/refresh", {
				method: "POST",
				body: JSON.stringify(input),
			}),

		logout: (input: LogoutRequest) =>
			request<void>("/auth/logout", {
				method: "POST",
				body: JSON.stringify(input),
			}),

		logoutAll: (input: LogoutAllRequest) =>
			request<void>("/auth/logout-all", {
				method: "POST",
				body: JSON.stringify(input),
			}),

		listSessions: async (userId: string) => {
			const result = await request<{ sessions: SessionView[] }>(
				`/auth/sessions?userId=${encodeURIComponent(userId)}`,
				{ method: "GET" },
			);
			return result.sessions;
		},
	} as const;
}
