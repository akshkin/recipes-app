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

export interface GetAllRecipesParams {
  filter?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}

export interface GetRecipeByTitleParams {
  title: string;
}
export interface GetRecipeByCategoryTitleParams {
  title: string;
}
