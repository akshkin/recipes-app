import { getRecipeByTitle } from "@/lib/actions/recipe.action";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  params: {
    title: string;
  };
}

async function Page({ params }: Props) {
  const title = params.title;
  const decodedTitle = decodeURIComponent(title);

  const result = await getRecipeByTitle({ title: decodedTitle });

  if (!result.recipe) {
    return <p className="h3 text-center">Recipe not found</p>;
  }

  const {
    _id,
    image,
    createdBy,
    createdAt,
    ingredients,
    method,
    description,
    category,
    cuisine,
  } = result.recipe;

  const formattedTime = new Date(createdAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="">
      <section className="p-8 bg-light-800 flex flex-col lg:flex-row-reverse lg:items-center sm:items-start gap-12">
        <div className="lg:w-[50%]">
          <h1 className="text-4xl font-bold mb-4 lg:text-6xl">
            {decodedTitle}
          </h1>
          <p className="italic mb-6">
            Author:{" "}
            <Link className="text-accent-500" href={`/user/${createdBy}`}>
              {createdBy}
            </Link>
          </p>

          <p>
            Created: <time>{formattedTime}</time>
          </p>
          <p className="text-2xl mt-4">{description}</p>
          <div className="mb-0 mt-4 flex flex-col sm:flex-row gap-8">
            <p>
              <span className="h3">Category</span> :{" "}
              <span className="text-primary-500">
                {category.title.toUpperCase()}
              </span>
            </p>
            <p>
              <span className="h3">Cuisine </span> :{" "}
              <span className="text-primary-500">
                {cuisine.title.toUpperCase()}
              </span>
            </p>
          </div>
        </div>
        <div className="sm:w-full lg:w-[50%] ">
          <Image
            className="w-full object-cover max-h-[60vh]"
            src={image}
            alt={title}
            width={300}
            height={200}
          />
        </div>
      </section>

      <section className="flex flex-col lg:flex-row justify-center lg:items-start max-w-6xl gap-12 p-8 mx-auto">
        <div className="lg:w-[50%] ">
          <h3 className="font-bold text-xl my-4">Ingredients</h3>
          <ol className="list-disc px-8">
            {ingredients.map(
              (ingredient: { _id: string; ingredient: string }) => (
                <li key={ingredient._id} className="">
                  {ingredient.ingredient}
                </li>
              )
            )}
          </ol>
        </div>
        <div className="lg:w-[50%]">
          <h3 className="font-bold text-xl my-4">Method</h3>
          <ol className="list-decimal px-8">
            {method.map((item: { _id: string; step: string }) => (
              <li key={item._id}>{item.step}</li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}

export default Page;
