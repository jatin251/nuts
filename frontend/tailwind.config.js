import customPlugin from './src/styles/customPlugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#eafaf6',
          200: '#c0f1e5',
          300: '#96e8d4',
          400: '#6cdfc3',
          500: '#42D6B2',
          600: '#29bd99',
          700: '#209377',
          800: '#176955',
          900: '#0e3f33'
        }
      },
      fontFamily: {
        circularstd: ['CircularStd'],
        productsans: ['ProductSans']
      },
      boxShadow: {
        primary: '0 2 20 0 rgba(0, 0, 0, 0.3)'
      }
    }
  },
  plugins: [customPlugin],
  future: {
    hoverOnlyWhenSupported: true
  }
};
