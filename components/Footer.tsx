import Image from "next/image";
import Link from "next/link";

function Footer() {
	return (
		<footer className="bg-primary-100 p-4 pb-8 flex max-md:flex-col justify-evenly items-start">
			<Link href="/">
				<Image src="/assets/logo.svg" alt="logo" width={50} height={50} />
			</Link>
			<div className="flex flex-col gap-4">
				<h3 className="font-semibold text-lg">Explore</h3>
				<Link href="/#all-recipes" className="text-sm">
					All recipes
				</Link>
				<Link href="/#cuisines" className="text-sm">
					Cuisines
				</Link>
				<Link href="/#featured" className="text-sm">
					Featured recipe
				</Link>
			</div>
			<div className="flex flex-col gap-4">
				<h3 className="font-semibold text-lg">Account</h3>
				<Link href="/profile" className="text-sm">
					My recipes
				</Link>
				<Link href="/saved" className="text-sm">
					Saved recipes
				</Link>
			</div>
		</footer>
	);
}

export default Footer;
