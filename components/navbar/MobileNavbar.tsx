import React from "react";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import Image from "next/image";

import { CATEGORIES } from "@/constants";
import Link from "next/link";

function MobileNavbar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src="/assets/icons/hamburger.svg"
          alt="menu"
          width={20}
          height={20}
          className="cursor-pointer lg:hidden link"
        />
      </SheetTrigger>
      <SheetContent className="border-none">
        <Link href="/" className="flex flex-col items-center link">
          <Image src="/assets/logo.svg" alt="logo" width={150} height={100} />
        </Link>
        <SheetClose asChild>
          <div className="flex flex-col gap-3 mt-16">
            {CATEGORIES.map((category) => (
              <Link key={category.title} href={`/category/${category.title}`}>
                <p className="uppercase font-bold text-xl text-primary-500 link">
                  {category.title}
                </p>
              </Link>
            ))}
          </div>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNavbar;
