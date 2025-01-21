/* eslint-env node */
module.exports = {
  extends: ['@repo/eslint-config/node.js'],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
};
