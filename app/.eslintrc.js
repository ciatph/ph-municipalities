module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: [
    'standard',
    'eslint:recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2022
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    // 'no-console': ['error', { 'allow': ['error'] }]
    'no-trailing-spaces': 'error',
    'no-unused-vars': 'error',
    'no-undef': 'error',
    'eol-last': ['error', 'always']
  }
}
