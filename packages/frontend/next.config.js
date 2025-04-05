/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // The App Router is now stable in Next.js 14
  // experimental option is no longer needed

  // Configure TypeScript checking
  typescript: {
    ignoreBuildErrors: false,
  },
  // Ensure both Pages Router and App Router work together
  pageExtensions: ['ts', 'tsx'],
};

module.exports = nextConfig; 