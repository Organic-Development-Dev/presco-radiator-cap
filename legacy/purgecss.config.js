module.exports = {
  content: [
    './.next/static/chunks/**/*.js',
    './.next/server/**/*.html',
    './pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
  ],
  css: ['./.next/static/css/**/*.css'],
  output: './.next/static/css/',
  safelist: {
    standard: [
      /^swiper/, // Keep all swiper classes
      /^ant-/, // Keep all antd classes
      /^nprogress/, // Keep nprogress classes
      /^slick-/, // Keep slick-carousel classes
      'html',
      'body',
      'img',
      'a',
      'modern-browser',
      'legacy-browser',
      'active',
      'show',
      'hide',
      /data-.*/,
      /^Mui.*/,
    ],
    deep: [/^ant-/, /^swiper/, /^slick-/, /nprogress/],
    greedy: [/^ant-/, /^rc-/, /^slick-/, /^swiper/],
  },
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
};