import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      workbox: {
        maximumFileSizeToCacheInBytes: 10000000,
      },
    }),
  ],

  build: {
    // just the `bangs.json` is like 2 megs, so the bundled JS will be pretty large
    chunkSizeWarningLimit: 10000,
  },
});
