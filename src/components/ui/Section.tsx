import React from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, 'id'> {
  /** Anchor id used by navigation (`#experience`). */
  id: string;
  children: ReactNode;
  /** Classes for the inner max-width container. */
  containerClassName?: string;
  /** Use a wider container for full-bleed layouts. */
  width?: 'default' | 'wide';
}

const widths = {
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
} as const;

/**
 * Consistent vertical rhythm and container for every homepage section.
 * Pair with <SectionHeading id={`${id}-heading`} /> and pass `aria-labelledby`.
 */
const Section: React.FC<SectionProps> = ({
  id,
  children,
  className = '',
  containerClassName = '',
  width = 'default',
  ...rest
}) => (
  <section id={id} className={`relative scroll-mt-[calc(5rem+env(safe-area-inset-top))] py-20 md:py-32 ${className}`} {...rest}>
    <div className={`mx-auto w-full ${widths[width]} px-5 sm:px-8 ${containerClassName}`}>
      {children}
    </div>
  </section>
);

export default Section;
