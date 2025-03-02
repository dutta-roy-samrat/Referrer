/** @type {import('next').NextConfig} */
const nextConfig = (() => {
  const isDev = process.env.NODE_ENV === "development";
  return ({
    output: "standalone",
    images: {
      remotePatterns: isDev ? [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '8000',
        },
      ] : [
        {
          protocol: 'https',
          hostname: 'localhost',
          port: '8000',
        }
      ],
    },
  })
})();

export default nextConfig;
