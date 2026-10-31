import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import experiencesData from '../data/experiences.json';
import profile from '../data/profile.json';
import { EASE_OUT, Reveal, Section, SectionHeading, useReducedMotion } from './ui';

interface Role {
  id: number;
  company: string;
  position: string;
  period: string;
  description: string;
  /** Two or three short points for the sticky summary. Picked from `achievements`. */
  highlights?: string[];
  achievements: string[];
  technologies: string[];
}

const roles = experiencesData as Role[];

/** Achievements shown before the "Show all" disclosure. */
const VISIBLE_ACHIEVEMENTS = 4;

/** Turns "March 2024 - February 2025" into "March 2024 – February 2025". */
const formatPeriod = (period: string) => period.replace(/\s*[-–]\s*/g, ' – ');

const pad = (n: number) => String(n).padStart(2, '0');

const roleDomId = (role: Role) => `experience-role-${role.id}`;

const CurrentBadge: React.FC = () => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2/60 px-2.5 py-1 font-mono text-[0.68rem] font-medium uppercase tracking-[0.12em] text-accent-ink">
    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
    Current
  </span>
);

/** The accent hairline across the top of the current role, as on the Skills hero panel. */
const TopHairline: React.FC = () => (
  <span
    aria-hidden="true"
    className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-accent/70 to-transparent"
  />
);

/**
 * Large screens only: the sticky summary of the role currently in view, plus an index
 * of every role. The summary repeats what's in the cards, so it's hidden from screen
 * readers; the index is a real nav that jumps to (and focuses) each role.
 */
const StickyPanel: React.FC<{ active: number; onJump: (i: number) => void; reduced: boolean }> = ({
  active,
  onJump,
  reduced,
}) => {
  const role = roles[active];

  return (
    <div className="sticky top-28">
      <div
        aria-hidden="true"
        className="relative overflow-hidden rounded-2xl border border-line bg-surface p-7"
      >
        {active === 0 && <TopHairline />}
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--color-line)_1px,transparent_1px)] bg-size-[18px_18px] [mask-image:radial-gradient(ellipse_60%_60%_at_100%_0%,black,transparent)]" />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={role.id}
            className="relative"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
            transition={{ duration: reduced ? 0 : 0.25, ease: EASE_OUT }}
          >
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted tabular-nums">
                <span className="text-accent-ink">{pad(active + 1)}</span>
                <span className="mx-1.5">/</span>
                {pad(roles.length)}
              </p>
              {active === 0 && <CurrentBadge />}
            </div>

            <p className="mt-6 font-mono text-xs tabular-nums text-muted">{formatPeriod(role.period)}</p>
            <p className="mt-2 font-display text-[1.75rem] font-medium leading-tight tracking-[-0.02em] text-fg text-balance">
              {role.position}
            </p>
            <p className="mt-1 text-base text-muted">{role.company}</p>

            {role.highlights && role.highlights.length > 0 && (
              <ul className="mt-6 space-y-2.5 border-t border-line pt-5">
                {role.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-sm leading-relaxed text-fg">
                    <span className="mt-[10px] h-[1.5px] w-3 shrink-0 bg-accent" />
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <nav aria-label="Roles" className="mt-6">
        <ol className="space-y-1">
          {roles.map((r, i) => {
            const isActive = i === active;
            return (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => onJump(i)}
                  aria-current={isActive ? 'step' : undefined}
                  className={`group flex w-full cursor-pointer items-baseline gap-4 rounded-lg border-l-2 py-2 pr-3 pl-4 text-left transition-colors duration-200 hover:bg-surface-2/60 ${
                    isActive ? 'border-accent bg-surface-2/40' : 'border-transparent'
                  }`}
                >
                  <span
                    className={`font-mono text-xs tabular-nums ${isActive ? 'text-accent-ink' : 'text-muted'}`}
                  >
                    {pad(i + 1)}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block text-sm font-medium ${isActive ? 'text-fg' : 'text-muted group-hover:text-fg'}`}
                    >
                      {r.position}
                    </span>
                    <span className="block text-xs text-muted">{r.company}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

const RoleCard: React.FC<{ role: Role; index: number }> = ({ role, index }) => {
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();
  const current = index === 0;
  const listId = `${roleDomId(role)}-achievements`;
  // Only collapse when it hides at least two items; "Show all 5" for one more line is noise.
  const overflow = role.achievements.length > VISIBLE_ACHIEVEMENTS + 1;
  const shown = expanded || !overflow ? role.achievements : role.achievements.slice(0, VISIBLE_ACHIEVEMENTS);

  return (
    <article
      id={roleDomId(role)}
      tabIndex={-1}
      aria-labelledby={`${roleDomId(role)}-title`}
      className="relative scroll-mt-28 overflow-hidden rounded-2xl border border-line bg-surface p-6 focus:outline-none focus-visible:outline-2 focus-visible:outline-accent sm:p-8"
    >
      {current && <TopHairline />}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs tabular-nums text-muted">
          <span className="sr-only">Dates: </span>
          {formatPeriod(role.period)}
        </p>
        {current && <CurrentBadge />}
      </div>

      <h3
        id={`${roleDomId(role)}-title`}
        className="mt-4 font-display text-2xl font-medium leading-tight tracking-[-0.02em] text-fg text-balance sm:text-[1.75rem]"
      >
        {role.position}
      </h3>
      <p className="mt-1 text-base text-muted">{role.company}</p>

      <p className="mt-5 max-w-prose text-base leading-relaxed text-fg/90 text-pretty">{role.description}</p>

      <h4 className="mt-8 font-mono text-[0.7rem] font-medium uppercase tracking-[0.16em] text-muted">
        What I did
      </h4>
      <ul id={listId} className="mt-4 space-y-3">
        {shown.map((a, i) => (
          <motion.li
            key={a}
            className="flex gap-3 text-sm leading-6 text-muted text-pretty sm:text-[0.9375rem]"
            initial={i >= VISIBLE_ACHIEVEMENTS && !reduced ? { opacity: 0, y: 6 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: (i - VISIBLE_ACHIEVEMENTS) * 0.04, ease: EASE_OUT }}
          >
            <span aria-hidden="true" className="mt-[11px] h-[1.5px] w-3 shrink-0 bg-accent" />
            <span>{a}</span>
          </motion.li>
        ))}
      </ul>

      {overflow && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line bg-surface-2/60 px-4 font-mono text-xs uppercase tracking-[0.12em] text-fg hover:border-muted"
        >
          {expanded ? 'Show fewer' : `Show all ${role.achievements.length}`}
          <ChevronDown
            size={14}
            aria-hidden="true"
            className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      )}

      <h4 className="sr-only">Technologies</h4>
      <ul className="mt-8 flex flex-wrap gap-2 border-t border-line pt-6">
        {role.technologies.map((t) => (
          <li
            key={t}
            className="rounded-full border border-line bg-surface-2/60 px-3 py-1 font-mono text-xs text-fg"
          >
            {t}
          </li>
        ))}
      </ul>
    </article>
  );
};

const Experience: React.FC = () => {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  // The rail fills to the middle of the viewport as the roles scroll past it.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 50%', 'end 50%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });

  // The active role is the one crossing the middle of the viewport.
  useEffect(() => {
    const items = listRef.current?.querySelectorAll<HTMLElement>('[data-role-index]');
    if (!items?.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.roleIndex));
        });
      },
      { rootMargin: '-49% 0px -50% 0px' },
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const jumpTo = (i: number) => {
    const el = document.getElementById(roleDomId(roles[i]));
    if (!el) return;
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    el.focus({ preventScroll: true });
  };

  return (
    <Section id="experience" aria-labelledby="experience-heading">
      <Reveal>
        <SectionHeading
          id="experience-heading"
          index={2}
          label="Experience"
          title="From the tutor's desk to enterprise software"
          lead={`${profile.yearsExperience}+ years building software: from teaching programming at university, to full-stack tools used in manufacturing plants across five countries, to the data platforms and integrated cloud systems I build today.`}
        />
      </Reveal>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="hidden lg:block">
          <StickyPanel active={active} onJump={jumpTo} reduced={reduced} />
        </div>

        <ol ref={listRef} className="relative pl-8 sm:pl-12">
          {/* Rail. On large screens an accent line fills it as you scroll. */}
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-2 w-px -translate-x-1/2 bg-line [mask-image:linear-gradient(to_bottom,black_85%,transparent)] sm:left-4"
          />
          {!reduced && (
            <motion.span
              aria-hidden="true"
              className="absolute inset-y-0 left-2 hidden w-px origin-top -translate-x-1/2 bg-accent [mask-image:linear-gradient(to_bottom,black_85%,transparent)] sm:left-4 lg:block"
              style={{ scaleY: fill }}
            />
          )}

          {roles.map((role, i) => {
            const isActive = i === active;
            const passed = i < active;
            // Small screens and reduced motion get a static rail: only the current role is lit.
            const lit = reduced ? i === 0 : isActive;
            return (
              <li key={role.id} data-role-index={i} className="relative pb-6 last:pb-0 sm:pb-8">
                <span
                  aria-hidden="true"
                  className={`absolute top-8 -left-6 h-3 w-3 -translate-x-1/2 rounded-full border transition-[background-color,border-color,box-shadow] duration-300 sm:top-9 sm:-left-8 ${
                    i === 0 ? 'border-accent bg-bg' : 'border-muted/60 bg-surface-2'
                  } ${
                    lit
                      ? 'lg:border-accent lg:bg-accent lg:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-accent)_18%,transparent),0_0_14px_color-mix(in_oklab,var(--color-accent)_45%,transparent)]'
                      : passed && !reduced
                        ? 'lg:border-accent lg:bg-bg'
                        : ''
                  }`}
                />
                <Reveal y={16}>
                  <RoleCard role={role} index={i} />
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
};

export default Experience;
