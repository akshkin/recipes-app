"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import CreateReview from "./forms/CreateReview";
import { hasUserReviewedRecipe } from "@/lib/actions/review.action";

export default function CreateReviewSection({
	recipeId,
}: {
	recipeId: string;
}) {
	const { userId } = useAuth();

	const [canReview, setCanReview] = useState(false);
	const [mongoUserId, setMongoUserId] = useState("");

	useEffect(() => {
		if (!userId) return;

		async function checkReviewStatus() {
			const result = await hasUserReviewedRecipe(userId!, recipeId);
			setCanReview(result.canReview);
			setMongoUserId(result.mongoUserId);
		}

		checkReviewStatus();
	}, [recipeId, userId]);

	if (!userId || !canReview) return null;

	return <CreateReview recipe={recipeId} user={mongoUserId} />;
}
