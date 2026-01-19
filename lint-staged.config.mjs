export default {
  "*.{js,mjs}": "eslint",
  "*.{cjs,css,html,js,json,md,mjs}": "prettier --check",
  "{src,test}/*.js": "vitest run",
};
