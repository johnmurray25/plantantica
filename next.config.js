// const isProd = process.env.NODE_ENV === "production"
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      'www.gstatic.com',
    ],
    loader: "custom"
  },
  // target: "serverless",
  // assetPrefix: isProd ? "https://us-central1-plantantica.cloudfunctions.net/handler" : "",
}

module.exports = nextConfig
