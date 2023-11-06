"use server";

import Recipe from "@/database-models/recipe.model";
import { connectToDatabase } from "../mongoose";
import Category from "@/database-models/category.model";
import { revalidatePath } from "next/cache";
import Cuisine from "@/database-models/cuisine.model";
import {
  CreateRecipeParams,
  DeleteRecipeParams,
  EditRecipeParams,
  GetAllRecipesParams,
  GetRecipeByTitleParams,
} from "@/types";
import User from "@/database-models/user.model";

export async function createRecipe(params: CreateRecipeParams) {
  try {
    connectToDatabase();

    const {
      title,
      description,
      category,
      image,
      createdBy,
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
      createdBy,
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
    const { page = 1, pageSize = 20 } = params;

    const skipAmount = (page - 1) * pageSize;

    const recipes = await Recipe.find({})
      .limit(pageSize)
      .skip(skipAmount)
      .sort({ createdAt: -1 });

    const totalRecipes = await Recipe.countDocuments();

    const isNextPage = totalRecipes > skipAmount + recipes.length;

    return { recipes, isNextPage };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getRecipeByTitle(params: GetRecipeByTitleParams) {
  try {
    connectToDatabase();
    const { title } = params;

    const recipe = await Recipe.findOne({ title })
      .populate({
        path: "createdBy",
        model: User,
        select: "name clerkId",
      })
      .populate({ path: "category", model: "Category", select: "title" })
      .populate({ path: "cuisine", model: "Cuisine", select: "title" });

    if (!recipe) {
      return { error: "Recipe not found" };
    }

    return { recipe };
  } catch (error) {
    throw error;
  }
}

export async function getRecipesByUserId(id: string) {
  try {
    connectToDatabase();
    const recipes = await Recipe.find({ createdBy: id });
    return recipes;
  } catch (error) {
    console.log(error);
  }
}

export async function getRecipeById(id: string) {
  try {
    connectToDatabase();
    const recipe = await Recipe.findById(id)
      .populate({ path: "category", model: "Category", select: "title" })
      .populate({ path: "cuisine", model: "Cuisine", select: "title" });

    if (!recipe) {
      return { message: "Recipe not found" };
    }
    return { recipe };
  } catch (error) {
    console.log(error);
  }
}

export async function editRecipe(params: EditRecipeParams) {
  try {
    connectToDatabase();
    const { _id, updateData, path } = params;

    const [existingCategory, existingCuisine] = await Promise.all([
      Category.findOne({ title: updateData.category }),
      Cuisine.findOne({ title: updateData.cuisine }),
    ]);

    const existingTitle = await Recipe.findOne({
      _id: { $ne: _id },
      title: updateData.title,
    });

    if (existingTitle) {
      throw new Error(
        "Recipe title already exists. Please choose another title."
      );
    }

    const recipe = await Recipe.findByIdAndUpdate(
      _id,
      {
        ...updateData,
        category: existingCategory._id,
        cuisine: existingCuisine._id,
      },
      { new: true }
    );

    revalidatePath(path);
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
}

export async function deleteRecipe(params: DeleteRecipeParams) {
  try {
    connectToDatabase();
    const { id, path } = params;

    const recipe = await Recipe.findByIdAndDelete(id);

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
