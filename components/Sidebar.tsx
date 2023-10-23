import { CUISINES } from "@/constants";
import Link from "next/link";
import React from "react";

function Sidebar() {
  return (
    <div className="max-md:hidden w-[350px] xl:w-[500px] p-6">
      <h2 className="h2">CUISINES</h2>
      <div className="flex flex-wrap gap-3 mt-3">
        {CUISINES.map((cuisine) => (
          <Link
            key={cuisine.value}
            href={`/cuisine/${cuisine.title}`}
            className="link border-[1px] border-accent-500 px-6 py-2 rounded-full"
          >
            {cuisine.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
