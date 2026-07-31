import Link from "next/link";
import MobileNavbar from "./MobileNavbar";
import Searchbar from "../Searchbar";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import NavbarCategories from "./NavbarCategories";
import { auth } from "@clerk/nextjs/server";
import ClerkUserButton from "../ClerkUserButton";

async function Navbar() {
	const { userId } = await auth();

	return (
		<header className="pt-4 flex flex-col bg-white">
			<div className="flex justify-between gap-3 items-center ml-3 ">
				<Link href="/" className="link max-sm:pb-3">
					<img src="/assets/logo.svg" alt="logo" width={100} height={70} />
				</Link>

				<div className="flex w-full  items-center justify-end gap-4 px-4 pb-4 sm:py-3">
					<Searchbar className="max-sm:hidden w-[50%]" />
					<SignedOut>
						<Link href="/sign-in" className="btn min-w-[100px] text-center">
							Sign In
						</Link>
					</SignedOut>
					<SignedIn>
						<div className="flex gap-3  items-center">
							<div className="flex max-lg:hidden gap-2 items-center">
								<Link href="/saved" className="flex link">
									<img
										src="/assets/icons/bookmark.svg"
										alt="bookmark"
										width={30}
										height={30}
										title="saved recipes"
									/>{" "}
									<span>Saved</span>
								</Link>
								<Link href={`/profile/${userId}`} className="flex gap-1 link">
									<img
										src="/assets/icons/profile-circle.svg"
										alt="profile"
										width={30}
										height={30}
										title="saved recipes"
									/>{" "}
									<span>Profile</span>
								</Link>
							</div>
							<Link className="btn text-center" href="/create-recipe">
								Create recipe
							</Link>
							<ClerkUserButton />
						</div>
					</SignedIn>
					<MobileNavbar />
				</div>
			</div>
			<nav className="mt-4 max-sm:mt-0">
				<NavbarCategories />
			</nav>
		</header>
	);
}

export default Navbar;
