import * as z from "zod";

export const RecipeSchema = z.object({
  title: z.string().min(5).max(130),
  description: z.string().min(20),
  image: z.string().min(1),
  author: z.string().min(1),
  category: z.string().min(1),
  cuisine: z.string().min(3),
  ingredients: z.array(z.object({ ingredient: z.string().min(1) })).min(1),
  method: z.array(z.object({ step: z.string().min(1) })).min(1),
});
