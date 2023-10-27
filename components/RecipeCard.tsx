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
    // <Link
    //   href={`/recipe/${title}`}
    //   className="flex flex-col p-2 border-[1px] rounded-lg max-md:w-[220px] min-w-[200px] w-[360px] max-lg:h-[250px] h-[300px] hover:scale-105 focus:scale-105 transition-transform shadow-lg"
    // >
    <Link
      href={`/recipe/${title}`}
      className="relative border-[1px] rounded-lg max-md:w-[220px] min-w-[200px] w-[360px] max-lg:h-[250px] h-[300px] hover:scale-105 focus:scale-105 transition-transform shadow-lg"
    >
      <Image
        src={image}
        alt="recipe"
        width={200}
        height={120}
        className="z-0 w-full h-full object-cover rounded-lg"
      />
      <div className="flex justify-start items-end z-10 mask-image absolute inset-0 h-full rounded-lg bg-opacity-20">
        <h2 className=" text-left z-20 h3 p-4 text-white capitalize mt-2 line-clamp-3">
          {title}
        </h2>
      </div>
    </Link>
  );
}

export default RecipeCard;
