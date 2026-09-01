import type { Config } from 'tailwindcss';

/**
 * Soft-light product system. One typeface (Graphik Arabic), a near-white canvas
 * with white surfaces floating on it, generous radii, wide low-opacity shadows,
 * near-black actions and pastel blooms for colour. Tokens live in globals.css.
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
        // Product-modern scale: confident but not editorial-extreme. Display
        // sizes are set at 600; body stays generous for Arabic's x-height.
        mega: ['clamp(2.75rem, 8.5vw, 7rem)', { lineHeight: '1.0', letterSpacing: '-0.035em' }],
        display: ['clamp(2.25rem, 5.5vw, 4.5rem)', { lineHeight: '1.04', letterSpacing: '-0.03em' }],
        h1: ['clamp(1.875rem, 3.8vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        h2: ['clamp(1.5rem, 2.6vw, 2.125rem)', { lineHeight: '1.18', letterSpacing: '-0.02em' }],
        h3: ['clamp(1.1875rem, 1.6vw, 1.4375rem)', { lineHeight: '1.3', letterSpacing: '-0.012em' }],
        lead: ['clamp(1.0625rem, 1.35vw, 1.25rem)', { lineHeight: '1.65' }],
        body: ['1rem', { lineHeight: '1.7' }],
        small: ['0.875rem', { lineHeight: '1.6' }],
        meta: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.06em' }],
      },
      borderRadius: {
        card: 'var(--radius-card)',
        xl2: '1.25rem',
        xl3: '1.75rem',
        xl4: '2.25rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgb(15 17 21 / 0.04), 0 8px 24px -14px rgb(15 17 21 / 0.12)',
        card: '0 1px 2px rgb(15 17 21 / 0.04), 0 12px 32px -16px rgb(15 17 21 / 0.12)',
        lift: '0 2px 6px rgb(15 17 21 / 0.05), 0 28px 56px -24px rgb(15 17 21 / 0.22)',
        pill: '0 8px 20px -10px rgb(15 17 21 / 0.5)',
      },
      maxWidth: {
        prose: '66ch',
        shell: '84rem',
        wide: '96rem',
      },
      spacing: {
        gutter: 'var(--gutter)',
        section: 'clamp(3.5rem, 8vw, 7.5rem)',
        'section-sm': 'clamp(2.5rem, 5.5vw, 4.5rem)',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
        soft: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'none' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -14px, 0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.6s ease both',
        float: 'float 12s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
