// @ts-nocheck
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    languageOptions: {
      parserOptions: {
        // https://typescript-eslint.io/packages/parser/#warnonunsupportedtypescriptversion
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    rules: {
      'antfu/consistent-chaining': 'off',
      'ts/no-unsafe-argument': 'off',
      'ts/no-unsafe-assignment': 'off',
      'ts/no-unsafe-call': 'off',
      'ts/no-unsafe-member-access': 'off',
      'ts/no-unsafe-return': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': 'warn',
      'vue/no-multiple-template-root': 'off',
      'vue/static-class-names-order': ['error'],
      'space-before-function-paren': ['error', 'always'],
      'vue/no-irregular-whitespace': 'off',
      '@/space-before-function-paren': ['error', 'always'],
      'style/space-before-function-paren': ['error', 'always'],
      'brace-style': ['error', '1tbs'],
    },
    // https://github.com/antfu/eslint-config
    typescript: {
      tsconfigPath: 'tsconfig.json',
    },
  }),
)
