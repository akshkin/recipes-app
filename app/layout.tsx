import type { Metadata } from "next";
import { Inter, Cormorant } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });
const cormorant = Cormorant({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: {
		default: "Recipes App",
		// child page title
		template: "%s | Recipes App",
	},
	verification: { google: "8bJStQEZR72Tu35oVEk98fnq5lLMtoKdlQY8psrhApI" },
	description:
		"Discover, create, and save delicious recipes for every occasion.",
	openGraph: {
		title: "Recipes App",
		description:
			"Discover, create, and save delicious recipes for every occasion.",
		images: [{ url: "/assets/logo.jpg" }],
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider
			appearance={{
				elements: {
					formButtonPrimary: "bg-primary-500",
					footerActionLink: "text-primary-500 link",
				},
			}}
		>
			<html lang="en">
				{/* <body className={`${inter.className} ${cormorant.className}`}> */}
				<body className={`${inter.className}`}>{children}</body>
			</html>
		</ClerkProvider>
	);
}
