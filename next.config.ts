import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

// Explicitly load .env with top priority
function getEnvOverrides(): Record<string, string> {
  const envPath = path.resolve(process.cwd(), ".env");
  const envMap: Record<string, string> = {};

  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    content.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const equalsIdx = trimmed.indexOf("=");
      if (equalsIdx !== -1) {
        const key = trimmed.substring(0, equalsIdx).trim();
        let val = trimmed.substring(equalsIdx + 1).trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        envMap[key] = val;
        // Also assign to process.env immediately
        process.env[key] = val;
      }
    });
  }

  return envMap;
}

const envOverrides = getEnvOverrides();

const nextConfig: NextConfig = {
  /* Enforce .env priority over all other env files */
  env: envOverrides,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
