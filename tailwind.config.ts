import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    darkMode: "class",
    extend: {
      colors: {
        primary: {
          50: 'var(--color-50)',
          100: 'var(--color-100)',
          200: 'var(--color-200)',
          300: 'var(--color-300)',
          400: 'var(--color-400)',
          500: 'var(--color-500)',
          600: 'var(--color-600)',
          700: 'var(--color-700)',
          800: 'var(--color-800)',
          900: 'var(--color-900)',
        },
        gray: {
          '50': '#f8f8f8',
          '100': '#f0f0f0',
          '200': '#e0e0e0',
          '300': '#d0d0d0',
          '400': '#b0b0b0',
          '500': '#606060',
          '600': '#404040',
          '700': '#202020',
          '800': '#101010',
          '900': '#0a0a0a',
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
export default config;
