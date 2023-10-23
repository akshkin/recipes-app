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
      className="flex flex-col p-2 border-[1px] rounded-lg max-md:w-[220px] min-w-[200px] w-[360px] max-lg:h-[250px] h-[300px] hover:scale-105 focus:scale-105 transition-transform shadow-lg"
    >
      <Image
        src={image}
        alt="recipe"
        width={200}
        height={120}
        className=" bg-slate-700 w-full max-lg:h-[150px] h-[200px] object-cover rounded-md"
      />
      <h2 className="h3 capitalize mt-2 line-clamp-2 text-center h-[200px]">
        {title}
      </h2>
    </Link>
  );
}

export default RecipeCard;
