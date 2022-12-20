module.exports = {
  root: true,
  extends: 'airbnb-typescript/base',
  plugins: ['import', 'prettier'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  'rules': {
    // Note: you must disable the base rule as it can report incorrect errors
    'indent': 'off',
    '@typescript-eslint/indent': 'off',
  },
};
