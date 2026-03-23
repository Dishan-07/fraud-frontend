/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        'surface-container-low': '#050505',
        'surface-container-high': '#0A0A0A',
        'surface-bright': '#111111',
        primary: '#E2E8F0',
        'primary-light': '#FFFFFF',
        secondary: '#00F0FF',
        tertiary: '#94A3B8',
        'error-container': '#FF3366',
        'error-text': '#FFFFFF',
        'safe-container': '#00E676',
        'safe-text': '#000000',
        'outline-variant': '#1A1A1A',
        border: '#1A1A1A',
        'text-primary': '#FAFAFA',
        'text-secondary': '#A1A1AA',
        'text-tertiary': '#52525B',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'scan': 'scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
