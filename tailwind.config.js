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
        // JJK Theme - Dark curse energy with vibrant accents
        jjk: {
          bg: '#030308',
          surface: '#0a0a14',
          card: 'rgba(12, 10, 22, 0.85)',
          border: 'rgba(147, 51, 234, 0.25)',
          // Curse energy - purples and magentas
          curse: '#9333ea',
          curseDark: '#6b21a8',
          curseLight: '#c084fc',
          // Domain expansion - deep reds and blacks
          domain: '#dc2626',
          domainDark: '#7f1d1d',
          // Reversed curse technique - healing green/cyan
          reverse: '#10b981',
          reverseLight: '#34d399',
          // Sukuna - red/pink accent
          sukuna: '#f43f5e',
          sukunaDark: '#be123c',
          // Gojo - blue/cyan
          infinity: '#3b82f6',
          sixEyes: '#22d3ee',
          // Text colors
          text: '#f1f5f9',
          'text-dim': '#94a3b8',
          muted: '#64748b',
          silver: '#cbd5e1',
          light: '#f8fafc',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 5s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'name-reveal': 'nameReveal 0.7s ease-out forwards',
        'spin': 'spin 3s linear infinite',
        'curse-flicker': 'curseFlicker 4s ease-in-out infinite',
        'domain-pulse': 'domainPulse 2s ease-in-out infinite',
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
        curseFlicker: {
          '0%, 100%': { opacity: '0.4', filter: 'blur(8px)' },
          '50%': { opacity: '0.7', filter: 'blur(12px)' },
        },
        domainPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      boxShadow: {
        'curse-glow': '0 0 40px rgba(147, 51, 234, 0.3)',
        'domain-glow': '0 0 30px rgba(220, 38, 38, 0.25)',
        'infinity-glow': '0 0 30px rgba(59, 130, 246, 0.2)',
      },
    },
  },
  plugins: [],
}
