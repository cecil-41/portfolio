import React, { useRef } from 'react';
import type { ComponentType } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ArrowDown, Download, Mail } from 'lucide-react';
import { FaGithub, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import profile from '../data/profile.json';
import HeroBackdrop from './hero/HeroBackdrop';
import { EASE_OUT, MagneticButton, usePlayWhileVisible, useReducedMotion } from './ui';
import { scrollToElement } from '../utils/scroll';

const SOCIAL_ICONS: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  github: FaGithub,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
  email: Mail,
};

const PORTRAIT_SRC = `${import.meta.env.BASE_URL}images/cecil-portrait.webp`;
const PORTRAIT_SMALL_SRC = `${import.meta.env.BASE_URL}images/cecil-portrait-160.webp`;
const RESUME_HREF = `${import.meta.env.BASE_URL}resume.pdf`;

const scrollToId = (id: string) => scrollToElement(document.getElementById(id));

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
      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-5 py-4 sm:gap-5 sm:px-8">
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
            // Fixed-width fades, with matching left padding so the first item starts fully visible.
            className="group relative min-w-0 flex-1 overflow-hidden pl-5 [mask-image:linear-gradient(to_right,transparent,black_1.25rem,black_calc(100%-2rem),transparent)]"
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
  // Hero loops (marquee, status ping, orbit ring) pause once the hero is off-screen or the tab is hidden.
  const loopsRunning = usePlayWhileVisible(ref);
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
      className={`relative isolate flex min-h-svh flex-col overflow-hidden ${
        loopsRunning ? '' : '[&_*]:[animation-play-state:paused]'
      }`}
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
        className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-5 pt-24 pb-12 sm:px-8 sm:pt-28 sm:pb-16 lg:grid-cols-12 lg:pt-32 lg:pb-20"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7"
        >
          {/* Compact portrait for small screens */}
          <motion.div variants={item} className="mb-6 sm:mb-8 lg:hidden">
            <img
              src={PORTRAIT_SMALL_SRC}
              alt={`Portrait of ${profile.name}`}
              width={160}
              height={200}
              fetchPriority="high"
              decoding="async"
              className="h-20 w-20 rounded-full border border-line object-cover object-[50%_20%]"
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
            {/* Phones: title and subtitle on their own lines, never split mid-phrase.
                From sm: one line with a separator. */}
            <span>
              <span className="whitespace-nowrap">{profile.title}</span>
              <span className="hidden sm:inline">
                {' '}
                <span className="text-line" aria-hidden="true">
                  ·
                </span>{' '}
              </span>
              <span className="sr-only sm:hidden">, </span>
              <span className="block whitespace-nowrap text-fg/80 sm:inline">{profile.subtitle}</span>
            </span>
          </motion.p>

          <motion.h1
            id="hero-heading"
            variants={item}
            className="mt-5 font-display text-[clamp(3rem,8vw,7rem)] sm:mt-6 font-semibold leading-[0.92] tracking-display text-fg"
          >
            <span className="block">{firstName}</span>{' '}
            <span className="block bg-linear-to-r from-accent to-accent-2 bg-clip-text pb-[0.06em] text-transparent">
              {lastName}
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl font-display text-xl leading-snug sm:mt-8 tracking-[-0.01em] text-fg sm:text-2xl"
          >
            I'm a software engineer with experience across software, data platforms, cloud systems and AI.
          </motion.p>

          <motion.p variants={item} className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {profile.tagline}
          </motion.p>

          {/* Phones: two equal buttons side by side with short labels. From sm: natural width. */}
          <motion.div variants={item} className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:flex sm:flex-wrap sm:items-center">
            <MagneticButton
              size="lg"
              onClick={() => scrollToId('experience')}
              wrapperClassName="min-w-0"
              className="w-full px-4 sm:w-auto sm:px-7"
            >
              <span className="sm:hidden">Experience</span>
              <span className="hidden sm:inline">View experience</span>
              <ArrowDown size={18} aria-hidden="true" />
            </MagneticButton>
            <MagneticButton
              size="lg"
              variant="secondary"
              href={RESUME_HREF}
              download="Cecil_Sithole_Resume.pdf"
              wrapperClassName="min-w-0"
              className="w-full px-4 sm:w-auto sm:px-7"
            >
              <Download size={18} aria-hidden="true" />
              <span className="sm:hidden">Résumé</span>
              <span className="hidden sm:inline">Download résumé</span>
            </MagneticButton>
          </motion.div>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 sm:mt-10">
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
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface/60 text-muted backdrop-blur-sm hover:border-muted hover:text-fg"
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

        {/* Portrait for large screens: a small circular avatar with a slow orbit ring, like the mobile one. */}
        <motion.div
          initial={{ opacity: 0, scale: reduced ? 1 : 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduced ? 0.01 : 0.9, delay: reduced ? 0 : 0.25, ease: EASE_OUT }}
          className="hidden lg:col-span-5 lg:flex lg:justify-center"
        >
          <div className="relative isolate h-52 w-52 xl:h-56 xl:w-56">
            {/* Soft accent glow behind the avatar. */}
            <span
              aria-hidden="true"
              className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-accent)_24%,transparent),transparent)] blur-2xl"
            />
            {/* Dashed orbit ring with a single node; it turns slowly unless motion is reduced. */}
            <span
              aria-hidden="true"
              className="absolute -inset-4 rounded-full border border-dashed border-accent/35 motion-safe:animate-[spin_40s_linear_infinite]"
            >
              <span className="absolute top-1/2 -left-1 h-2 w-2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]" />
            </span>
            <div className="h-full w-full overflow-hidden rounded-full border border-line bg-surface p-1.5 shadow-2xl shadow-black/40">
              <img
                src={PORTRAIT_SRC}
                alt={`Portrait of ${profile.name}, smiling, wearing a grey jacket`}
                width={360}
                height={450}
                fetchPriority="high"
                decoding="async"
                className="h-full w-full rounded-full object-cover object-[50%_22%]"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      <FocusStrip reduced={reduced} />
    </section>
  );
};

export default Hero;
