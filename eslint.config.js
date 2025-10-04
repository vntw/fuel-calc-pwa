import tseslint from 'typescript-eslint';
import preact from 'eslint-config-preact';
import { defineConfig } from 'eslint/config';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default defineConfig([
  { ignores: ['dist/'] },
  preact,
  tseslint.configs.recommended,
]);
