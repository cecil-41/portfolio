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

interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: 'change', cb: () => void) => void;
  removeEventListener?: (type: 'change', cb: () => void) => void;
}
const connectionOf = () =>
  (navigator as Navigator & { connection?: NetworkInformationLike }).connection;

const subscribeConnection = (onChange: () => void) => {
  const c = connectionOf();
  c?.addEventListener?.('change', onChange);
  return () => c?.removeEventListener?.('change', onChange);
};

/** Data saver is on, or the connection reports as 2G/3G. False where the API is missing. */
const useConstrainedNetwork = () =>
  useSyncExternalStore(
    subscribeConnection,
    () => {
      const c = connectionOf();
      return Boolean(c?.saveData) || /(^|-)(2g|3g)$/.test(c?.effectiveType ?? '');
    },
    () => true,
  );

/**
 * Phones (and anyone on data saver or a slow link) never fetch the three.js chunk.
 * They get this static hint of the same pipeline instead: three stages of nodes and links.
 */
const PipelineHint: React.FC = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 360 260"
    preserveAspectRatio="xMidYMid slice"
    className="absolute inset-x-0 top-10 h-[62%] w-full opacity-50 [mask-image:radial-gradient(ellipse_70%_65%_at_70%_40%,black,transparent)]"
  >
    <defs>
      <linearGradient id="hero-hint-line" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0.55" />
        <stop offset="1" stopColor="var(--color-accent-2)" stopOpacity="0.55" />
      </linearGradient>
    </defs>
    <g stroke="url(#hero-hint-line)" strokeWidth="1" fill="none">
      {/* sources -> processing -> sinks */}
      <path d="M150 60 L235 95 M150 130 L235 95 M150 130 L235 165 M150 200 L235 165 M235 95 L320 130 M235 165 L320 130 M235 95 L320 60 M235 165 L320 200" />
    </g>
    <g fill="var(--color-bg)" strokeWidth="1.25">
      {[
        [150, 60],
        [150, 130],
        [150, 200],
      ].map(([x, y]) => (
        <circle key={`s${y}`} cx={x} cy={y} r="4" stroke="var(--color-accent)" />
      ))}
      {[
        [235, 95],
        [235, 165],
      ].map(([x, y]) => (
        <rect key={`p${y}`} x={x - 7} y={y - 7} width="14" height="14" rx="3" stroke="var(--color-accent)" />
      ))}
      {[
        [320, 60],
        [320, 130],
        [320, 200],
      ].map(([x, y]) => (
        <circle key={`k${y}`} cx={x} cy={y} r="4" stroke="var(--color-accent-2)" />
      ))}
    </g>
  </svg>
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
  const constrained = useConstrainedNetwork();
  // Gate the 3D scene entirely: when false, the lazy chunk is never requested.
  const sceneAllowed = !narrow && !constrained;
  const lite = narrow || !canHover;

  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Defer the 3D chunk until the browser is idle, so it never competes with first paint.
  useEffect(() => {
    if (!sceneAllowed) return;
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
  }, [sceneAllowed]);

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
      {!sceneAllowed && <PipelineHint />}
      {sceneAllowed && mounted && (
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
