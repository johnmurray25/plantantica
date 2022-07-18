/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    ],
  },
}

module.exports = nextConfig
