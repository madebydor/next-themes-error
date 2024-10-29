import { z } from "zod";

export const schema = z.object({
  author: z.string().trim().min(1).max(40),
  title: z.string().trim().min(1).max(40),
});
