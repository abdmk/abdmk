'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** Stagger position when several Reveals sit in a row. */
  index?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article';
}

/**
 * The site's one entrance animation: a short rise and fade as an element scrolls
 * into view. Motion here is punctuation, not performance — one gesture, reused,
 * and skipped entirely for readers who ask for reduced motion.
 */
export function Reveal({ children, index = 0, className, as = 'div' }: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  if (reduced) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Component
      // `data-reveal` lets globals.css force these visible when JS is absent,
      // so the page is never blank for a crawler or a failed bundle.
      data-reveal
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay: Math.min(index, 5) * 0.07,
      }}
    >
      {children}
    </Component>
  );
}
