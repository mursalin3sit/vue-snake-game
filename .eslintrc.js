module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    'airbnb-base',
    'plugin:vue/recommended',
    '@vue/typescript/recommended',
  ],
  env: {
    browser: true,
  },
  rules: {
    'import/prefer-default-export': 'off', // Prefer named exports where possible
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.vue', '.ts'],
      },
    },
  },
};
