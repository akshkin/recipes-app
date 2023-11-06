import FilterAndSort from "@/components/FilterAndSort";
import Hero from "@/components/Hero";
import Pagination from "@/components/Pagination";
import RecipeCard from "@/components/RecipeCard";
import { getRecipes } from "@/lib/actions/recipe.action";

interface PageProps {
  searchParams: { [key: string]: string | undefined };
  params?: string;
}

export default async function Home({ searchParams, params }: PageProps) {
  const result = await getRecipes({
    page: searchParams.page ? +searchParams.page : 1,
    filter: searchParams.filter ? searchParams.filter : "",
    sort: searchParams.sort ? searchParams.sort : "",
  });

  return (
    <main className="flex min-h-screen flex-col items-center pt-0 pl-0 my-6">
      <Hero />
      <h1 className="h1">All recipes</h1>
      <FilterAndSort filter={true} />
      <div className="custom-grid mb-8 p-8">
        {result.recipes.map((recipe) => (
          <RecipeCard
            key={recipe._id}
            _id={recipe._id}
            title={recipe.title}
            image={recipe.image}
          />
        ))}
      </div>

      <Pagination
        page={searchParams.page ? +searchParams.page : 1}
        isNextPage={result?.isNextPage}
      />
    </main>
  );
}
