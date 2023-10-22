"use server";

import Recipe from "@/database-models/recipe.model";
import { connectToDatabase } from "../mongoose";
import Category from "@/database-models/category.model";
import { revalidatePath } from "next/cache";
import Cuisine from "@/database-models/cuisine.model";
import { CreateRecipeParams, GetAllRecipesParams } from "@/types";

export async function createRecipe(params: CreateRecipeParams) {
  try {
    connectToDatabase();

    const {
      title,
      description,
      category,
      image,
      userId,
      cuisine,
      ingredients,
      method,
      path,
    } = params;

    const existingRecipeTitle = await Recipe.findOne({ title });

    if (existingRecipeTitle) {
      throw new Error(
        `Recipe title already exists. Please provide another recipe title`
      );
    }

    const recipe = await Recipe.create({
      title,
      description,
      createdBy: userId,
      ingredients,
      method,
      image,
    });

    await recipe.save();

    const [existingCategory, existingCuisine] = await Promise.all([
      Category.findOne({ title: category }),
      Cuisine.findOne({ title: cuisine }),
    ]);

    let newCategory;
    let newCuisine;

    if (!existingCategory) {
      newCategory = new Category({
        title: category,
        recipes: [recipe._id], // Add the new recipe's ID to the category's recipes array.
      });
      await newCategory.save();
    } else {
      existingCategory.recipes.push(recipe._id); // Add the new recipe's ID to the existing category's recipes array.
      await existingCategory.save();
    }

    if (!existingCuisine) {
      newCuisine = new Cuisine({
        title: cuisine,
        recipes: [recipe._id], // Add the new recipe's ID to the cuisine's recipes array.
      });
      await newCuisine.save();
    } else {
      existingCuisine.recipes.push(recipe._id); // Add the new recipe's ID to the existing cuisine's recipes array.
      await existingCuisine.save();
    }

    await Recipe.findByIdAndUpdate(recipe._id, {
      category: existingCategory?._id || newCategory._id,
      cuisine: existingCuisine?._id || newCuisine._id,
    });

    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}

export async function getRecipes(params: GetAllRecipesParams) {
  try {
    connectToDatabase();
    const { page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;

    const recipes = await Recipe.find({})
      .limit(pageSize)
      .skip(skipAmount)
      .sort({ createdAt: -1 });

    return { recipes };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
