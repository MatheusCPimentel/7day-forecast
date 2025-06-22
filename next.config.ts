import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.weather.gov",
        port: "",
        pathname: "/icons/**",
      },
    ],
  },
};

export default nextConfig;
