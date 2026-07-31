import Link from "next/link";
import Searchbar from "./Searchbar";
import Image from "next/image";

async function Hero() {
	return (
		<section className="flex items-start justify-center h-[60vh] rounded-lg w-full max-sm:py-3 mx-auto">
			<div className="pt-6 pl-[calc(100vw-95%)]">
				<h1 className="text-5xl lg:text-7xl font-semibold">
					Discover delicious <span className="text-orange-500">recipes</span>
				</h1>

				<p className="text-gray-700 text-lg my-4">
					Find, share and create recipes{" "}
					<span className="block">from around the world</span>
				</p>
				<Searchbar />
				<div className="mt-4 flex flex-wrap gap-3">
					<Link
						href="/cuisine/italian"
						className="link text-sm  border border-accent-500 px-6 py-1 rounded-full"
					>
						Italian
					</Link>
					<Link
						href="/cuisine/indian"
						className="link text-sm  border border-accent-500 px-6 py-1 rounded-full"
					>
						Indian
					</Link>
					<Link
						href="/cuisine/american"
						className="link  text-sm border border-accent-500 px-6 py-1 rounded-full"
					>
						American
					</Link>
					<Link
						href="/category/dessert"
						className="link text-sm  border border-accent-500 px-6 py-1 rounded-full"
					>
						Dessert
					</Link>
				</div>
			</div>
			<div className="h-full w-[70%] bg-black">
				<Image
					src="/assets/hero-image.jpg"
					alt=""
					className="object-cover block w-full h-full"
					height={600}
					width={800}
					loading="eager"
				/>
			</div>
		</section>
	);
}

export default Hero;
