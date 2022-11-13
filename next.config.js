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
    loader: "custom",
  },
  experimental: {
    appDir: true,
  },
  // target: "serverless",
  // assetPrefix: isProd ? "https://us-central1-plantantica.cloudfunctions.net/handler" : "",
}

module.exports = nextConfig
