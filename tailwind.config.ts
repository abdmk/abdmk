import type { Config } from 'tailwindcss';

/**
 * Editorial system. One typeface (Graphik Arabic), an off-white page, hairline
 * rules and a type scale with real distance between its ends — hierarchy is
 * carried by size and whitespace, not by weight or colour. Tokens themselves
 * live in globals.css.
 */
const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',   // iPad portrait
      lg: '1024px',  // iPad landscape / small laptop
      xl: '1280px',  // laptop
      '2xl': '1536px', // desktop
      '3xl': '1800px', // large / ultrawide
    },
    extend: {
      fontFamily: {
        // Graphik Arabic is the only typeface in the system — Arabic and Latin.
        sans: ['var(--font-graphik)', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: 'rgb(var(--paper) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        sunken: 'rgb(var(--sunken) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        faint: 'rgb(var(--faint) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        'line-strong': 'rgb(var(--line-strong) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        bloom: {
          peach: 'rgb(var(--bloom-peach) / <alpha-value>)',
          mint: 'rgb(var(--bloom-mint) / <alpha-value>)',
          lilac: 'rgb(var(--bloom-lilac) / <alpha-value>)',
          sky: 'rgb(var(--bloom-sky) / <alpha-value>)',
          lime: 'rgb(var(--bloom-lime) / <alpha-value>)',
        },
      },
      fontSize: {
        // The two ends are roughly 10:1. That gap is the hierarchy — everything
        // between them is deliberately sparse so nothing sits at a near-equal
        // size to its neighbour.
        colossal: ['clamp(3.25rem, 15vw, 15rem)', { lineHeight: '0.9', letterSpacing: '-0.045em' }],
        mega: ['clamp(2.75rem, 10vw, 9rem)', { lineHeight: '0.94', letterSpacing: '-0.04em' }],
        display: ['clamp(2.25rem, 6.4vw, 5.5rem)', { lineHeight: '1.0', letterSpacing: '-0.035em' }],
        h1: ['clamp(1.875rem, 4.2vw, 3.5rem)', { lineHeight: '1.06', letterSpacing: '-0.03em' }],
        h2: ['clamp(1.5rem, 2.8vw, 2.375rem)', { lineHeight: '1.14', letterSpacing: '-0.022em' }],
        h3: ['clamp(1.125rem, 1.5vw, 1.375rem)', { lineHeight: '1.32', letterSpacing: '-0.01em' }],
        lead: ['clamp(1.0625rem, 1.35vw, 1.375rem)', { lineHeight: '1.6' }],
        body: ['1rem', { lineHeight: '1.75' }],
        small: ['0.875rem', { lineHeight: '1.65' }],
        meta: ['0.8125rem', { lineHeight: '1.4' }],
        micro: ['0.6875rem', { lineHeight: '1.3', letterSpacing: '0.16em' }],
      },
      borderRadius: {
        card: 'var(--radius-card)',
      },
      maxWidth: {
        prose: '62ch',
        shell: '100rem',
        wide: '110rem',
      },
      spacing: {
        gutter: 'var(--gutter)',
        // Sections breathe. This is the single biggest lever the layout has.
        section: 'clamp(5rem, 13vw, 11rem)',
        'section-sm': 'clamp(3rem, 7vw, 6rem)',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'none' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
