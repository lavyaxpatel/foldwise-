/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F8F4EC',
        paper: '#EAE2D3',
        charcoal: '#1E1D1B',
        vermilion: '#C8433A',
        sage: '#7F967B',
        dusty: '#5D819E',
        gold: '#B8924A',
        lavender: '#ACA0C6',
      },
      fontFamily: {
        serif: ['"Fraunces"', '"Instrument Serif"', 'Georgia', 'serif'],
        display: ['"Instrument Serif"', '"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        paper: '0 12px 32px -14px rgba(30, 29, 27, 0.14), 0 2px 6px -1px rgba(30, 29, 27, 0.06)',
        folded: '0 22px 48px -18px rgba(30, 29, 27, 0.18), 0 2px 6px rgba(30, 29, 27, 0.08)',
      },
    },
  },
  plugins: [],
};
