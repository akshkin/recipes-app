"use server";

import { connectToDatabase } from "../mongoose";
import Review from "@/database-models/review.model";
import { CreateReviewParams, GetReviewParams } from "@/types";
import { revalidatePath } from "next/cache";

export async function createReview(params: CreateReviewParams) {
  try {
    connectToDatabase();

    const { user, recipe, comment, rating, path } = params;

    const review = await Review.create({
      user,
      recipe,
      comment,
      rating,
    });

    revalidatePath(path);

    // return { review };
  } catch (error) {
    console.log(error);
  }
}

export async function getReviews(params: GetReviewParams) {
  try {
    connectToDatabase();
    const { recipe } = params;

    const reviews = await Review.find({ recipe }).populate({
      path: "user",
      model: "User",
      select: "name",
    });
    return { reviews };
  } catch (error) {
    console.log(error);
  }
}
