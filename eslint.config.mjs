import js from '@eslint/js';
import expoConfig from 'eslint-config-expo/flat';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...expoConfig,

  {
    files: ['**/*.{ts,tsx}'],

    plugins: {
      import: importPlugin,
      'react-hooks': reactHooks,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },

    rules: {
      /**
       * Imports
       */
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      /**
       * Unused imports
       */
      'unused-imports/no-unused-imports': 'error',

      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      /**
       * React Hooks
       */
      ...reactHooks.configs.recommended.rules,

      /**
       * General
       */
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  prettier,
];
