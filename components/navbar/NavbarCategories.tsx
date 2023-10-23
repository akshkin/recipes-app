"use client";

import { CATEGORIES } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function NavbarCategories() {
  const pathname = usePathname();

  return (
    <div className="py-0 bg-primary-500 flex gap-3 justify-evenly max-lg:hidden">
      {CATEGORIES.map((category) => (
        <Link key={category.title} href={`/category/${category.title}`}>
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
