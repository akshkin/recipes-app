export interface CreateRecipeParams {
  title: string;
  description: string;
  category: string;
  image: string;
  createdBy: string;
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

export interface CreateUserParams {
  clerkId: string;
  name: string;
  username: string;
  image: string;
  email: string;
}
export interface UpdateUserParams {
  clerkId: string;
  updateData: {
    name: string;
    username: string;
    image: string;
    email: string;
  };
  path: string;
}

export interface DeleteUserParams {
  clerkId: string;
}

export interface UpdateUserBioAndLinksParams {
  clerkId: string;
  updateData: {
    bio?: string;
    socialLinks: {
      instagram?: string;
      facebook?: string;
      youtube?: string;
    };
  };
  path: string;
}

export interface CreateReviewParams {
  user: string;
  recipe: string;
  rating: number;
  comment: string;
  path: string;
}

export interface GetReviewParams {
  recipe: string;
}
export interface DeleteReviewParams {
  reviewId: string;
  path: string;
}
