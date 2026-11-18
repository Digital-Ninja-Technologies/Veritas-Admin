import type { NextConfig } from "next";

// `cacheComponents`/partial prefetching assume routes can be statically
// shelled with explicit caching boundaries. Every page here is a
// server-rendered, session-gated admin view over mutable data — there's no
// static shell worth producing, so we render dynamically per-request
// instead of sprinkling Suspense boundaries just to satisfy the feature.
const nextConfig: NextConfig = {
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
