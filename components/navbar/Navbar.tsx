import { CATEGORIES } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import MobileNavbar from "./MobileNavbar";
import Searchbar from "../Searchbar";
import { SignedIn, SignedOut } from "@clerk/nextjs";

function Navbar() {
  return (
    <header className="px-4 py-3 flex flex-col">
      <div className="flex justify-between gap-6 items-center">
        <Link href="/" className="flex flex-col items-center link">
          <Image src="/assets/logo.svg" alt="logo" width={150} height={100} />
          <p className="text-center">Recipes</p>
        </Link>

        <Searchbar />
        <SignedOut>
          <Link href="/sign-in" className="btn">
            Sign In
          </Link>
        </SignedOut>
        <MobileNavbar />
      </div>
      <nav className="mt-8">
        <div className="flex gap-3 justify-evenly max-lg:hidden">
          {CATEGORIES.map((category) => (
            <Link key={category.title} href="/">
              <p className="uppercase font-bold text-xl text-primary-500 link">
                {category.title}
              </p>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
