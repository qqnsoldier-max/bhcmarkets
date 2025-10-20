import type { HttpRequest, HttpResponse } from "../types.js";
import { validateLogin } from "../validators/authValidator.js";

export const login = async (req: HttpRequest): Promise<HttpResponse> => {
	// Contract only; actual auth implementation will be added later
	const { email, password } = validateLogin(req.body);
	// NEXT: call AuthService.login(email, password)
	return {
		status: 200,
		body: { accessToken: "", refreshToken: "", user: { email } },
	};
};

