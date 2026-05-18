import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
    {
        ignores: [
            'node_modules/**',
            'playwright-report/**',
            'test-results/**',
            'blob-report/**',
            '.auth/**',
            'dist/**',
            'coverage/**',
        ],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
            '@typescript-eslint/no-inferrable-types': 'error',
            '@typescript-eslint/no-empty-function': 'error',
            '@typescript-eslint/no-floating-promises': 'error',
            'no-console': ['error', { allow: ['warn', 'error'] }],
            'prefer-const': 'error',
        },
    },
    {
        files: ['**/*.{js,mjs,cjs}'],
        ...tseslint.configs.disableTypeChecked,
    },
    {
        files: ['tests/**/*.ts'],
        ...playwright.configs['flat/recommended'],
        rules: {
            ...playwright.configs['flat/recommended'].rules,
            'playwright/missing-playwright-await': 'error',
            'playwright/no-page-pause': 'error',
            'playwright/no-useless-await': 'error',
            'playwright/no-skipped-test': 'error',
        },
    },
    prettier,
);
