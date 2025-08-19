/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./public/index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cosmic-purple': '#6B46C1',
        'cosmic-blue': '#1E40AF',
        'cosmic-gold': '#F59E0B',
        'nft-green': '#10B981',
        'danger-red': '#EF4444'
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
      }
    },
  },
  plugins: [],
}