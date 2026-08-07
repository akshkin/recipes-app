"use client";

import { CATEGORIES } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavbarCategories() {
	const pathname = usePathname();

	return (
		<div className="py-0 bg-primary-500 flex gap-3 justify-evenly max-lg:hidden">
			{CATEGORIES.map((category) => (
				<Link
					key={category.title}
					href={`/category/${category.title}`}
					className="flex gap-2"
				>
					<img src={category.image} alt="" width={40} height={40} />
					<p
						className={`uppercase py-3 font-bold text-xl  link ${
							pathname.includes(category.title)
								? "text-accent-100"
								: "text-white"
						}`}
					>
						{category.title}
					</p>
				</Link>
			))}
		</div>
	);
}

export default NavbarCategories;
