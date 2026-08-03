import CreateReview from "./forms/CreateReview";
import { hasUserReviewedRecipe } from "@/lib/actions/review.action";
import { getMongoUserFromClerkId } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";

export default async function CreateReviewSection({
	recipeId,
}: {
	recipeId: string;
}) {
	const { userId } = await auth();

	if (!userId) {
		return (
			<div>
				<CreateReview recipe={JSON.parse(JSON.stringify(recipeId))} user={""} />
				<p className="-mt-4 text-xs text-gray-500 mb-6">
					You would need to log in to write a review.
				</p>
			</div>
		);
	}

	const mongoUser = await getMongoUserFromClerkId(userId);
	if (!mongoUser) return;

	const result = await hasUserReviewedRecipe(mongoUser._id, recipeId);

	// show review form only if user is logged in and has not reviewed the recipe yet
	if (!result.canReview) return null;

	return (
		<CreateReview
			recipe={JSON.parse(JSON.stringify(recipeId))}
			user={mongoUser._id.toString()}
		/>
	);
}
