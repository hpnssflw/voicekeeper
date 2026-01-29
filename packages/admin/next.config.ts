import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    // Не игнорировать ошибки типов при билде
    ignoreBuildErrors: false,
  },
  eslint: {
    // Не игнорировать ошибки ESLint при билде
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;

