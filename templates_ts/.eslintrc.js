module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],

  parserOptions: {
    parser: '@typescript-eslint/parser'
  },

  rules: {
    // 允许props修改
    'vue/no-mutating-props': 0
  },

  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript'
  ]
};
