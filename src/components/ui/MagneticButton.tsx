import React, { useRef } from 'react';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  PointerEvent,
  ReactNode,
} from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { usePointerEffects } from './motion';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** How strongly the button follows the pointer (0 to 1). */
  strength?: number;
  className?: string;
}

type AsLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & { href: string };
type AsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & { href?: undefined };

export type MagneticButtonProps = AsLink | AsButton;

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap ' +
  'transition-[background-color,border-color,color,box-shadow] duration-200 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ' +
  'disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  // Light: solid teal (dark ink passes 6:1). Dark: the signature teal to blue gradient.
  primary:
    'bg-accent text-on-accent hover:brightness-110 ' +
    'dark:bg-linear-to-r dark:from-accent dark:to-accent-2',
  secondary: 'border border-line bg-surface text-fg hover:border-muted hover:bg-surface-2',
  ghost: 'text-fg hover:bg-surface-2',
};

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-base',
};

/**
 * A button or link that is gently pulled toward the pointer.
 * Pass `href` to render an <a>; otherwise renders a <button>.
 * The pull is disabled for reduced motion and touch.
 */
const MagneticButton: React.FC<MagneticButtonProps> = (props) => {
  const {
    children,
    variant = 'primary',
    size = 'md',
    strength = 0.3,
    className = '',
    ...rest
  } = props;

  const enabled = usePointerEffects();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 18, mass: 0.5 });
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 18, mass: 0.5 });

  const handleMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (!enabled || e.pointerType === 'touch' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  const inner =
    rest.href !== undefined ? (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    ) : (
      <button
        type="button"
        className={classes}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );

  return (
    <motion.span
      ref={ref}
      className="inline-flex"
      style={enabled ? { x, y } : undefined}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      {inner}
    </motion.span>
  );
};

export default MagneticButton;
