import * as z from "zod";

export const RecipeSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must contain at least 5 characters" })
    .max(130),
  description: z
    .string()
    .min(20, { message: "Description must contain at least 20 characters" }),
  image: z.string().min(1),
  userId: z.string().min(1),
  category: z.string().min(1, { message: "Selecting category is required" }),
  cuisine: z.string().min(3, { message: "Selecting cuisine is required" }),
  ingredients: z.array(z.object({ ingredient: z.string().min(1) })).min(1),
  method: z
    .array(z.object({ step: z.string().min(1) }))
    .min(1, { message: "Adding at least 1 step is required" }),
});
