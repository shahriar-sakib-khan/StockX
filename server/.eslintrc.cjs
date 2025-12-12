module.exports = {
  env: {
    node: true,
    es2022: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import', 'unused-imports', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      // 1. Node Resolver: Handles standard relative imports
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src/'],
      },

      // 2. TypeScript Resolver: "Magic Mode"
      // Leaving this empty allows it to auto-detect tsconfig.json
      // and be more forgiving about file extensions.
      typescript: {},
    },
  },
  rules: {
    // --- General Rules ---
    'no-console': 'warn',
    'unused-imports/no-unused-imports': 'error',

    // --- TypeScript Rules ---
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],

    // --- Import Rules ---
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    // Check for missing files, BUT ignore any path starting with "@/"
    'import/no-unresolved': ['error', { ignore: ['^@/'] }],

    // --- Prettier Integration ---
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto', // Fixes "Delete ␍" errors on Windows
      },
    ],
  },
};
