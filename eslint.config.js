import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

/**
 * One config for both workspaces. The client and server run in different
 * environments, so each gets its own globals and rules rather than a lowest
 * common denominator.
 */
export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/coverage/**'],
  },

  js.configs.recommended,

  // ---------------------------------------------------------------- client
  {
    files: ['client/src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...globals.browser },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // The JSX transform makes the React import unnecessary.
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      // Prop types are not used in this codebase; components are documented
      // by their JSDoc and usage instead.
      'react/prop-types': 'off',
      // An array index as a key corrupts state when a list reorders. The few
      // legitimate exceptions are fixed-length skeleton placeholders, which
      // opt out explicitly at the call site.
      'react/no-array-index-key': 'warn',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },

  // ---------------------------------------------------------------- server
  {
    files: ['server/src/**/*.js', 'server/tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'off',
    },
  },
];
