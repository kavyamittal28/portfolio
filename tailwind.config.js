/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-dark': '#07070a',
        'bg-surface': 'rgba(20, 20, 30, 0.4)',
        'accent-blue': '#00f0ff',
        'accent-purple': '#9d00ff',
        'text-main': '#f0f0f5',
        'text-muted': '#a0a0b0',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      backdropBlur: {
        glass: '20px',
      },
    },
  },
  plugins: [],
}
