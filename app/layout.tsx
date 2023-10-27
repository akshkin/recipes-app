import type { Metadata } from "next";
import { Inter, Cormorant } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });
const cormorant = Cormorant({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Recipes App",
  description: "An app to store and view recipes",
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
        <body className={`${inter.className} ${cormorant.className}`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
