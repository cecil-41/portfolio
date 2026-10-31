import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Check, Copy, Mail } from 'lucide-react';
import profile from '../data/profile.json';
import { copyText } from '../utils/clipboard';
import { SOCIAL_ICONS } from './socialIcons';
import { MagneticButton, Reveal, Section, SectionHeading } from './ui';

/** A readable handle for each profile URL, e.g. "github.com/cecil-41". */
const handleOf = (url: string) => {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube')) return 'youtube.com';
    return `${u.hostname.replace(/^www\./, '')}${u.pathname.replace(/\/$/, '')}`;
  } catch {
    return url;
  }
};

const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const elsewhere = profile.socials.filter((s) => s.id !== 'email');

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copyEmail = async () => {
    if (await copyText(profile.email)) setCopied(true);
  };

  return (
    <Section
      id="contact"
      aria-labelledby="contact-heading"
      className="overflow-hidden border-t border-line"
    >
      {/* Quiet depth: a faint dot grid and a soft accent wash behind the headline. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--color-line)_1px,transparent_1px)] bg-size-[22px_22px] [mask-image:radial-gradient(ellipse_55%_60%_at_20%_30%,black,transparent)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-[-10%] h-[36rem] w-[50rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-accent)_12%,transparent),transparent)]"
      />

      <div className="relative grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="min-w-0 lg:col-span-8">
          <Reveal>
            <SectionHeading
              id="contact-heading"
              index={6}
              label="Contact"
              size="display"
              title={
                <>
                  Let&rsquo;s build something <span className="text-accent-ink">reliable.</span>
                </>
              }
              lead="I'm a software engineer with experience across software, data platforms, cloud and AI. If you're hiring or have a system that needs building, email is the quickest way to reach me."
              className="mb-10! md:mb-12!"
            />
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex flex-wrap items-center gap-3">
              <MagneticButton href={`mailto:${profile.email}`} size="lg">
                <Mail size={18} aria-hidden="true" />
                Email me
              </MagneticButton>
              <MagneticButton
                variant="secondary"
                size="lg"
                onClick={copyEmail}
                aria-label={copied ? 'Email address copied' : `Copy email address ${profile.email}`}
                className="px-5! font-mono text-sm!"
              >
                {copied ? (
                  <Check size={16} aria-hidden="true" className="text-accent-ink" />
                ) : (
                  <Copy size={16} aria-hidden="true" className="text-muted" />
                )}
                <span className={copied ? 'text-accent-ink' : ''}>
                  {copied ? 'Copied' : profile.email}
                </span>
              </MagneticButton>
            </div>
            <p className="sr-only" aria-live="polite">
              {copied ? 'Email address copied to clipboard' : ''}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="min-w-0 lg:col-span-4 lg:pt-28">
          <h3 className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted">
            Elsewhere
          </h3>
          <ul className="mt-4 border-t border-line">
            {elsewhere.map((social) => {
              const Icon = SOCIAL_ICONS[social.id];
              return (
                <li key={social.id} className="border-b border-line">
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-16 items-center gap-4 py-4 text-fg hover:text-fg"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-surface text-muted transition-colors group-hover:border-accent/50 group-hover:text-accent-ink">
                      {Icon && <Icon size={16} aria-hidden={true} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg font-medium tracking-[-0.02em]">
                        {social.label}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </span>
                      <span className="block truncate font-mono text-xs text-muted">
                        {handleOf(social.url)}
                      </span>
                    </span>
                    <ArrowUpRight
                      size={18}
                      aria-hidden="true"
                      className="shrink-0 text-muted transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-ink"
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
};

export default Contact;
