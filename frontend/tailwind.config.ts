/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        typography: {
          DEFAULT: {
            css: {
              color: '#e2e8f0',
              a: {
                color: '#63b3ed',
                '&:hover': {
                  color: '#90cdf4',
                },
              },
              h1: {
                color: '#f7fafc',
              },
              h2: {
                color: '#f7fafc',
              },
              h3: {
                color: '#f7fafc',
              },
              h4: {
                color: '#f7fafc',
              },
              code: {
                color: '#a5d8ff',
              },
              pre: {
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
              },
            },
          },
        },
      },
    },
    plugins: [require('@tailwindcss/typography')],
  };