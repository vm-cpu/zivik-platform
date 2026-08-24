import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Pin the Turbopack root to this package.
   *
   * Turbopack finds the root by walking up for a lockfile, and there is a
   * stray `~/package-lock.json` on this machine, so it was picking the home
   * directory. That only printed a warning during `next build`, but in `next
   * dev` started from outside the project it broke module resolution outright
   * — every route 500'd on "Can't resolve
   * next/dist/esm/build/adapter/setup-node-env.external".
   *
   * Pinning it makes the dev server independent of the directory it is
   * launched from, and silences the build warning.
   */
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
