import type { Config } from 'tailwindcss';

/**
 * The design system is deliberately small: one typeface (Graphik Arabic), a warm
 * paper/ink palette, a fluid editorial type scale and a spacing rhythm. Everything
 * else is composition. See src/app/globals.css for the tokens themselves.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Graphik Arabic is the only typeface in the system — Arabic and Latin.
        sans: ['var(--font-graphik)', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: 'rgb(var(--paper) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        faint: 'rgb(var(--faint) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
      },
      fontSize: {
        // Fluid editorial scale. Display sizes are set tight and light;
        // body sizes stay generous for Arabic's taller x-height.
        mega: ['clamp(3rem, 12vw, 11rem)', { lineHeight: '0.92', letterSpacing: '-0.03em' }],
        display: ['clamp(2.5rem, 7.5vw, 6.5rem)', { lineHeight: '0.98', letterSpacing: '-0.025em' }],
        h1: ['clamp(2rem, 4.6vw, 3.75rem)', { lineHeight: '1.06', letterSpacing: '-0.02em' }],
        h2: ['clamp(1.6rem, 3.2vw, 2.6rem)', { lineHeight: '1.12', letterSpacing: '-0.015em' }],
        h3: ['clamp(1.25rem, 2vw, 1.65rem)', { lineHeight: '1.22', letterSpacing: '-0.01em' }],
        lead: ['clamp(1.05rem, 1.6vw, 1.35rem)', { lineHeight: '1.6' }],
        body: ['1rem', { lineHeight: '1.7' }],
        small: ['0.875rem', { lineHeight: '1.6' }],
        meta: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.08em' }],
      },
      maxWidth: {
        prose: '62ch',
        shell: '96rem',
      },
      spacing: {
        gutter: 'var(--gutter)',
        section: 'clamp(4.5rem, 11vw, 10rem)',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
