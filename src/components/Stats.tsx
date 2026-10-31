import React, { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';
import profile from '../data/profile.json';
import { EASE_OUT, Reveal, useReducedMotion } from './ui';

interface Credential {
  label: string;
  /** Numeric value: counted up when it scrolls into view. */
  count?: number;
  /** Text appended to the counted number, e.g. "+". */
  suffix?: string;
  /** Text value, used when there is no number. */
  value?: string;
  /** Small unit shown beside the value. */
  unit?: string;
  detail: string;
  /** Marks the single warm highlight in the band. */
  status?: string;
}

/*
 * Facts checked against resume.json (education): BCom IS (2020-2022) and BCom Hons IS (2023)
 * both cum laude at the University of Johannesburg; MCom IT at UJ, 2025 to present.
 * Kept inline rather than importing resume.json, which also holds phone and reference details.
 */
const credentials: Credential[] = [
  {
    label: 'Experience',
    count: profile.yearsExperience,
    suffix: '+',
    unit: 'years',
    detail: 'Building software across full-stack, data, cloud and AI',
  },
  {
    label: 'Academic',
    value: 'Double cum laude',
    detail: 'BCom and BCom Honours in Information Systems',
  },
  {
    label: 'Postgraduate',
    value: 'M.Com IT',
    detail: 'University of Johannesburg · researching the impact of AI on DevOps',
    status: 'In progress',
  },
  {
    label: 'Certified',
    value: '3× AWS',
    detail: 'Cloud Practitioner, Developer and CloudOps Engineer',
  },
];

/** Counts from 0 to `to` once in view. Renders the final value straight away under reduced motion. */
const CountUp: React.FC<{ to: number; suffix?: string }> = ({ to, suffix = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reduced || !inView) return;
    const controls = animate(0, to, {
      duration: 1.4,
      ease: EASE_OUT,
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, to]);

  return (
    <span ref={ref}>
      <span className="sr-only">
        {to}
        {suffix}
      </span>
      <span aria-hidden="true" className="tabular-nums">
        {reduced ? to : value}
        {suffix}
      </span>
    </span>
  );
};

const Stats: React.FC = () => (
  <section aria-label="Credentials" className="relative border-y border-line bg-bg">
    <div className="mx-auto w-full max-w-7xl">
      <dl className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
        {credentials.map((c, i) => (
          <Reveal
            key={c.label}
            delay={i * 0.06}
            y={12}
            className="flex flex-col bg-bg px-5 py-8 sm:px-8 md:py-10"
          >
            <dt className="flex items-center gap-2 font-mono text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted">
              <span aria-hidden="true" className="text-accent-ink">
                {String(i + 1).padStart(2, '0')}
              </span>
              {c.label}
            </dt>
            <dd className="mt-5 flex flex-wrap items-baseline gap-x-2 font-display text-3xl font-semibold leading-none tracking-display text-fg md:text-[2.5rem]">
              {c.count !== undefined ? <CountUp to={c.count} suffix={c.suffix} /> : c.value}
              {c.unit && (
                <span className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted">
                  {c.unit}
                </span>
              )}
            </dd>
            <dd className="mt-3 text-sm leading-relaxed text-muted text-pretty">
              {c.detail}
              {c.status && (
                <span className="mt-3 flex items-center gap-2 font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-warm-ink">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-warm" />
                  {c.status}
                </span>
              )}
            </dd>
          </Reveal>
        ))}
      </dl>
    </div>
  </section>
);

export default Stats;
