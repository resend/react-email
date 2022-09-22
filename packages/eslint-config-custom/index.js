module.exports = {
  extends: ['next', 'turbo', 'prettier'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    '@next/next/no-head-element': 'off',
    '@next/next/no-img-element': 'off',
    'react/jsx-key': 'off',
  },
};
