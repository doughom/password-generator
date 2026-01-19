/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import createPlainVersion from "./vite.plugins";

const path = require("path");

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
