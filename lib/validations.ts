import * as z from "zod";
import { isUrlValid } from "./utils";

export const RecipeSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must contain at least 5 characters" })
    .max(130),
  description: z
    .string()
    .min(20, { message: "Description must contain at least 20 characters" }),
  image: z.string().min(1),
  category: z.string().min(1, { message: "Selecting category is required" }),
  cuisine: z.string().min(3, { message: "Selecting cuisine is required" }),
  ingredients: z.array(z.object({ ingredient: z.string().min(1) })).min(1),
  method: z
    .array(z.object({ step: z.string().min(1) }))
    .min(1, { message: "Adding at least 1 step is required" }),
});

export const ProfileSchema = z.object({
  bio: z.string().optional(),
  socialLinks: z.object({
    instagram: z
      .string()
      .optional()
      .refine((value) => !value || isUrlValid(value), {
        message: "Please enter a valid URL for Facebook",
      }),
    facebook: z
      .string()
      .optional()
      .refine((value) => !value || isUrlValid(value), {
        message: "Please enter a valid URL for Facebook",
      }),
    youtube: z
      .string()
      .optional()
      .refine((value) => !value || isUrlValid(value), {
        message: "Please enter a valid URL for Facebook",
      }),
  }),
});

export const ReviewSchema = z.object({
  comment: z.string().min(3),
});
