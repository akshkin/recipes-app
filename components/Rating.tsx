import React from "react";
import Image from "next/image";

interface RatingProps {
  ratingValue: number;
  setRatingValue: (value: number) => void;
}

function Rating({ ratingValue, setRatingValue }: RatingProps) {
  const ratingArray = ["", "", "", "", ""];

  function setStarRating(index: number) {
    index + 1 === ratingValue ? setRatingValue(0) : setRatingValue(index + 1);
  }

  return (
    <div className="flex gap-1">
      {ratingArray.map((_, index) => (
        <span
          className="cursor-pointer text-3xl text-yellow-600"
          key={`star-${index}`}
          onClick={() => setStarRating(index)}
        >
          {index + 1 <= ratingValue ? (
            <Image
              src="/assets/icons/star.svg"
              alt="filled-star"
              width={20}
              height={20}
            />
          ) : (
            <Image
              src="/assets/icons/outline-star.svg"
              alt="outline-star"
              width={20}
              height={20}
            />
          )}
        </span>
      ))}
    </div>
  );
}

export default Rating;
