/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#0d0d0d',
          2: '#141414',
          3: '#1a1a1a',
        },
        'warm-white': {
          DEFAULT: '#f5f0eb',
          2: '#ece5dc',
        },
        sunset: '#e8693a',
        coral: '#d4614d',
        ocean: {
          DEFAULT: '#1a3d5c',
          light: '#2a6496',
        },
        gold: '#c9a84c',
      },
      fontFamily: {
        ui: ['Outfit', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 4s linear infinite',
        'scroll-bounce': 'scrollBounce 2s ease-in-out infinite',
        'globe-rotate': 'globeRotate 20s linear infinite',
        'marker-ping': 'markerPing 2s ease-out infinite',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0d0d0d 0%, #141e2e 30%, #1a3d5c 60%, #0d0d0d 100%)',
      },
    },
  },
  plugins: [],
}
