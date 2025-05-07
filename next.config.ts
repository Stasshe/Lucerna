import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // 本番ビルド時にESLintチェックを無視する
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 本番ビルド時にTypeScriptチェックを無視する
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
