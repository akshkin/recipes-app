"use server";

import { connectToDatabase } from "../mongoose";
import Review from "@/database-models/review.model";
import {
	CreateReviewParams,
	DeleteReviewParams,
	GetReviewParams,
} from "@/types";
import { revalidatePath } from "next/cache";
import { updateRecipeRating } from "./recipe.action";

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
		await review.save();
		await updateRecipeRating(recipe);
		revalidatePath(path);
	} catch (error) {
		console.log(error);
		throw new Error("Failed to create review");
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
		const { recipe, reviewId, path } = params;
		await Review.findByIdAndDelete(reviewId);
		await updateRecipeRating(recipe);
		revalidatePath(path);
	} catch (error: any) {
		throw new Error(error);
	}
}

export async function hasUserReviewedRecipe(userId: string, recipeId: string) {
	try {
		connectToDatabase();
		const review = await Review.find({
			user: userId,
			recipe: recipeId,
		});

		if (!review.length) return { canReview: true, mongoUserId: userId };

		return { canReview: false, mongoUserId: userId };
	} catch (error) {
		console.error(error);
		throw error;
	}
}
