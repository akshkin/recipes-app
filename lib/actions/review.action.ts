"use server";

import { connectToDatabase } from "../mongoose";
import Review from "@/database-models/review.model";
import {
  CreateReviewParams,
  DeleteReviewParams,
  GetReviewParams,
} from "@/types";
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
      select: "name clerkId image",
    });

    return { reviews };
  } catch (error) {
    console.log(error);
  }
}

export async function deleteReview(params: DeleteReviewParams) {
  try {
    connectToDatabase();
    const { reviewId, path } = params;
    await Review.findByIdAndDelete(reviewId);
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(error);
  }
}


