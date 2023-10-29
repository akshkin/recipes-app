"use server";

import User from "@/database-models/user.model";
import { connectToDatabase } from "../mongoose";
import { CreateUserParams, DeleteUserParams, UpdateUserParams } from "@/types";
import { revalidatePath } from "next/cache";
import Recipe from "@/database-models/recipe.model";

export async function createUser(params: CreateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, email, name, image, username } = params;

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

    console.log(user);

    if (!user) {
      return { message: "User not found" };
    }
    return { user };
  } catch (error: any) {
    console.log(error);
    throw new Error(error?.message);
  }
}
