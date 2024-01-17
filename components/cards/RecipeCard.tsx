import Image from "next/image";
import Link from "next/link";
import React from "react";
import RatingNumber from "../RatingNumber";
import { formatNumber } from "@/lib/utils";

interface RecipeProps {
  _id: string;
  image: string;
  title: string;
  averageRating: number;
  ratingCount: number;
}

function RecipeCard({
  title,
  image,
  _id,
  averageRating,
  ratingCount,
}: RecipeProps) {
  return (
    <Link
      href={`/recipe/${title}`}
      className="relative border-[1px] rounded-lg max-xs:w-full max-sm:w-[190px] max-md:w-[220px] min-w-[190px] w-[342px] max-lg:h-[250px] h-[280px] hover:scale-105 focus:scale-105 transition-transform shadow-md"
    >
      <Image
        src={image}
        alt="recipe"
        width={200}
        height={120}
        className="z-0 w-full h-2/3 object-cover rounded-t-lg"
      />

      <div className="p-2 flex flex-col">
        <h2 className=" text-left text-primary-700 h3 capitalize line-clamp-1">
          {title}
        </h2>
        <div className="flex gap-2">
          <RatingNumber value={averageRating} />
          <span className={`text-sm text-gray-${ratingCount ? 700 : 400}`}>
            ({formatNumber(ratingCount)}{" "}
            {ratingCount === 1 ? "rating" : "ratings"})
          </span>
        </div>
      </div>
    </Link>
  );
}

export default RecipeCard;
