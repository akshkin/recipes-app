"use client";

import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import { deleteReview } from "@/lib/actions/review.action";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/nextjs";

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
  const pathname = usePathname();
  const { userId } = useAuth();

  async function handleClick() {
    try {
      if (window.confirm("Are you sure you want to delete this review?")) {
        await deleteReview({ reviewId: _id, path: pathname });
        toast.success("Review was successfully deleted");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

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
        {userId === userClerkId && (
          <Button className="danger-btn" onClick={handleClick}>
            Delete
            <Image
              src="/assets/icons/delete.svg"
              alt="delete"
              width={20}
              height={20}
              className="ml-1"
            />
          </Button>
        )}
      </div>
    </div>
  );
}

export default ReviewCard;
