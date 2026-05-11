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

export async function calculateAverageRatingAndCountForRecipe(
	recipeId: string,
) {
	try {
		connectToDatabase();
		const result = await Review.aggregate([
			{
				$match: { recipe: recipeId },
			},
			{
				$group: {
					_id: "$recipe",
					averageRating: { $avg: "$rating" },
					countRatings: { $sum: 1 },
				},
			},
		]);

		const { averageRating, countRatings } = result[0] || {
			averageRating: 0,
			countRatings: 0,
		};
		return { averageRating, countRatings };
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function hasUserReviewedRecipe(userId: string, recipeId: string) {
	try {
		connectToDatabase();
		const review = await Review.exists({
			"user.clerkId": userId,
			recipe: recipeId,
		});
		if (!review) return { canReview: true, mongoUserId: userId };

		return { canReview: false, mongoUserId: userId };
	} catch (error) {
		console.error(error);
		throw error;
	}
}
