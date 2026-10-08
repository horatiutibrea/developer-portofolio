import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import unusedImports from 'eslint-plugin-unused-imports'

export default tseslint.config(
  {
    ignores: ['dist', 'coverage', 'playwright-report', 'test-results']
  },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'unused-imports': unusedImports,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-hooks/exhaustive-deps': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          'vars': 'all',
          'args': 'after-used',
          'ignoreRestSiblings': true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      'quotes': ['warn', 'single'],
      'eol-last': ['warn', 'always'],
      'no-multiple-empty-lines': ['warn', { 'max': 1, 'maxEOF': 0 }],
      'semi': [1, 'always'],
      'comma-dangle': [
        'error',
        {
          'arrays': 'always-multiline',
          'objects': 'always-multiline',
          'imports': 'always-multiline',
          'exports': 'always-multiline',
          'functions': 'always-multiline',
        },
      ],
      indent: ["error", 2, {
        FunctionDeclaration: {
          body: 1,
          parameters: 1,
        },

        FunctionExpression: {
          body: 1,
          parameters: 1,
        },

        SwitchCase: 1,
        ignoredNodes: ["PropertyDefinition"],
      }],
      'padded-blocks': ['warn', 'never'],
      'max-len': [
        'error', {
          'code': 160,
          'tabWidth': 2,
        },
      ],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }
      ]
    },
  },
)
