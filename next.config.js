/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActions: {
			serverComponentsExternalPackages: ["mongoose"],
		},
		mdxRs: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "msxcvvxequpmzpcevsje.supabase.co",
			},
			{
				protocol: "https",
				hostname: "img.clerk.com",
			},
		],
	},
};

module.exports = nextConfig;
