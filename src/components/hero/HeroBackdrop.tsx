import React, { Component, Suspense, lazy, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import type { MotionValue } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useCanHover, useReducedMotion } from '../ui';

// three.js + R3F live only in this chunk.
const DataFlowScene = lazy(() => import('./DataFlowScene'));

const NARROW_QUERY = '(max-width: 767px)';
const subscribeNarrow = (onChange: () => void) => {
  const mql = window.matchMedia(NARROW_QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
};
const useIsNarrow = () =>
  useSyncExternalStore(
    subscribeNarrow,
    () => window.matchMedia(NARROW_QUERY).matches,
    () => true,
  );

/** Static teal/blue wash shown while the scene loads, or instead of it if WebGL fails. */
const StaticFallback: React.FC = () => (
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[radial-gradient(40%_45%_at_72%_42%,color-mix(in_oklab,var(--color-accent)_16%,transparent),transparent_70%),radial-gradient(35%_40%_at_88%_70%,color-mix(in_oklab,var(--color-accent-2)_14%,transparent),transparent_70%)]"
  />
);

/** If WebGL is unavailable or the chunk fails to load, keep the static wash. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

interface HeroBackdropProps {
  progress: MotionValue<number>;
}

const HeroBackdrop: React.FC<HeroBackdropProps> = ({ progress }) => {
  const { isDark } = useTheme();
  const reduced = useReducedMotion();
  const canHover = useCanHover();
  const narrow = useIsNarrow();
  const lite = narrow || !canHover;

  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Defer the 3D chunk until the browser is idle, so it never competes with first paint.
  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setMounted(true), { timeout: 1200 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setMounted(true), 300);
    return () => window.clearTimeout(id);
  }, []);

  // Stop rendering entirely while the hero is off-screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      rootMargin: '0px 0px 0px 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 lg:[mask-image:linear-gradient(to_right,rgb(0_0_0/0.3),rgb(0_0_0/0.4)_40%,black_62%)]"
    >
      <StaticFallback />
      {mounted && (
        <SceneBoundary>
          <Suspense fallback={null}>
            <div className="absolute inset-0 opacity-70 md:opacity-100">
              <DataFlowScene
                isDark={isDark}
                reduced={reduced}
                lite={lite}
                active={active}
                progress={progress}
              />
            </div>
          </Suspense>
        </SceneBoundary>
      )}
    </div>
  );
};

export default HeroBackdrop;
