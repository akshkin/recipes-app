"use server";

import User from "@/database-models/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetSavedRecipesParams,
  SaveRecipeParams,
  UpdateUserBioAndLinksParams,
  UpdateUserParams,
} from "@/types";
import { revalidatePath } from "next/cache";
import Recipe from "@/database-models/recipe.model";
import { returnSortOptions } from "../utils";
import Category from "@/database-models/category.model";

export async function createUser(params: CreateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, email, name, image, username } = params;
    console.log(clerkId);
    const user = await User.create({ ...params });
    return user;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;
    console.log(clerkId);
    await User.findOneAndUpdate({ clerkId }, updateData, { new: true });

    revalidatePath(path);
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();

    const { clerkId } = params;

    const user = await User.findOne({ clerkId });

    if (!user) {
      return { message: "User not found" };
    }

    // get user recipes ids for deleting reviews later
    const userRecipes = await Recipe.find({ createdBy: user._id }).distinct(
      "_id"
    );

    // delete user recipes
    await Recipe.deleteMany({ createdBy: user._id });

    // TODO: delete user reviews
    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}

export async function getUserById(clerkId: string) {
  try {
    connectToDatabase();

    const user = await User.findOne({ clerkId });

    if (!user) {
      return { message: "User not found" };
    }
    return { user };
  } catch (error: any) {
    console.log(error);
    throw new Error(error?.message);
  }
}

export async function updateUserBioAndLinks(
  params: UpdateUserBioAndLinksParams
) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, { new: true });

    revalidatePath(path);
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}

export async function getMongoUserFromClerkId(clerkId: string) {
  try {
    connectToDatabase();

    const user = await User.findOne({ clerkId });
    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function getSavedPosts(params: GetSavedRecipesParams) {
  try {
    connectToDatabase();

    const { id, page = 1, pageSize = 10, filter, sort } = params;
    let category;

    if (filter) {
      category = await Category.findOne({ title: filter });
    }

    let sortOptions;

    if (sort) {
      sortOptions = returnSortOptions(sort);
    }

    const skipAmount = (page - 1) * pageSize;

    const user = await User.findOne({ clerkId: id }).populate({
      path: "saved",
      match: category ? { category } : {},
      options: {
        skip: skipAmount,
        limit: pageSize + 1,
        sort: sortOptions,
      },
      model: "Recipe",
      select: "_id title image",
    });

    if (!user) {
      return { message: "User not found" };
    }

    const isNextPage = user.saved.length > pageSize;

    return { savedPosts: user.saved, isNextPage };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function toggleSaveRecipe(params: SaveRecipeParams) {
  try {
    connectToDatabase();
    const { userId, recipeId, path } = params;

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return { message: "User not found" };
    }
    if (user.saved.includes(recipeId)) {
      await User.findOneAndUpdate(
        { clerkId: userId },
        {
          $pull: { saved: recipeId },
        },
        { new: true }
      );
    } else {
      await User.findOneAndUpdate(
        { clerkId: userId },
        { $addToSet: { saved: recipeId } },
        { new: true }
      );
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
