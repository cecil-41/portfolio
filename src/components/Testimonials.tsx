import React, { useCallback, useRef, useState } from 'react';
import type { FocusEvent, KeyboardEvent } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import { FaLinkedinIn } from 'react-icons/fa6';
import testimonialsData from '../data/testimonials.json';
import { EASE_OUT, Reveal, Section, SectionHeading, usePageVisible, useReducedMotion } from './ui';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  /** Path relative to the public folder, e.g. "profiles/klaas.jpg". */
  image: string;
  content: string;
  rating: number;
  linkedIn: string;
}

const testimonials = testimonialsData as Testimonial[];
const COUNT = testimonials.length;

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
/** 96px and 192px WebPs sit next to each original JPG; the JPG stays as the fallback. */
const thumb = (path: string, px: 96 | 192) => asset(path.replace(/\.jpe?g$/i, `-${px}.webp`));

const pad = (n: number) => String(n).padStart(2, '0');

const Avatar: React.FC<{ t: Testimonial; size: number; className?: string }> = ({
  t,
  size,
  className = '',
}) => (
  <picture>
    <source
      type="image/webp"
      srcSet={`${thumb(t.image, 96)} 96w, ${thumb(t.image, 192)} 192w`}
      sizes={`${size}px`}
    />
    <img
      src={asset(t.image)}
      alt={t.name}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={`rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  </picture>
);

const Testimonials: React.FC = () => {
  const reduced = useReducedMotion();
  const regionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(regionRef, { amount: 0.4 });

  const [index, setIndex] = useState(0);
  /** The user's play/pause choice. Manual navigation also stops auto-advance. */
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  /** Set once the user navigates, so the live region only speaks for their own actions. */
  const [announce, setAnnounce] = useState(false);

  const pageVisible = usePageVisible();
  const autoplay = playing && !reduced && inView;
  // A hidden tab holds the dwell timer where it is, rather than restarting it.
  const held = hovered || focused || !pageVisible;

  const go = useCallback((next: number) => setIndex(((next % COUNT) + COUNT) % COUNT), []);

  const select = (next: number) => {
    setPlaying(false);
    setAnnounce(true);
    go(next);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowLeft: index - 1,
      ArrowRight: index + 1,
      Home: 0,
      End: COUNT - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    select(keys[e.key]);
    // Keep focus on the avatar row when navigating from it, so arrows feel like a tablist.
    const target = e.target as HTMLElement;
    if (target.dataset.avatar !== undefined) {
      const next = ((keys[e.key] % COUNT) + COUNT) % COUNT;
      regionRef.current?.querySelector<HTMLButtonElement>(`[data-avatar="${next}"]`)?.focus();
    }
  };

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
  };

  const active = testimonials[index];

  return (
    <Section id="testimonials" aria-labelledby="testimonials-heading">
      <Reveal>
        <SectionHeading
          id="testimonials-heading"
          index={4}
          label="Testimonials"
          title="In their words"
          lead="Recommendations from engineers, lecturers and teammates I have worked alongside."
        />
      </Reveal>

      <Reveal delay={0.05}>
        <div
          ref={regionRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Recommendations"
          onKeyDown={handleKeyDown}
          onPointerEnter={(e) => e.pointerType !== 'touch' && setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
        >
          {/* Featured quote */}
          <div className="relative overflow-hidden rounded-2xl border border-line bg-surface px-6 pt-14 pb-10 sm:px-12 sm:pt-20 sm:pb-12 lg:px-16">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-4 font-display text-[9rem] leading-[0.9] text-accent/15 select-none sm:left-8 sm:text-[13rem]"
            >
              &ldquo;
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-12 top-0 h-px bg-linear-to-r from-transparent via-accent/50 to-transparent"
            />

            {/* All slides share one grid cell so the panel keeps the height of the longest quote. */}
            <div className="relative grid">
              {testimonials.map((t, i) => {
                const isActive = i === index;
                return (
                  <motion.div
                    key={t.id}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${COUNT}`}
                    aria-hidden={!isActive}
                    inert={!isActive}
                    className="col-start-1 row-start-1 flex flex-col"
                    initial={false}
                    animate={
                      isActive
                        ? { opacity: 1, y: 0, visibility: 'visible' }
                        : { opacity: 0, y: reduced ? 0 : 8, transitionEnd: { visibility: 'hidden' } }
                    }
                    transition={{ duration: reduced ? 0.15 : 0.5, ease: EASE_OUT }}
                  >
                    {/* The slide wrapper carries role="group" (not allowed on <figure>), so the
                        figure sits inside it and keeps the quote/caption semantics. */}
                    <figure className="flex flex-1 flex-col">
                    <blockquote className="max-w-4xl">
                      <p className="font-display text-[1.375rem] leading-[1.35] tracking-[-0.02em] text-fg text-pretty sm:text-3xl lg:text-[2.125rem]">
                        {t.content}
                      </p>
                    </blockquote>
                    <figcaption className="mt-auto flex items-center gap-4 pt-10">
                      <Avatar t={t} size={48} className="border border-line" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-fg">{t.name}</p>
                        <p className="text-sm leading-snug text-muted">
                          {t.role}
                          <span aria-hidden="true" className="mx-1.5">
                            ·
                          </span>
                          <span className="sr-only">, </span>
                          {t.company}
                        </p>
                      </div>
                      <a
                        href={t.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors hover:border-muted hover:text-fg"
                        aria-label={`${t.name} on LinkedIn (opens in a new tab)`}
                      >
                        <FaLinkedinIn size={16} aria-hidden="true" />
                      </a>
                    </figcaption>
                    </figure>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-5">
            <div role="group" aria-label="Choose a recommendation" className="flex items-center gap-3">
              {testimonials.map((t, i) => {
                const isActive = i === index;
                return (
                  <button
                    key={t.id}
                    type="button"
                    data-avatar={i}
                    onClick={() => select(i)}
                    aria-current={isActive ? 'true' : undefined}
                    aria-label={`Show recommendation from ${t.name}`}
                    tabIndex={isActive ? 0 : -1}
                    className="group relative rounded-full p-0.5"
                  >
                    <span
                      className={`block rounded-full ring-offset-2 ring-offset-bg transition-[box-shadow,filter,opacity] duration-300 ${
                        isActive
                          ? 'ring-2 ring-accent'
                          : 'opacity-60 ring-1 ring-line grayscale group-hover:opacity-100 group-hover:grayscale-0'
                      }`}
                    >
                      <Avatar t={t} size={44} />
                    </span>
                    {/* Dwell-time hairline under the active avatar. Its end advances the carousel. */}
                    {isActive && autoplay && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-2 -bottom-2.5 h-px overflow-hidden bg-line"
                      >
                        <span
                          key={index}
                          className="block h-full origin-left animate-progress bg-accent"
                          style={{ animationPlayState: held ? 'paused' : 'running' }}
                          onAnimationEnd={() => go(index + 1)}
                        />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <p className="mr-2 font-mono text-xs tabular-nums text-muted">
                <span className="text-fg">{pad(index + 1)}</span>
                <span aria-hidden="true" className="mx-1.5">
                  /
                </span>
                <span className="sr-only"> of </span>
                {pad(COUNT)}
              </p>
              {!reduced && (
                <button
                  type="button"
                  onClick={() => {
                    setAnnounce(false);
                    setPlaying((p) => !p);
                  }}
                  aria-label={playing ? 'Pause auto-advance' : 'Resume auto-advance'}
                  className="grid h-11 w-11 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-fg"
                >
                  {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
                </button>
              )}
              <button
                type="button"
                onClick={() => select(index - 1)}
                aria-label="Previous recommendation"
                className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-fg hover:border-muted hover:bg-surface-2"
              >
                <ArrowLeft size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => select(index + 1)}
                aria-label="Next recommendation"
                className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-fg hover:border-muted hover:bg-surface-2"
              >
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Announces changes the user makes; auto-advance stays silent so it never interrupts. */}
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {announce && `${active.name}, ${active.role}, ${active.company}: ${active.content}`}
          </p>
        </div>
      </Reveal>
    </Section>
  );
};

export default Testimonials;
