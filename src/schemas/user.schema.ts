import { z } from "zod";

export const schema = z.object({
	name: z.string().min(2, {
		message: "שדה זה אינו יכול להיות ריק"
	}),
	email: z
		.string()
		.min(2, {
			message: "שדה זה אינו יכול להיות ריק"
		})
		.optional(),
	username: z.string().min(2, {
		message: "שדה זה אינו יכול להיות ריק"
	}),
	password: z.string().min(2, {
		message: "שדה זה אינו יכול להיות ריק"
	}),
	companyId: z.string().optional()
});

export const loginSchema = z.object({
	username: z.string().min(2, {
		message: "שדה זה אינו יכול להיות ריק"
	}),
	password: z.string().min(2, {
		message: "שדה זה אינו יכול להיות ריק"
	})
});
