/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Get base URL depending on environment
    baseUrl:
      process.env.VERCEL_ENV === "production"
        ? "https://www.ethansdailygames.com"
        : process.env.VERCEL_ENV === "preview"
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000",
  },
};

// Set derived URLs
nextConfig.env.NEXT_PUBLIC_API_URL = `${nextConfig.env.baseUrl}/api`;
nextConfig.env.NEXTAUTH_URL = nextConfig.env.baseUrl;

module.exports = nextConfig;
