/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        anime: ['Zen Kaku Gothic New', 'Outfit', 'sans-serif'],
      },
      colors: {
        anime: {
          bg: '#0a0614',
          surface: '#120b1e',
          card: 'rgba(24, 18, 42, 0.7)',
          border: 'rgba(179, 102, 255, 0.2)',
          pink: '#ff6b9d',
          cyan: '#00d4ff',
          purple: '#b366ff',
          lavender: '#c4a8ff',
          muted: '#8b7aa8',
          text: '#e8e0f0',
          'text-dim': '#a89bb8',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 5s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'name-reveal': 'nameReveal 0.7s ease-out forwards',
      },
      animationDelay: {
        200: '200ms',
        350: '350ms',
        400: '400ms',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-8px) scale(1.02)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        nameReveal: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        imageShine: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      boxShadow: {
        'anime-glow': '0 0 40px rgba(179, 102, 255, 0.3)',
        'anime-glow-pink': '0 0 30px rgba(255, 107, 157, 0.25)',
        'anime-glow-cyan': '0 0 30px rgba(0, 212, 255, 0.2)',
      },
    },
  },
  plugins: [],
}
