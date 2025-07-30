import globals from 'globals'
import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import eslintPluginTailwindCSS from 'eslint-plugin-tailwindcss'
import eslintPluginTypescript from 'eslint-plugin-typescript'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'
import * as parser from '@typescript-eslint/parser'

export default [
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser,
      globals: globals.browser,
    },
    plugins: {
      react: eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
      '@typescript-eslint': eslintPluginTypescript,
      tailwindcss: eslintPluginTailwindCSS,
      prettier: eslintPluginPrettier,
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
    },
    rules: {
      ...eslintConfigPrettier.rules,
      '@typescript-eslint/no-unused-vars': ['error'], // TypeScript-specific linting rules
      'react/prop-types': 'off', // Turn off PropTypes checking (irrelevant for TypeScript)
      'react/react-in-jsx-scope': 'off', // No need for React import in JSX (React 17+)
      'tailwindcss/classnames-order': 'warn', // Warn for unordered TailwindCSS classnames
      'tailwindcss/no-custom-classname': 'off', // Allow custom classnames
    },
  },
]
