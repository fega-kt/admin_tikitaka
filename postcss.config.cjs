module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nesting',
    'postcss-preset-env': {
      features: { 'nesting-rules': false },
    },
    tailwindcss: {},
  },
};
