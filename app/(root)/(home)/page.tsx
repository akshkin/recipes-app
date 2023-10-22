import RecipeCard from "@/components/RecipeCard";
import { getRecipes } from "@/lib/actions/recipe.action";

export default async function Home() {
  const result = await getRecipes({});

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="h1">All recipes</h1>
      {/**Filters */}
      <div className="flex flex-wrap gap-4 my-6 justify-center">
        {result.recipes.map((recipe) => (
          <RecipeCard
            key={recipe._id}
            _id={recipe._id}
            title={recipe.title}
            image={recipe.image}
          />
        ))}
        {/**Pagination */}
      </div>
    </main>
  );
}
