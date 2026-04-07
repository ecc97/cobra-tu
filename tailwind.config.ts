import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'surface': 'var(--surface)',
        'surface-dim': 'var(--surface-dim)',
        'surface-bright': 'var(--surface-bright)',
        'surface-container': 'var(--surface-container)',
        'surface-container-low': 'var(--surface-container-low)',
        'surface-container-lowest': 'var(--surface-container-lowest)',
        'surface-container-high': 'var(--surface-container-high)',
        'surface-container-highest': 'var(--surface-container-highest)',
        'on-surface': 'var(--on-surface)',

        'primary': 'var(--primary)',
        'primary-container': 'var(--primary-container)',
        'on-primary': 'var(--on-primary)',

        'secondary': 'var(--secondary)',
        'secondary-container': 'var(--secondary-container)',
        'on-secondary': 'var(--on-secondary)',

        'error': 'var(--error)',
        'on-error': 'var(--on-error)',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'headline': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
        'mono': ['DM Sans', 'monospace'],
      },
      fontSize: {
        'display-lg': ['3.5rem', '1.2'],
        'headline-md': ['1.75rem', '1.3'],
        'title-md': ['1.125rem', '1.4'],
        'body-md': ['0.875rem', '1.5'],
      },
      backdropBlur: {
        'glass': '20px',
      },
      boxShadow: {
        'paper': '0 4px 6px rgba(0, 0, 0, 0.3), 0 10px 40px rgba(0, 0, 0, 0.4), 0 2px 80px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
