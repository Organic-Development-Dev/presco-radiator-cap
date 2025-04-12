module.exports = {
  extends: ['next/core-web-vitals', 'eslint:recommended'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'react/no-unescaped-entities': 'off',
    '@next/next/no-img-element': 'off', // Temporarily disabled until all images are migrated to next/image
  },
};