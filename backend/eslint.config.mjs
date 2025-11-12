// ESLint configuration for TypeScript backend
// This file configures code quality and style rules for the backend application
//
// NOTE: ESLint 9+ no longer supports .eslintignore files
// Files to ignore are now configured in the "ignores" property below

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  // Apply recommended ESLint rules for general JavaScript/TypeScript best practices
  eslint.configs.recommended,

  // Apply recommended TypeScript-specific ESLint rules
  ...tseslint.configs.recommended,

  {
    // Files to lint
    files: ["src/**/*.ts"],

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        project: "./tsconfig.json",
      },
    },

    rules: {
      // ============================================
      // Code Style Rules
      // ============================================

      // ERROR: Always use semicolons at the end of statements
      semi: ["error", "always"],

      // ERROR: Use double quotes for strings (can escape if needed)
      quotes: ["error", "double", { avoidEscape: true }],

      // DISABLED: Let Prettier handle indentation
      // ESLint's indent rule conflicts with Prettier's ternary formatting
      indent: "off",
      "@typescript-eslint/indent": "off",

      // ERROR: Require trailing commas in multi-line object/array literals
      // Makes git diffs cleaner when adding new items
      "comma-dangle": ["error", "always-multiline"],

      // ERROR: No trailing spaces at end of lines
      "no-trailing-spaces": "error",

      // ERROR: Require newline at end of file
      "eol-last": ["error", "always"],

      // ============================================
      // TypeScript-Specific Rules
      // ============================================

      // Turn off base ESLint rule (conflicts with TypeScript version)
      "no-unused-vars": "off",

      // ERROR: Catch unused variables and function parameters
      // Allow variables/params starting with _ to be unused (convention for intentionally unused)
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // WARN: Discourage use of 'any' type (prefer specific types)
      // Set to 'warn' instead of 'error' for gradual migration
      "@typescript-eslint/no-explicit-any": "warn",

      // Allow implicit return types for functions (TypeScript infers them)
      "@typescript-eslint/explicit-function-return-type": "off",

      // Allow implicit module boundary types
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // ============================================
      // Best Practices
      // ============================================

      // Allow console.log, console.error etc. (needed for backend logging)
      "no-console": "off",

      // ERROR: Use const instead of let when variable is never reassigned
      "prefer-const": "error",

      // ERROR: Never use 'var' keyword (use const or let)
      "no-var": "error",

      // ERROR: Use template literals instead of string concatenation
      "prefer-template": "error",

      // ERROR: Disallow multiple empty lines (max 1 blank line)
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],

      // WARN: Prefer arrow functions for callbacks
      "prefer-arrow-callback": "warn",

      // ERROR: No duplicate imports from same module
      "no-duplicate-imports": "error",

      // ============================================
      // Error Prevention
      // ============================================

      // ERROR: Disallow comparing variable to itself (likely a bug)
      "no-self-compare": "error",

      // ERROR: Disallow unreachable code after return, throw, etc.
      "no-unreachable": "error",

      // ERROR: Require use of === and !== instead of == and !=
      eqeqeq: ["error", "always"],

      // ERROR: Disallow empty block statements
      "no-empty": ["error", { allowEmptyCatch: true }],

      // WARN: Warn about TODO comments (reminder to clean them up)
      "no-warning-comments": [
        "warn",
        { terms: ["TODO", "FIXME", "XXX"], location: "start" },
      ],
    },
  },

  {
    // Files and directories to ignore
    ignores: [
      "node_modules/**",
      "dist/**",
      "*.config.js",
      "*.config.mjs",
      "coverage/**",
      ".env",
    ],
  },
];
