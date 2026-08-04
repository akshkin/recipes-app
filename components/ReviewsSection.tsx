import { MessageSquareHeart } from "lucide-react";
import CreateReviewSection from "./CreateReviewSection";
import ReviewCard from "./cards/ReviewCard";
import { getReviews } from "@/lib/actions/review.action";

async function ReviewsSection({ id }: { id: string }) {
	const reviewsResult = await getReviews({ recipe: id });
	return (
		<section className="px-6 lg:px-8 py-6 mx-auto">
			<div className="flex max-sm:flex-col gap-4">
				<div className="flex-1">
					<CreateReviewSection recipeId={id} />
				</div>
				<div className="flex flex-grow-0 flex-col gap-4 bg-gray-100 p-4 rounded-md text-sm text-gray-700 sm:max-w-[250px] items-center justify-between max-sm:hidden">
					<MessageSquareHeart size={100} />
					<p>
						Your feedback matters. Please provide your honest feedback and
						rating. Your review will help others in the community make informed
						decisions about trying this recipe.
					</p>
				</div>
			</div>

			{reviewsResult?.reviews && reviewsResult?.reviews?.length > 0 ? (
				<div className="mb-4 ">
					<h3 className="font-bold h3 mb-4">What others are saying</h3>
					{reviewsResult?.reviews.map((review) => (
						<ReviewCard
							key={review._id}
							userImage={review.user.image}
							userName={review.user.name}
							comment={review.comment}
							_id={review._id.toString()}
							rating={review.rating}
							userClerkId={review.user.clerkId}
							date={review.createdAt}
							recipeId={id}
						/>
					))}
				</div>
			) : null}
		</section>
	);
}

export default ReviewsSection;
