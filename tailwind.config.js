module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      borderWidth: {
        3: '3px',
      },
      outlineWidth: {
        3: '3px',
      },
      colors: {
        bg: '#111',
      },
    },
  },
  plugins: [],
};
