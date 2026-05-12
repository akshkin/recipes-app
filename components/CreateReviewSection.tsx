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

	const mongoUser = await getMongoUserFromClerkId(userId!);
	if (!mongoUser) return;

	const result = await hasUserReviewedRecipe(mongoUser._id, recipeId);

	// show review form only if user is logged in and has not reviewed the recipe yet
	if (!userId || !result.canReview) return null;

	return (
		<CreateReview
			recipe={JSON.parse(JSON.stringify(recipeId))}
			user={mongoUser._id.toString()}
		/>
	);
}
