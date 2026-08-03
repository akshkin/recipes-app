import React from "react";
import Image from "next/image";
import DeleteAction from "../DeleteAction";
import RatingNumber from "../RatingNumber";

export interface ReviewProps {
	_id: string;
	userName: string;
	rating: number;
	comment: string;
	userClerkId: string;
	userImage: string;
	date: Date;
	recipeId: string;
}

function ReviewCard({
	_id,
	userName,
	comment,
	rating,
	userClerkId,
	userImage,
	date,
	recipeId,
}: ReviewProps) {
	return (
		<div className="mb-4 bg-light-800 p-3 rounded-lg">
			<h4 className="font-semibold flex gap-2 max-sm:flex-col md:items-center">
				<span className="flex items0center gap-2">
					<Image
						src={userImage}
						alt="avatar"
						width={30}
						height={30}
						className="rounded-full object-cover"
					/>
					{userName}
				</span>
				<RatingNumber value={rating} />
			</h4>
			<p className="my-3">{comment}</p>
			<div className="flex justify-between items-end">
				<small className="italic text-gray-500">
					posted {date.toDateString()}
				</small>

				<DeleteAction
					recipeId={recipeId}
					userClerkId={userClerkId}
					type="review"
					id={_id.toString()}
				/>
			</div>
		</div>
	);
}

export default ReviewCard;
