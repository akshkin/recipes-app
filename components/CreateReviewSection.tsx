import CreateReview from "./forms/CreateReview";
import { hasUserReviewedRecipe } from "@/lib/actions/review.action";
import { getMongoUserFromClerkId } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { BadgeCheck, MessageSquareHeart } from "lucide-react";

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

	return (
		<>
			{result.canReview ? (
				<div className="flex max-sm:flex-col gap-4">
					<div className="flex-1">
						<CreateReview
							recipe={JSON.parse(JSON.stringify(recipeId))}
							user={mongoUser._id.toString()}
						/>
					</div>
					<div className="flex flex-grow-0 flex-col gap-4 bg-gray-100 p-4 rounded-md text-sm text-gray-700 sm:max-w-[250px] items-center justify-between max-sm:hidden">
						<MessageSquareHeart size={100} />
						<p>
							Your feedback matters. Please provide your honest feedback and
							rating. Your review will help others in the community make
							informed decisions about trying this recipe.
						</p>
					</div>
				</div>
			) : (
				<p className="my-3 flex items-center gap-2 text-md text-gray-500">
					<BadgeCheck color="green" />
					Thank you for taking the time to review this recipe.
				</p>
			)}
		</>
	);
}
