import { useSyncExternalStore } from 'react';
import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

/** True when the user asked the OS to reduce motion. Never null (SSR/first-render safe). */
export const useReducedMotion = (): boolean => Boolean(useFramerReducedMotion());

const FINE_HOVER_QUERY = '(hover: hover) and (pointer: fine)';

const subscribeFineHover = (onChange: () => void) => {
  const mql = window.matchMedia(FINE_HOVER_QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
};

/** True on devices with a precise pointer that can hover (mouse, trackpad). False on touch. */
export const useCanHover = (): boolean =>
  useSyncExternalStore(
    subscribeFineHover,
    () => window.matchMedia(FINE_HOVER_QUERY).matches,
    () => false,
  );

/**
 * Pointer-driven effects (tilt, magnetic pull, parallax) should only run when the user
 * hasn't asked for reduced motion and is on a hover-capable precise pointer.
 */
export const usePointerEffects = (): boolean => {
  const reduced = useReducedMotion();
  const canHover = useCanHover();
  return !reduced && canHover;
};

/** Shared easing: a calm, decisive ease-out. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
