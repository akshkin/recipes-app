import { MessageSquareHeart } from "lucide-react";
import CreateReviewSection from "./CreateReviewSection";
import ReviewCard from "./cards/ReviewCard";
import { getReviews } from "@/lib/actions/review.action";

async function ReviewsSection({ id }: { id: string }) {
	const reviewsResult = await getReviews({ recipe: id });
	return (
		<section className="py-6 mx-auto ">
			<CreateReviewSection recipeId={id} />

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
