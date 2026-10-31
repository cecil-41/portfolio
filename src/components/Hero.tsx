import React, { useRef } from 'react';
import type { ComponentType } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ArrowDown, Download, Mail } from 'lucide-react';
import { FaGithub, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import profile from '../data/profile.json';
import HeroBackdrop from './hero/HeroBackdrop';
import { EASE_OUT, MagneticButton, TiltCard, useReducedMotion } from './ui';

const SOCIAL_ICONS: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  github: FaGithub,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
  email: Mail,
};

const PORTRAIT_SRC = `${import.meta.env.BASE_URL}images/cecil.webp`;
const RESUME_HREF = `${import.meta.env.BASE_URL}resume.pdf`;

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: 'smooth' });
};

/** Focus areas as a slow marquee; a static wrapped row under reduced motion. */
const FocusStrip: React.FC<{ reduced: boolean }> = ({ reduced }) => {
  const items = profile.focus;
  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-6 pr-6 font-mono text-xs uppercase tracking-[0.12em] text-muted sm:text-[0.8rem]"
    >
      {items.map((item) => (
        <li key={item} className="flex items-center gap-6 whitespace-nowrap">
          {item}
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-line" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="relative z-10 border-t border-line/80 bg-bg/50 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-5 px-5 py-4 sm:px-8">
        <span className="shrink-0 font-mono text-xs uppercase tracking-[0.14em] text-accent-ink">
          Focus
        </span>
        <span aria-hidden="true" className="h-4 w-px shrink-0 bg-line" />
        {reduced ? (
          <ul
            aria-label="Focus areas"
            className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-[0.12em] text-muted"
          >
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <div
            aria-label="Focus areas"
            role="group"
            className="group relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
          >
            <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
              {row(false)}
              {row(true)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Hero: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduced ? 0 : 0.08, delayChildren: reduced ? 0 : 0.1 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 16 },
    visible: { opacity: 1, y: 0, transition: { duration: reduced ? 0.01 : 0.7, ease: EASE_OUT } },
  };

  const [firstName, ...rest] = profile.name.split(' ');
  const lastName = rest.join(' ');

  return (
    <section
      id="home"
      ref={ref}
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-svh flex-col overflow-hidden"
    >
      <HeroBackdrop progress={scrollYProgress} />

      {/* Scrims keep the copy readable over the scene. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-bg/55 lg:bg-transparent lg:bg-linear-to-r lg:from-bg lg:from-25% lg:via-bg/70 lg:via-50% lg:to-transparent lg:to-75%"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-bg to-transparent"
      />

      <motion.div
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-5 pt-28 pb-16 sm:px-8 lg:grid-cols-12 lg:pt-32 lg:pb-20"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7"
        >
          {/* Compact portrait for small screens */}
          <motion.div variants={item} className="mb-8 lg:hidden">
            <img
              src={PORTRAIT_SRC}
              alt={`Portrait of ${profile.name}`}
              width={480}
              height={600}
              fetchPriority="high"
              decoding="async"
              className="h-20 w-20 rounded-full border border-line object-cover object-[50%_18%]"
            />
          </motion.div>

          <motion.p
            variants={item}
            className="flex items-start gap-3 font-mono text-xs uppercase leading-relaxed tracking-[0.14em] text-muted"
          >
            <span aria-hidden="true" className="relative mt-[0.4em] flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span>
              {profile.title} <span className="text-line" aria-hidden="true">·</span>{' '}
              <span className="text-fg/80">{profile.subtitle}</span>
            </span>
          </motion.p>

          <motion.h1
            id="hero-heading"
            variants={item}
            className="mt-6 font-display text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.92] tracking-display text-fg"
          >
            <span className="block">{firstName}</span>{' '}
            <span className="block bg-linear-to-r from-accent to-accent-2 bg-clip-text pb-[0.06em] text-transparent">
              {lastName}
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-8 max-w-xl font-display text-xl leading-snug tracking-[-0.01em] text-fg sm:text-2xl"
          >
            I'm a software engineer with experience across software, data platforms, cloud systems and AI.
          </motion.p>

          <motion.p variants={item} className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {profile.tagline}
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-3">
            <MagneticButton size="lg" onClick={() => scrollToId('experience')}>
              View experience
              <ArrowDown size={18} aria-hidden="true" />
            </MagneticButton>
            <MagneticButton
              size="lg"
              variant="secondary"
              href={RESUME_HREF}
              download="Cecil_Sithole_Resume.pdf"
            >
              <Download size={18} aria-hidden="true" />
              Download résumé
            </MagneticButton>
          </motion.div>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <ul className="flex items-center gap-2">
              {profile.socials.map(({ id, label, url }) => {
                const Icon = SOCIAL_ICONS[id] ?? Mail;
                const external = !url.startsWith('mailto:');
                return (
                  <li key={id}>
                    <a
                      href={url}
                      aria-label={label}
                      title={label}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface/60 text-muted backdrop-blur-sm hover:border-muted hover:text-fg"
                    >
                      <Icon size={16} aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
            <span aria-hidden="true" className="hidden h-8 w-px bg-line sm:block" />
            <p className="flex items-baseline gap-2 font-mono text-xs uppercase tracking-[0.12em] text-muted">
              <span className="font-display text-2xl font-semibold normal-case tracking-display text-fg">
                {profile.yearsExperience}+
              </span>
              years building software
            </p>
          </motion.div>
        </motion.div>

        {/* Portrait for large screens: arched frame, mural faded into the page. */}
        <motion.div
          initial={{ opacity: 0, scale: reduced ? 1 : 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduced ? 0.01 : 0.9, delay: reduced ? 0 : 0.25, ease: EASE_OUT }}
          className="hidden lg:col-span-5 lg:flex lg:justify-end"
        >
          <div className="relative w-full max-w-[25rem]">
            <span
              aria-hidden="true"
              className="absolute -inset-3 rounded-t-full border border-line/80 [mask-image:linear-gradient(to_bottom,black_35%,transparent_75%)]"
            />
            <TiltCard maxTilt={4} className="overflow-hidden rounded-t-full rounded-b-[2rem]">
              <div className="relative aspect-4/5 [mask-image:linear-gradient(to_bottom,black_70%,transparent)]">
                <img
                  src={PORTRAIT_SRC}
                  alt={`Portrait of ${profile.name}, smiling, wearing a grey jacket`}
                  width={480}
                  height={600}
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-cover object-top"
                />
                {/* Vignette into the page colour so the busy mural recedes; the face stays untouched. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(ellipse_72%_66%_at_50%_34%,transparent_48%,color-mix(in_oklab,var(--color-bg)_70%,transparent)_80%,var(--color-bg)_100%)]"
                />
              </div>
            </TiltCard>
          </div>
        </motion.div>
      </motion.div>

      <FocusStrip reduced={reduced} />
    </section>
  );
};

export default Hero;
