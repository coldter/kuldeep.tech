// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://kuldeep.tech",
  integrations: [sitemap()],
  adapter: cloudflare({
    imageService: "compile",
    // Required with @astrojs/cloudflare v14: the default "workerd" prerender
    // environment writes the literal string "[object Object]" to every
    // prerendered page. "node" restores correct HTML output.
    prerenderEnvironment: "node",
  }),
});
