import Image from "next/image";
import React from "react";

function RatingNumber({ value }: { value: number }) {
  return (
    <div className="flex items-center">
      {Array.from({ length: value }, (_, i) => (
        <span key={i}>
          <Image
            src="/assets/icons/star.svg"
            alt={`star ${i + 1}`}
            width={20}
            height={20}
            className="mr-1"
          />
        </span>
      ))}
      {value > Math.floor(value) ? (
        <Image
          src="/assets/icons/half-star.svg"
          alt="half-star"
          width={20}
          height={20}
        />
      ) : null}
    </div>
  );
}

export default RatingNumber;
