import Image from "next/image";
import Link from "next/link";
import React from "react";

interface RecipeProps {
  _id: string;
  image: string;
  title: string;
}

function RecipeCard({ title, image }: RecipeProps) {
  return (
    <Link
      href={`/recipe/${title}`}
      className="p-2 border-[1px] rounded-lg max-lg:w-[150px] min-w-[200px] max-w-[300px] max-lg:h-[300px] h-[400px] "
    >
      <Image
        src={image}
        alt="recipe"
        width={200}
        height={150}
        className="w-full object-cover rounded-b-lg"
      />
      <h2 className="h3 capitalize mt-2 line-clamp-2 text-center">{title}</h2>
    </Link>
  );
}

export default RecipeCard;
