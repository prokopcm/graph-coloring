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
    },
    // https://github.com/antfu/eslint-config
    typescript: {
      tsconfigPath: 'tsconfig.json',
    },
  }),
)
