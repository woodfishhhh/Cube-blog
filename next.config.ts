import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    remotePatterns: [new URL("https://pic1.imgdb.cn/**")],
  },
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: resolve(projectRoot),
  },
};

export default nextConfig;
