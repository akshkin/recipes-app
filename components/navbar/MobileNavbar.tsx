import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import Image from "next/image";

import { CATEGORIES } from "@/constants";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { SignedIn } from "@clerk/nextjs";

async function MobileNavbar() {
	const { userId } = await auth();

	return (
		<Sheet>
			<SheetTrigger aria-label="Open menu" className="lg:hidden">
				<Image
					src="/assets/icons/hamburger.svg"
					alt="menu"
					width={30}
					height={30}
					className="cursor-pointer link"
				/>
			</SheetTrigger>
			<SheetContent className="border-none mx-auto">
				<SheetClose asChild>
					<Link href="/" className="link">
						<Image src="/assets/logo.svg" alt="logo" width={150} height={100} />
					</Link>
				</SheetClose>
				<div className="flex flex-col gap-3 mt-16">
					<SignedIn>
						<>
							<SheetClose asChild>
								<Link href="/saved" className="flex link">
									<Image
										src="/assets/icons/bookmark.svg"
										alt=""
										width={30}
										height={30}
										title="saved recipes"
									/>{" "}
									<span className="text-xl uppercase">Saved</span>
								</Link>
							</SheetClose>
							<SheetClose asChild>
								<Link
									href={`/profile/${userId}`}
									className="flex gap-1 link mb-4"
								>
									<Image
										src="/assets/icons/profile-circle.svg"
										alt=""
										width={30}
										height={30}
										title="saved recipes"
									/>{" "}
									<span className="text-xl uppercase">Profile</span>
								</Link>
							</SheetClose>
						</>
					</SignedIn>
					{CATEGORIES.map((category) => (
						<SheetClose asChild key={category.title}>
							<Link href={`/category/${category.title}`} className="flex gap-1">
								<Image src={category.image} alt="" width={30} height={30} />
								<span className="text-xl uppercase"> {category.title} </span>
							</Link>
						</SheetClose>
					))}
				</div>
			</SheetContent>
		</Sheet>
	);
}

export default MobileNavbar;
