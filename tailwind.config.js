/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // body, Latin and Japanese
        sans: ['"Zen Kaku Gothic New"', '"Hiragino Sans"', '"Yu Gothic"', 'system-ui', 'sans-serif'],
        // condensed display for titles and numerals
        display: ['Anton', 'Impact', '"Arial Narrow"', 'sans-serif'],
        // Mincho serif used for kanji title cards (領域展開, 無量空処, ...)
        jp: ['"Noto Serif JP"', '"Zen Kaku Gothic New"', 'serif'],
      },
      colors: {
        // Infinite Void (無量空処) palette
        void: {
          DEFAULT: '#020207',
          deep: '#000003',
          surface: '#07071a',
          card: 'rgba(9, 9, 26, 0.72)',
          line: 'rgba(165, 180, 252, 0.14)',
        },
        // Hollow Purple (虚式「茈」)
        hollow: {
          DEFAULT: '#a855f7',
          light: '#d8b4fe',
          deep: '#6d28d9',
        },
        // Cursed Technique Lapse: Blue (蒼)
        lapse: {
          DEFAULT: '#3b82f6',
          light: '#93c5fd',
        },
        // Reversal: Red (赫)
        reversal: '#ef4444',
        // Six Eyes (六眼)
        sixeyes: '#7dd3fc',
        ink: {
          DEFAULT: '#ece8f4',
          dim: '#a6a1b8',
          muted: '#6b667f',
        },
      },
      boxShadow: {
        hollow: '0 0 32px rgba(168, 85, 247, 0.35)',
        'hollow-lg': '0 0 60px rgba(168, 85, 247, 0.45)',
        lapse: '0 0 32px rgba(59, 130, 246, 0.3)',
      },
    },
  },
  plugins: [],
}
