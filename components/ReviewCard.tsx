import React from "react";
import Image from "next/image";
import DeleteAction from "./DeleteAction";

export interface ReviewProps {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  userClerkId: string;
  userImage: string;
  date: Date;
}

function ReviewCard({
  _id,
  userName,
  comment,
  rating,
  userClerkId,
  userImage,
  date,
}: ReviewProps) {
  return (
    <div className="mb-4 max-w-[500px] bg-light-800 p-3 rounded-lg">
      <h4 className="font-semibold flex gap-2 items-center">
        <Image
          src={userImage}
          alt="avatar"
          width={30}
          height={30}
          className="rounded-full object-cover"
        />
        {userName}{" "}
        <div className="flex items-center">
          {Array.from({ length: rating }, (_, i) => (
            <span key={i}>
              <Image
                src="/assets/icons/star.svg"
                alt="star"
                width={20}
                height={20}
                className="mr-1"
              />
            </span>
          ))}
        </div>
      </h4>
      <p className="my-3">{comment}</p>
      <div className="flex justify-between items-end">
        <small className="italic text-gray-500">
          posted {date.toDateString()}
        </small>

        <DeleteAction
          userClerkId={userClerkId}
          type="review"
          id={_id.toString()}
        />
      </div>
    </div>
  );
}

export default ReviewCard;
