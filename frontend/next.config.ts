import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, // allow any external URL

    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "res.cloudinary.com",
    //   },
    //   {
    //     protocol: "https",
    //     hostname: "*",
    //   },
    // ],
  },
};

export default nextConfig;
