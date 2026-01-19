import createPlainVersion from "./vite.plugins";

const path = require("path");

export default {
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
};
