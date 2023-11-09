"use server";

import Category from "@/database-models/category.model";
import { connectToDatabase } from "../mongoose";
import { GetRecipeByCategoryTitleParams } from "@/types";
import Recipe from "@/database-models/recipe.model";
import { returnSortOptions } from "../utils";
import { getRecipesWithAverageRating } from "./recipe.action";

export async function getRecipesByCategory(
  params: GetRecipeByCategoryTitleParams
) {
  try {
    connectToDatabase();
    const { title, page = 1, pageSize = 10, sort } = params;

    let sortOptions = {};

    if (sort) {
      sortOptions = returnSortOptions(sort);
    }

    const skipAmount = (page - 1) * pageSize;

    const category = await Category.findOne({ title }).populate({
      path: "recipes",
      model: Recipe,
      options: { skip: skipAmount, limit: pageSize + 1, sort: sortOptions },
    });

    const recipes = category.recipes;

    const recipesWithRating = await getRecipesWithAverageRating(recipes);

    const isNextPage = recipesWithRating.length > pageSize;

    return { recipes: recipesWithRating, isNextPage };
  } catch (error) {
    console.log(error);
  }
}
