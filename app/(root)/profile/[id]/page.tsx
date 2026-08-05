import {
	getMongoUserFromClerkId,
	getUserById,
} from "@/lib/actions/user.action";
import { getRecipesByUserId } from "@/lib/actions/recipe.action";
import Image from "next/image";
import RecipeCard from "@/components/cards/RecipeCard";
import FilterAndSort from "@/components/FilterAndSort";
import { SearchParamsProps } from "@/types";
import EditProfileButton from "@/components/EditProfileButton";
import Link from "next/link";

interface ParamsProps extends SearchParamsProps {
	params: {
		id: string;
	};
}

async function Page({ params, searchParams }: ParamsProps) {
	const { id: clerkId } = await params;
	const { sort } = await searchParams;

	const mongoUser = await getMongoUserFromClerkId(clerkId);

	const [result, userRecipes] = await Promise.all([
		getUserById(clerkId),
		getRecipesByUserId({
			id: mongoUser?._id,
			sort: sort || "",
		}),
	]);

	if (!result.user) {
		return <p className="text-center">User not found</p>;
	}

	console.log(result);
	const { instagram, facebook, youTube } = result?.user?.socialLinks;

	return (
		// <div className="m-8 flex flex-col justify-center items-center gap-6">
		<div className="">
			<header className="relative w-full p-8">
				<Image
					src="/assets/profile-hero.jpg"
					alt=""
					width={500}
					height={300}
					className="w-full h-full object-cover absolute -z-10 inset-0 blur-lg"
				/>
				<div className="flex items-center gap-4 z-100 py-8 max-w-3xl mx-auto">
					<Image
						src={result?.user?.image}
						alt="avatar"
						width={200}
						height={200}
						className="object-cover rounded-full border-[1px] border-primary-500"
					/>
					<div>
						<h1 className="h1 font-bold">{result?.user?.name.toUpperCase()}</h1>

						<p className="text-primary-500 my-1">@{result?.user?.username}</p>
						{userRecipes?.length ? (
							<p className="text-primary-700">Recipe creator</p>
						) : null}
						{instagram || facebook || youTube ? (
							<div className="flex gap-3 my-4">
								{/* <p>Find me here: </p> */}
								<div className="flex gap-4 items-center">
									{instagram && (
										<a href={instagram} target="_blank" className="link">
											<img
												src="/assets/icons/instagram.svg"
												alt="instagram"
												width={30}
												height={30}
											/>
										</a>
									)}
									{facebook && (
										<a href={facebook} target="_blank" className="link">
											<img
												src="/assets/icons/facebook.svg"
												alt="facebook"
												width={30}
												height={30}
											/>
										</a>
									)}
									{youTube && (
										<a href={youTube} target="_blank" className="link">
											<img
												src="/assets/icons/youtube.svg"
												alt="youtube"
												width={60}
												height={60}
											/>
										</a>
									)}
								</div>
							</div>
						) : null}
						<EditProfileButton profileClerkId={clerkId} />
					</div>
				</div>
			</header>
			<div className="p-8 w-full grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-3">
				<main>
					{userRecipes && userRecipes.length > 0 && (
						<>
							<h2 className="h2 text-center">My recipes</h2>
							<FilterAndSort filter={false} />
							<div className="custom-grid mt-6">
								{userRecipes?.map((recipe: any) => (
									<RecipeCard
										key={recipe._id}
										_id={recipe._id}
										title={recipe.title}
										image={recipe.image}
										averageRating={recipe.averageRating}
										ratingsCount={recipe.ratingsCount}
									/>
								))}
							</div>
						</>
					)}
				</main>
				<aside className="bg-white max-lg:order-first lg:block self-start lg:sticky h-fit lg:top-20 lg:-mt-[15rem] lg:z-20 lg:mr-6 rounded-md p-4 mb-2 shadow max-sm:w-full text-gray-800">
					<div className="">
						{result?.user?.bio && (
							<>
								<h2 className="text-2xl font-bold mb-4">About me</h2>
								<p>{result?.user?.bio}</p>
							</>
						)}

						<div className="mb-0 mt-4 flex flex-col gap-4">
							<p className="flex justify-between items-center">
								<span className="font-semibold">Joined</span>
								<span className="text-primary-500">
									{result?.user?.joinedAt &&
										new Date(result.user.joinedAt).toLocaleDateString("en-US", {
											month: "long",
											day: "numeric",
											year: "numeric",
										})}
								</span>
							</p>
						</div>
					</div>
					{/* {userRecipes && userRecipes.length > 0 && (
						<div className="flex gap-2 flex-wrap lg:flex-col lg:w-full max-lg:items-center my-2">
							<div className="flex gap-3  lg:bg-light-800 lg:p-2 lg:flex-col max-lg:items-center lg:rounded-md">
								<h3 className="max-lg:hidden font-bold text-xl my-3">
									Like my recipes?
								</h3>
							</div>
						</div>
					)} */}

					<div className="flex flex-col gap-2 mt-4 max-lg:w-fit">
						<h3 className="h3">Create your own recipe</h3>
						<p className="text-left">Share you recipes with the community!</p>
						<Link href="/create-recipe" className="btn text-center ">
							Create recipe
						</Link>
					</div>
				</aside>
			</div>
		</div>
	);
}

export default Page;
