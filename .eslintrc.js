module.exports = {
  extends: [
    "airbnb-base",
  ],
  plugins: [
    'jest'
  ],
  env: {
    "jest/globals": true
  },
  // add your custom rules here
  rules: {
    semi: 0,
    'comma-dangle': 0,
    'object-curly-newline': 0,
    'arrow-parens': ['error', 'as-needed']
  },
};
