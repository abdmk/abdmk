'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/icons';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'theme';

/**
 * Inline, unminified but tiny — runs in the document head before hydration so
 * the saved (or OS) theme applies before first paint. Without this, dark-mode
 * visitors get a flash of the light theme on every load.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`;

function isDark() {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
}

/**
 * Sun/moon toggle. Reads the class the head script already applied so there is
 * no mismatch on mount, then flips `.dark` on <html> and remembers the choice.
 */
export function ThemeToggle({
  labelToDark,
  labelToLight,
  className,
}: {
  labelToDark: string;
  labelToLight: string;
  className?: string;
}) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDark(isDark());
    setMounted(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
    } catch {
      // Private browsing can block storage; the toggle still works this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? labelToLight : labelToDark}
      aria-pressed={mounted ? dark : undefined}
      className={cn(
        'btn-icon h-11 w-11',
        // Avoid rendering the wrong icon for one frame before mount reads the
        // real class; the button is still clickable either way.
        !mounted && 'invisible',
        className,
      )}
    >
      <Icon name={dark ? 'sun' : 'moon'} size={17} />
    </button>
  );
}
