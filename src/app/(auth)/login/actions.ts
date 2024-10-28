"use server";

import { verifyPasswordHash } from "@/lib/server/password";
import { RefillingTokenBucket, Throttler } from "@/lib/server/rate-limit";
import { globalPOSTRateLimit } from "@/lib/server/request";
import { createSession, generateSessionToken, setSessionTokenCookie } from "@/lib/server/session";
import { getUserFromUsername, getUserPasswordHash, User } from "@/lib/server/user";
import { loginSchema } from "@/schemas/user.schema";
import { headers } from "next/headers";
import { z } from "zod";

const throttler = new Throttler<string>([1, 2, 4, 8, 16, 30, 60, 180, 300]);
const ipBucket = new RefillingTokenBucket<string>(20, 1);

export async function loginAction(
	formData: z.output<typeof loginSchema>
): Promise<{ user?: User | null; message?: string }> {
	if (!globalPOSTRateLimit()) {
		return {
			message: "Too many requests"
		};
	}
	// TODO: Assumes X-Forwarded-For is always included.
	const headerList = await headers();
	const clientIP = headerList.get("X-Forwarded-For");
	if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
		return {
			message: "Too many requests"
		};
	}

	const username = formData.username;
	const password = formData.password;

	if (typeof username !== "string" || typeof password !== "string") {
		return {
			message: "אנא ודא כי מלאת את כל השדות"
		};
	}
	if (username === "" || password === "") {
		return {
			message: "אנא ודא כי מלאת את כל השדות"
		};
	}
	// if (!verifyEmailInput(username)) {
	// 	return {
	// 		message: "Invalid email"
	// 	};
	// }
	const user = await getUserFromUsername(username);
	if (user === null) {
		return {
			message: "החשבון לא קיים"
		};
	}
	if (clientIP !== null && !ipBucket.consume(clientIP, 1)) {
		return {
			message: "Too many requests"
		};
	}
	if (!throttler.consume(user.id)) {
		return {
			message: "Too many requests"
		};
	}

	const passwordHash = await getUserPasswordHash(user.id);
	const validPassword = await verifyPasswordHash(passwordHash, password);
	if (!validPassword) {
		return {
			message: "סיסמא לא נכונה"
		};
	}
	throttler.reset(user.id);

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	await setSessionTokenCookie(sessionToken, session.expiresAt);

	return {
		user
	};
}
