// @ts-check
// ESLint flat config — the PUBLISHED Angular coding-standard ruleset.
// `typescript-eslint` recommended (sound TS) + `angular-eslint` recommended
// (the official Angular team rules: component/directive selector conventions,
// lifecycle correctness, template hygiene). We don't invent rules — we adopt
// the maintained, published recommended sets, then pin a couple of CRITICAL
// upgrades to error so they can't slip through as warnings.
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    languageOptions: {
      // Enable typed linting (needed by no-floating-promises). projectService is
      // the modern, zero-config way — it finds the nearest tsconfig per file.
      parserOptions: { projectService: true, tsconfigRootDir: __dirname },
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // Critical, high-signal upgrades (kept small on purpose):
      '@typescript-eslint/no-floating-promises': 'error', // dropped awaits = real bugs
      '@angular-eslint/no-empty-lifecycle-method': 'error',
      '@angular-eslint/component-selector': ['error', { type: 'element', style: 'kebab-case' }],
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', style: 'camelCase' }],
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  },
);
