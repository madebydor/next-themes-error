"use server";

import { db } from "./db";
import { hashPassword } from "./password";
import { createSession, generateSessionToken, setSessionTokenCookie } from "./session";

export async function verifyUsernameInput(username: string): Promise<boolean> {
	return username.length > 3 && username.length < 32 && username.trim() === username;
}

export async function createUser({
	googleId,
	password,
	email,
	username,
	name,
	image
}: {
	googleId?: string;
	password?: string;
	username?: string;
	email?: string;
	name?: string;
	image?: string | null;
}): Promise<User> {
	const hashedPassword = password ? await hashPassword(password) : null;

	const user = await db.user.create({
		data: {
			googleId,
			email,
			hashedPassword,
			username: username ?? "",
			name: name ?? "",
			image
		}
	});
	if (user === null) {
		throw new Error("Unexpected error");
	}

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	await setSessionTokenCookie(sessionToken, session.expiresAt);
	return {
		id: user.id,
		googleId: googleId ?? "",
		email,
		name: name ?? "",
		image: image ?? "",
		companyId: null
	};
}

export async function getUserFromGoogleId(googleId: string): Promise<User | null> {
	const row = await db.user.findUnique({
		where: {
			googleId
		}
	});
	if (row === null) {
		return null;
	}
	const user: User = {
		id: row.id,
		googleId: row.googleId!,
		email: row.email!,
		name: row.name!,
		image: row.image!,
		companyId: row.companyId
	};
	return user;
}

export async function checkUsernameAvailability(username: string): Promise<boolean> {
	const row = await db.user.findFirst({ where: { username } });
	return row === null;
}

export async function getUserPasswordHash(userId: string): Promise<string> {
	const row = await db.user.findUnique({ where: { id: userId } });
	if (row === null) {
		throw new Error("Invalid user ID");
	}
	return row.hashedPassword!;
}

export async function getUserFromUsername(username: string): Promise<User | null> {
	const row = await db.user.findFirst({ where: { username } });
	if (row === null) {
		return null;
	}
	const user: User = {
		id: row.id,
		email: row.email!,
		username: row.username!,
		companyId: row.companyId
	};
	return user;
}

export interface User {
	id: string;
	email?: string;
	username?: string;
	companyId: string | null;
	passwordHash?: string;
	googleId?: string;
	name?: string;
	image?: string;
}
