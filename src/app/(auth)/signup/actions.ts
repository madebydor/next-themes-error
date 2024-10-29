"use server";

import { verifyPasswordStrength } from "@/lib/server/password";
import { RefillingTokenBucket } from "@/lib/server/rate-limit";
import { globalPOSTRateLimit } from "@/lib/server/request";
import { createSession, generateSessionToken, setSessionTokenCookie } from "@/lib/server/session";
import { checkUsernameAvailability, createUser, User, verifyUsernameInput } from "@/lib/server/user";
import { schema } from "@/schemas/user.schema";
import { headers } from "next/headers";
import { z } from "zod";

const ipBucket = new RefillingTokenBucket<string>(3, 10);

export async function signupAction(formData: z.output<typeof schema>): Promise<{ message?: string; user?: User }> {
	if (!globalPOSTRateLimit()) {
		return {
			message: "Too many requests"
		};
	}
	const headerList = await headers();

	// TODO: Assumes X-Forwarded-For is always included.
	const clientIP = headerList.get("X-Forwarded-For");
	if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
		return {
			message: "Too many requests"
		};
	}

	const email = formData.email;
	const username = formData.username;
	const password = formData.password;
	if (typeof username !== "string" || typeof password !== "string") {
		return {
			message: "אנא ודא כי מלאת את כל השדות"
		};
	}
	if (email === "" || password === "" || username === "") {
		return {
			message: "אנא ודא כי מלאת את כל השדות"
		};
	}

	if (!verifyUsernameInput(username)) {
		return {
			message: "שם משתמש לא תקין"
		};
	}

	const usernameAvailable = await checkUsernameAvailability(username);
	if (!usernameAvailable) {
		return {
			message: "שם משתמש כבר תפוס"
		};
	}

	const strongPassword = await verifyPasswordStrength(password);
	if (!strongPassword) {
		return {
			message: "סיסמא חלשה"
		};
	}
	if (clientIP !== null && !ipBucket.consume(clientIP, 1)) {
		return {
			message: "Too many requests"
		};
	}
	const user = await createUser({ email, username, password });

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	setSessionTokenCookie(sessionToken, session.expiresAt);

	return {
		user
	};
}
