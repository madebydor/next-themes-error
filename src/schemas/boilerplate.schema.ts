import { z } from "zod";

export const schema = z.object({
	author: z.string().trim().min(1, "Author is required"),
	title: z.string().trim().min(1, "Title is required")
});
