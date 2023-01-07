// const isProd = process.env.NODE_ENV === "production"
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'plantantica.appspot.com', 
      'www.gstatic.com',
      'plantantica.com',
      'plantantica.web.app',
      'plantantica.firebase.app',
      'plantantica.vercel.app',
      "icongr.am",
    ],
    // loader: "custom",
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'firebasestorage.googleapis.com/v0/b',
    //     pathname: '/plantantica.appspot.com/**',
    //   },
    //   {
    //     protocol: 'https',
    //     hostname: 'plantantica.com',
    //     pathname: '/_next/image/**',
    //   }
    // ],
  },
  // target: "serverless",
  // assetPrefix: isProd ? "https://us-central1-plantantica.cloudfunctions.net/handler" : "",
}

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig)
