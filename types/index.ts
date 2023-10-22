export interface CreateRecipeParams {
  title: string;
  description: string;
  category: string;
  image: string;
  userId: string;
  cuisine: string;
  ingredients: { ingredient: string }[];
  method: { step: string }[];
  path: string;
}
