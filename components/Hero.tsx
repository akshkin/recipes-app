import Image from "next/image";
import Link from "next/link";
import React from "react";

function Hero() {
  return (
    <div className="flex min-h-[30vh] relative mb-8 rounded-lg w-full">
      <div className="flex flex-col items-start justify-center bg-light-800 rounded-lg pl-6 pr-6">
        <h1 className="h1 mb-4">
          Do you love creating recipes and sharing with the world?
        </h1>
        <Link className="secondary-btn" href="/sign-in">
          Join us now
        </Link>
      </div>
      <Image
        src="/assets/hero-image.jpg"
        alt="food in a pan"
        width={300}
        height={250}
        className="object-cover rounded-r-lg max-md-hidden"
      />
    </div>
  );
}

export default Hero;
