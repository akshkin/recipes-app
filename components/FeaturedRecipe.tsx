import { getFeaturedRecipe } from "@/lib/actions/recipe.action";
import { publicImageUrl } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

async function FeaturedRecipe() {
	const result = await getFeaturedRecipe();
	if (!result?.recipe) return;
	
	const { image, title, description, averageRating, ratingsCount } =
		result?.recipe;

	return (
		<section className="mb-4" id="featured">
			<h2 className="h2 mb-3">Featured recipe</h2>
			<div className="flex gap-3 md:h-[300px] max-md:flex-col border rounded-r-md md:rounded-e-md border-gray-300 md:border-l-0">
				<Image
					src={`${publicImageUrl}/${image}`}
					alt=""
					width={400}
					height={300}
					className="w-full md:w-[50%] rounded-t-md md:rounded-s-md object-cover max-md:h-[200px]"
				/>
				<div className="md:w-[50%] p-3 md:pt-5 flex flex-col gap-1 md:gap-2">
					<span className="border border-accent-500 rounded-3xl text-accent-500 px-2 py-1 text-xs w-fit flex items-center">
						<Image
							src="/assets/icons/star.svg"
							alt={""}
							width={20}
							height={20}
							className="mr-1"
						/>
						Editor's pick
					</span>
					<h3 className="text-2xl font-semibold">{title}</h3>
					<p className="text-gray-600 text-sm lg:text-lg">{description}</p>

					<Link href={`/recipe/${title}`} className="btn w-fit text-md">
						View recipe
					</Link>
				</div>
			</div>
		</section>
	);
}

export default FeaturedRecipe;
