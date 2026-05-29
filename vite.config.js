/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import createPlainVersion from "./vite.plugins";
import path from "node:path";

export default defineConfig({
  root: path.resolve(__dirname, "src"),
  base: "/password-generator/",

  resolve: {
    alias: {
      "~bootstrap": path.resolve(__dirname, "node_modules/bootstrap"),
    },
  },

  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: "static/[name].[ext]",
        chunkFileNames: "static/[name].js",
        entryFileNames: "static/[name].js",
      },
    },
  },

  server: {
    host: true,
    port: 3000,
    hot: true,
  },

  plugins: [createPlainVersion()],

  test: {
    root: path.resolve(__dirname),
    setupFiles: ["test/setup.js"],
  },
});
