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
				hostname: "*",
			},
		],
	},
};

module.exports = nextConfig;
