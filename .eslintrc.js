module.exports = {
  extends: ['next/core-web-vitals', 'eslint:recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    // This is the key setting to fix the "parserOptions.project" error
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
  // Include all TypeScript files
  include: [
    'next-env.d.ts',
    'src/**/*.ts',
    'src/**/*.tsx',
    '*.ts',
  ],
  // Don't check node_modules
  ignorePatterns: ['node_modules/', '.next/'],
}; 