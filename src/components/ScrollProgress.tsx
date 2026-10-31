import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useReducedMotion } from './ui';

/** A 2px teal-to-blue hairline across the top of the page showing read progress. */
const ScrollProgress: React.FC = () => {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-linear-to-r from-accent to-accent-2"
      style={{ scaleX: reduced ? scrollYProgress : smooth }}
    />
  );
};

export default ScrollProgress;
