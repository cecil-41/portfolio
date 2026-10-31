import React, { useRef } from 'react';
import type { PointerEvent, ReactNode } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { usePointerEffects } from './motion';

interface TiltCardProps {
  children: ReactNode;
  /** Classes for the card itself (surface, border, radius, padding). */
  className?: string;
  /** Maximum rotation in degrees on each axis. */
  maxTilt?: number;
  /** Show the moving specular highlight. */
  specular?: boolean;
}

const SPRING = { stiffness: 220, damping: 22, mass: 0.6 };

/**
 * A card that tilts toward the pointer in 3D with a soft specular highlight that
 * follows it. Renders as a plain static card with reduced motion or on touch.
 * TiltCard adds no surface styles of its own; pass them via `className`.
 */
const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 6,
  specular = true,
}) => {
  const enabled = usePointerEffects();
  const ref = useRef<HTMLDivElement>(null);

  // Pointer position within the card, 0..1. Starts centred.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const glow = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), SPRING);
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), SPRING);
  const glowOpacity = useSpring(glow, { stiffness: 200, damping: 30 });

  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const highlight = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, var(--specular), transparent 55%)`;

  if (!enabled) {
    return <div className={`relative ${className}`}>{children}</div>;
  }

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
    glow.set(1);
  };

  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
    glow.set(0);
  };

  return (
    <div className="h-full" style={{ perspective: 1000 }}>
      <motion.div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={`relative will-change-transform ${className}`}
      >
        {children}
        {specular && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: highlight, opacity: glowOpacity }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default TiltCard;
