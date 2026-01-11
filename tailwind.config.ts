import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Warm Harmony Color Palette
        coral: {
          DEFAULT: '#FF9A76',
          light: '#FFB5A0',
          dark: '#FF7A50',
        },
        teal: {
          DEFAULT: '#7ECCC4',
          light: '#9EE5DD',
          dark: '#5EB3AB',
        },
        gold: {
          DEFAULT: '#FFB86C',
          light: '#FFD4A0',
          dark: '#FF9C38',
        },
        lavender: '#C9A9DD',
        skyblue: '#87CEEB',
        warmwhite: '#FFF8F3',
        warmdark: '#1A1A1A',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        float: 'float 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
      },
    },
  },
  plugins: [],
}
export default config
