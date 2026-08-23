import Image from "next/image";
import Link from "next/link";
import React from "react";
import RatingNumber from "../RatingNumber";
import { formatNumber } from "@/lib/utils";
import { publicImageUrl } from "@/lib/constants";

interface RecipeProps {
	_id: string;
	image: string;
	title: string;
	averageRating: number;
	ratingsCount: number;
	width?: boolean;
}

function RecipeCard({
	title,
	image,
	_id,
	averageRating,
	ratingsCount,
	width,
}: RecipeProps) {
	return (
		<Link
			href={`/recipe/${title}`}
			className={`relative border-[1px] rounded-lg h-[280px] hover:scale-105 focus:scale-105 transition-transform shadow-md min-w-[250px] ${width ? "" : "w-full"}`}
		>
			<div className="relative w-full h-2/3">
				<Image
					src={`${publicImageUrl}/${image}`}
					alt="recipe"
					fill
					className="z-0 w-full h-2/3 object-cover rounded-t-lg"
					sizes="(max-width: 768px) 220px, 342px"
				/>
			</div>

			<div className="p-2 flex flex-col">
				<h2 className=" text-left text-primary-700 h3 capitalize line-clamp-1">
					{title}
				</h2>
				<div className="flex gap-2">
					<RatingNumber value={averageRating} />
					<span className={`text-sm text-gray-${ratingsCount ? 700 : 400}`}>
						({formatNumber(ratingsCount ?? 0)}{" "}
						{ratingsCount === 1 ? "rating" : "ratings"})
					</span>
				</div>
			</div>
		</Link>
	);
}

export default RecipeCard;
