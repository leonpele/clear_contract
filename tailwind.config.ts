import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          muted: '#EFF6FF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F9FAFB',
          subtle: '#F3F4F6',
        },
        ink: {
          DEFAULT: '#111827',
          secondary: '#4B5563',
          muted: '#6B7280',
          faint: '#9CA3AF',
        },
        border: {
          DEFAULT: '#E5E7EB',
          strong: '#D1D5DB',
        },
        risk: {
          high: '#B91C1C',
          'high-bg': '#FEF2F2',
          'high-border': '#FECACA',
          medium: '#B45309',
          'medium-bg': '#FFFBEB',
          'medium-border': '#FDE68A',
          low: '#15803D',
          'low-bg': '#F0FDF4',
          'low-border': '#BBF7D0',
        },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 3px 0 rgb(0 0 0 / 0.06)',
      },
      borderRadius: {
        DEFAULT: '6px',
        lg: '8px',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      maxWidth: {
        content: '720px',
        wide: '1080px',
      },
    },
  },
  plugins: [],
};

export default config;
