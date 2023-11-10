import Image from "next/image";
import React from "react";

function RatingNumber({ value }: { value: number }) {
  const emptyArray = new Array(5).fill("");
  return (
    <div className="flex items-center">
      {value > 0 ? (
        <>
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
        </>
      ) : (
        <>
          {emptyArray.map((_, index) => (
            <Image
              key={`star ${index}`}
              src="/assets/icons/outline-star.svg"
              alt={`outline star ${index + 1}`}
              width={20}
              height={20}
              className="mr-0.5"
            />
          ))}
        </>
      )}
    </div>
  );
}

export default RatingNumber;
