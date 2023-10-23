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
    <header className=" py-3 flex flex-col">
      <div className="flex justify-between gap-6 items-center">
        <Link href="/" className="flex flex-col items-center link">
          <Image src="/assets/logo.svg" alt="logo" width={150} height={100} />
          <p className="text-center">Recipes</p>
        </Link>

        <div className="flex gap-3 px-4">
          <Searchbar />
          <SignedOut>
            <Link href="/sign-in" className="btn min-w-[100px] text-center">
              Sign In
            </Link>
          </SignedOut>
          <SignedIn>
            <div className="rounded-full shadow-lg  border-[1px] border-slate-400">
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
