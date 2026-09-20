/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Design System Specification Tokens
        // Background Neutral (60%)
        sand: {
          50: '#FFFDFB',
          100: '#FFF4EC', // Primary Light Sand base background
          200: '#FFE7D6',
          300: '#FED2B5',
          400: '#FDB688',
        },
        // Major Work / Primary UI (30%)
        electric: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6', // Electric Sky Blue
          600: '#2563EB',
          700: '#1D4ED8',
        },
        slatecool: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0', // Cool Slate Gray
          300: '#CBD5E1',
          400: '#94A3B8',
        },
        // Minor Work / Accent & Status (10%)
        slatenavy: {
          800: '#1E293B',
          900: '#0F172A', // Slate Navy Dark
          950: '#020617',
        },
        emeralddeep: {
          50: '#F0FDF4',
          500: '#10B981',
          600: '#0D9488', // Deep Emerald
          700: '#0F766E',
        },
        crimsonsoft: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          500: '#F43F5E',
          600: '#E11D48', // Soft Crimson
          700: '#BE123C',
        },
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02)',
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
        'hover': '0 10px 25px -3px rgba(59, 130, 246, 0.12), 0 4px 6px -2px rgba(15, 23, 42, 0.05)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
