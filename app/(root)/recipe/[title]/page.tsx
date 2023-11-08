import CreateReview from "@/components/CreateReview";
import DeleteAction from "@/components/DeleteAction";
import ReviewCard, { ReviewProps } from "@/components/ReviewCard";
import SaveAction from "@/components/SaveAction";
import { getRecipeByTitle } from "@/lib/actions/recipe.action";
import { getReviews } from "@/lib/actions/review.action";
import { getMongoUserFromClerkId } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
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

  let mongoUser;

  const { userId: clerkId } = auth();

  if (clerkId) {
    mongoUser = await getMongoUserFromClerkId(clerkId);
  }

  const reviewsResult = await getReviews({ recipe: result?.recipe?._id });

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
      <section className=" bg-light-800 flex flex-col lg:flex-row-reverse lg:items-center sm:items-start gap-12 lg:h-[75vh]">
        <div className="p-8 max-lg:pb-0 lg:pl-0 flex flex-col justify-center w-full lg:w-[50%]">
          <div className="w-full flex items-start justify-between max-sm: flex-col-reverse lg:flex-col-reverse">
            <h1 className="text-4xl font-bold mb-4 lg:text-6xl">
              {decodedTitle}
            </h1>
            <div className="flex justify-start  gap-2 max-sm:w-full lg:w-full mb-6 items-center">
              {clerkId === createdBy?.clerkId && (
                <>
                  <Link
                    className="secondary-btn text-center lg:w-[160px]"
                    href={`/recipe/edit/${_id}`}
                  >
                    Edit recipe
                  </Link>
                  <DeleteAction
                    userClerkId={createdBy?.clerkId}
                    id={_id.toString()}
                    type="recipe"
                  />
                </>
              )}
              <SaveAction
                id={_id.toString()}
                isSaved={mongoUser?.saved.includes(_id)}
              />
            </div>
          </div>
          <p className="italic mb-4">
            Author:{" "}
            <Link
              className="text-accent-500"
              href={`/profile/${createdBy?.clerkId}`}
            >
              {createdBy?.name}
            </Link>
          </p>

          <p className="text-gray-700">
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
        {/* <div className="sm:w-full bg-slate-400 h-full lg:w-[50%] "> */}
        <Image
          className="max-lg:h-[50vh] lg:w-[50%] w-full object-cover h-full"
          src={image}
          alt={title}
          width={300}
          height={400}
        />
        {/* </div> */}
      </section>

      <section className="flex flex-col lg:flex-row justify-center lg:items-start max-w-6xl gap-12 p-8 mx-auto">
        <div className="lg:w-[50%] ">
          <h3 className="font-bold text-xl my-4">Ingredients</h3>
          <ul className="list-none ml-0 pl-0 bg-primary-100 rounded-lg ">
            {ingredients.map(
              (
                ingredient: { _id: string; ingredient: string },
                index: number
              ) => (
                <li
                  key={ingredient._id}
                  className={`mx-3 py-2.5 
                ${
                  index !== ingredients.length - 1
                    ? "border-b-[1px] border-slate-400"
                    : "first-line:"
                }
                  `}
                >
                  {ingredient.ingredient}
                </li>
              )
            )}
          </ul>
        </div>
        <div className="lg:w-[50%]">
          <h3 className="font-bold text-xl my-4">Method</h3>
          <ul className="list-none ml-0 pl-0 rounded-lg">
            {method.map(
              (item: { _id: string; step: string }, index: number) => (
                <li
                  className={`px-6 py-2.5 bg-primary-100 rounded-lg my-3 `}
                  key={item._id}
                >
                  <span className="text-accent-500 text-xl font-bold">
                    {index + 1}{" "}
                  </span>
                  {item.step}
                </li>
              )
            )}
          </ul>
        </div>
      </section>

      <CreateReview recipe={_id.toString()} user={mongoUser?._id.toString()} />

      {reviewsResult?.reviews && reviewsResult?.reviews?.length > 0 ? (
        <div className="mb-4  px-8 max-w-6xl mx-auto">
          <h3 className="font-bold h3 mb-4">Reviews</h3>
          {reviewsResult?.reviews.map((review) => (
            <ReviewCard
              key={review._id}
              userImage={review.user.image}
              userName={review.user.name}
              comment={review.comment}
              _id={review._id.toString()}
              rating={review.rating}
              userClerkId={review.user.clerkId}
              date={review.createdAt}
            />
          ))}
        </div>
      ) : null}
    </main>
  );
}

export default Page;
