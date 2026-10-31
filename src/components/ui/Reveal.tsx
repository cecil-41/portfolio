import React from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { EASE_OUT, useReducedMotion } from './motion';

const elements = {
  div: motion.div,
  li: motion.li,
  article: motion.article,
  header: motion.header,
  span: motion.span,
} as const;

interface RevealProps {
  children: ReactNode;
  /** Element to render. Defaults to div. */
  as?: keyof typeof elements;
  /** Delay in seconds, handy for simple staggers (`delay={i * 0.06}`). */
  delay?: number;
  /** Distance to travel upward in px. */
  y?: number;
  /** Animate only the first time it enters the viewport. */
  once?: boolean;
  className?: string;
}

/**
 * Fades and lifts content into place as it scrolls into view.
 * With reduced motion it's a short opacity fade only, with no movement.
 */
const Reveal: React.FC<RevealProps> = ({
  children,
  as = 'div',
  delay = 0,
  y = 24,
  once = true,
  className,
}) => {
  const reduced = useReducedMotion();
  const Component = elements[as] as typeof motion.div;

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '0px 0px -10% 0px' }}
      transition={{
        duration: reduced ? 0.2 : 0.7,
        delay: reduced ? 0 : delay,
        ease: EASE_OUT,
      }}
    >
      {children}
    </Component>
  );
};

export default Reveal;
