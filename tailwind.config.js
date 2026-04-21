/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-dark': '#050507',
        'bg-surface': 'rgba(18, 18, 28, 0.5)',
        'accent-blue': '#00d4ff',
        'accent-purple': '#a855f7',
        'text-main': '#f0f0f5',
        'text-muted': '#9a9ab0',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        glass: '24px',
      },
    },
  },
  plugins: [],
}
