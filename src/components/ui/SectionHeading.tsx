import React from 'react';
import type { ReactNode } from 'react';

interface SectionHeadingProps {
  /** Section number shown in the eyebrow, e.g. 2 renders "02". */
  index: number;
  /** Short eyebrow label, e.g. "Experience". */
  label: string;
  /** The heading text. */
  title: ReactNode;
  /** Optional supporting paragraph. */
  lead?: ReactNode;
  /** id for the heading so the parent <Section> can reference it via aria-labelledby. */
  id?: string;
  align?: 'left' | 'center';
  /** Heading level. Use 1 for standalone pages such as /blog. Defaults to 2. */
  level?: 1 | 2;
  /** `display` is a larger closing-statement size (Contact). */
  size?: 'default' | 'display';
  className?: string;
}

const titleSizes = {
  default: 'text-4xl leading-[1.05] sm:text-5xl',
  display: 'text-[clamp(2.75rem,7.5vw,6rem)] leading-[0.98]',
} as const;

const SectionHeading: React.FC<SectionHeadingProps> = ({
  index,
  label,
  title,
  lead,
  id,
  align = 'left',
  level = 2,
  size = 'default',
  className = '',
}) => {
  const centered = align === 'center';
  const Heading = level === 1 ? 'h1' : 'h2';

  return (
    <header
      className={`mb-12 md:mb-16 ${centered ? 'mx-auto text-center' : ''} ${
        size === 'display' ? 'max-w-5xl' : 'max-w-3xl'
      } ${className}`}
    >
      <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent-ink">
        <span>{String(index).padStart(2, '0')}</span>
        <span aria-hidden="true" className="mx-2 text-muted">
          /
        </span>
        <span>{label}</span>
      </p>
      <Heading
        id={id}
        className={`font-display font-semibold tracking-display text-fg text-balance ${titleSizes[size]}`}
      >
        {title}
      </Heading>
      {lead && (
        <p
          className={`mt-5 text-base leading-relaxed text-muted text-pretty sm:text-lg ${
            centered ? 'mx-auto' : ''
          } max-w-2xl`}
        >
          {lead}
        </p>
      )}
    </header>
  );
};

export default SectionHeading;
