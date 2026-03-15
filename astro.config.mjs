// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://kuldeep.tech",
  integrations: [sitemap()],
  adapter: cloudflare(),
  vite: {
    optimizeDeps: {
      exclude: ["astro"],
    },
  },
});
