import { useEffect, useState, useSyncExternalStore } from 'react';
import type { RefObject } from 'react';
import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

const subscribeVisibility = (onChange: () => void) => {
  document.addEventListener('visibilitychange', onChange);
  return () => document.removeEventListener('visibilitychange', onChange);
};

/** False while the tab is hidden (backgrounded, minimised, screen locked). */
export const usePageVisible = (): boolean =>
  useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState !== 'hidden',
    () => true,
  );

/** True while the element overlaps the viewport (plus an optional margin). */
export const useOnScreen = (ref: RefObject<Element | null>, rootMargin = '0px'): boolean => {
  const [onScreen, setOnScreen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      rootMargin,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return onScreen;
};

/**
 * Whether a continuous (looping) animation inside `ref` should run: only while it is
 * on screen and the tab is visible. Pair with `animationPlayState` so loops don't tick
 * off-screen or in background tabs.
 */
export const usePlayWhileVisible = (ref: RefObject<Element | null>): boolean => {
  const onScreen = useOnScreen(ref);
  const pageVisible = usePageVisible();
  return onScreen && pageVisible;
};

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
