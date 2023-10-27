import { CATEGORIES } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import MobileNavbar from "./MobileNavbar";
import Searchbar from "../Searchbar";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import NavbarCategories from "./NavbarCategories";

function Navbar() {
  return (
    <header className="pt-4 flex flex-col">
      <div className="flex justify-between gap-3 items-center ml-3">
        <Link href="/" className="flex flex-col items-center link max-sm:pb-3">
          {/* <Image src="/assets/logo.svg" alt="logo" width={150} height={100} /> */}
          <p className="text-center text-2xl font-bold">Recipes</p>
        </Link>

        <div className="flex items-center gap-3 px-4 pb-4 sm:py-3 ">
          <Searchbar />
          <SignedOut>
            <Link href="/sign-in" className="btn min-w-[100px] text-center">
              Sign In
            </Link>
          </SignedOut>
          <SignedIn>
            <div className="flex gap-3 mr-3">
              <Link
                className="btn max-xs:w-[120px] w-[150px] text-center"
                href="/create-recipe"
              >
                Create recipe
              </Link>
              <UserButton />
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
