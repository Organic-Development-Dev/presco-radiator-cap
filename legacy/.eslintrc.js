module.exports = {
  extends: ['next/core-web-vitals', 'eslint:recommended'],
  rules: {
    // For production deployment, set these to 'warn' instead of 'error'
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-unused-vars': 'warn',
    'no-undef': 'warn',
    'react-hooks/rules-of-hooks': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-key': 'warn',
    'jsx-a11y/alt-text': 'warn',
    '@next/next/no-html-link-for-pages': 'warn',
    'no-mixed-spaces-and-tabs': 'warn',

    // Disable some rules entirely
    'react/no-unescaped-entities': 'off',
    '@next/next/no-img-element': 'off', // Temporarily disabled until all images are migrated to next/image
  },
  // Add Jest globals for tests
  env: {
    'jest': true
  }
};