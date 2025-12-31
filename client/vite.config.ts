import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],

  // 👇 frontend root
  root: "./client",

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./client/src", import.meta.url)),
    },
  },

  server: {
    port: 3000,
    host: true,
  },

  build: {
    // 👇 VERY IMPORTANT: Netlify expects this
    outDir: "./client/dist",
    emptyOutDir: true,
  },

  publicDir: "./attached_assets",
});
