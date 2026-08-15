/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Geist Mono', 'monospace'],
      },
      colors: {
        'cs-dark': '#0a0a1a',
        'cs-blue': '#7BA5E6',
        'cs-lavender': '#BAB8E4',
        'cs-violet': '#6344D5',
        'cs-pink': '#F9AAB8',
        'cs-teal': '#19C9C9',
        'cs-purple': '#AF7FD2',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}