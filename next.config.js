// const isProd = process.env.NODE_ENV === "production"
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'plantantica.appspot.com',
      'www.gstatic.com',
    ],
    loader: "custom"
  },
  // target: "serverless",
  // assetPrefix: isProd ? "https://us-central1-plantantica.cloudfunctions.net/handler" : "",
}

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig)
