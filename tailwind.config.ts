import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2em",
    },
    extend: {
      screens: {
        xs: "450px",
      },
      fontFamily: {
        inter: ["var(--font-inter)"],
        cormorant: ["var(--font-cormorant)"],
      },
      colors: {
        primary: {
          700: "#283618",
          500: "#606c38",
          100: "#FFf1e6",
        },
        dark: {
          100: "#000000",
          200: "#0F1117",
          300: "#151821",
          400: "#212734",
          500: "#0e1604",
        },
        light: {
          900: "#FFFFFF",
          800: "#fefae0",
        },

        accent: {
          500: "#bc6c25",
          100: "#dda15e",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
export default config;
