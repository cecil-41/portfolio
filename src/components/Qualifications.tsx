import React from 'react';
import type { ComponentType } from 'react';
import { ArrowUpRight, BadgeCheck, Mic, Users } from 'lucide-react';
import { SiAmazonwebservices } from 'react-icons/si';
import qualificationsData from '../data/qualifications.json';
import { MagneticButton, Reveal, Section, SectionHeading, TiltCard } from './ui';

interface Qualification {
  id: number;
  type: 'certification' | 'education' | 'achievement';
  title: string;
  issuer: string;
  date: string;
  icon: string;
  description: string;
  credentialId?: string;
  /** Academic distinction, e.g. "cum laude". */
  distinction?: string;
  /** Dissertation or research title, shown under the degree. */
  research?: string;
}

type IconType = ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>;

/**
 * Public folder with every certificate. Copied from resume.json `basics.certificatesUrl`
 * rather than imported, because resume.json also holds contact details we don't want bundled.
 */
const CERTIFICATES_URL =
  'https://drive.google.com/drive/folders/1J3f7hMzE-pCRraPX9NKaqj-01hfndhzs?usp=drive_link';

/** Issuer brand marks from Simple Icons, where one exists. */
const ISSUER_ICONS: Record<string, IconType> = {
  'Amazon Web Services': SiAmazonwebservices,
};

/** Icons for community work, keyed by title. */
const ACHIEVEMENT_ICONS: Record<string, IconType> = {
  'Hackathon Mentor': Users,
  'Career Path Speaker': Mic,
};

/** Placeholder used in the data until a credential ID is issued. */
const PENDING_CREDENTIAL = 'Will be updated soon';

const all = qualificationsData as Qualification[];
const education = all.filter((q) => q.type === 'education');
const certifications = all.filter((q) => q.type === 'certification');
const achievements = all.filter((q) => q.type === 'achievement');

const isInProgress = (q: Qualification) =>
  /present/i.test(q.date) || /in progress/i.test(q.description);

/** Turns "2020 - 2022" into "2020 – 2022" for display. */
const formatDate = (date: string) => date.replace(/\s*-\s*/g, ' – ');

/** "AWS Certified Developer - Associate" reads better with an en dash. */
const formatTitle = (title: string) => title.replace(/\s-\s/g, ' – ');

/** A mono subheading with a hairline and a count, used for each group. */
const GroupHeading: React.FC<{ id: string; title: string; count: number; children?: React.ReactNode }> = ({
  id,
  title,
  count,
  children,
}) => (
  <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-3">
    <h3
      id={id}
      className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-fg"
    >
      {title}
      <span className="ml-2 text-muted tabular-nums">
        <span className="sr-only">(</span>
        {String(count).padStart(2, '0')}
        <span className="sr-only"> items)</span>
      </span>
    </h3>
    <span aria-hidden="true" className="h-px min-w-8 flex-1 bg-line" />
    {children}
  </div>
);

const StatusBadge: React.FC<{ q: Qualification }> = ({ q }) => {
  if (q.distinction) {
    return (
      <span className="inline-flex items-center rounded-full border border-warm/35 bg-warm/10 px-2.5 py-1 font-mono text-[0.68rem] font-medium uppercase tracking-[0.12em] text-warm-ink">
        {q.distinction}
      </span>
    );
  }
  if (isInProgress(q)) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2/60 px-2.5 py-1 font-mono text-[0.68rem] font-medium uppercase tracking-[0.12em] text-accent-ink">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
        In progress
      </span>
    );
  }
  return null;
};

/** Degrees as a ledger on a vertical rail, most recent first. */
const EducationList: React.FC = () => (
  <div className="rounded-2xl border border-line bg-surface">
    <ol className="relative">
      {education.map((q, i) => {
        const current = isInProgress(q);
        const last = i === education.length - 1;
        // The long-form name, shown when it adds something beyond the title.
        const detail = q.description.replace(/\s*\(In Progress\)\s*$/i, '');
        const showDetail = detail.toLowerCase() !== q.title.toLowerCase();
        return (
          <li
            key={q.id}
            className={`relative grid gap-x-8 gap-y-2 py-6 pr-5 pl-12 sm:grid-cols-[8.5rem_1fr_auto] sm:items-baseline sm:py-7 sm:pr-8 sm:pl-14 ${
              last ? '' : 'border-b border-line'
            }`}
          >
            {/* Rail and node. The rail runs through every row; the node marks status. */}
            <span
              aria-hidden="true"
              className={`absolute left-6 w-px bg-line sm:left-7 ${i === 0 ? 'top-9 sm:top-10' : 'top-0'} ${
                last ? 'h-9 sm:h-10' : 'bottom-0'
              }`}
            />
            <span
              aria-hidden="true"
              className={`absolute top-8 left-6 h-2.5 w-2.5 -translate-x-1/2 rounded-full border sm:top-9 sm:left-7 ${
                current ? 'border-accent bg-bg' : 'border-muted/60 bg-surface-2'
              }`}
            />

            <p className="font-mono text-xs tabular-nums text-muted">
              <span className="sr-only">Dates: </span>
              {formatDate(q.date)}
            </p>

            <div className="min-w-0">
              <h4 className="font-display text-xl font-medium leading-snug tracking-[-0.015em] text-fg text-balance sm:text-[1.375rem]">
                {q.title}
              </h4>
              <p className="mt-1 text-sm text-muted">{q.issuer}</p>
              {showDetail && <p className="mt-1 text-sm text-muted">{detail}</p>}
              {q.research && (
                <p className="mt-3 max-w-prose border-l-2 border-accent/60 pl-3 text-sm leading-relaxed text-fg text-pretty">
                  <span className="mb-1 block font-mono text-[0.7rem] uppercase tracking-[0.14em] text-accent-ink">
                    Dissertation
                  </span>
                  <cite className="not-italic">{q.research}</cite>
                </p>
              )}
            </div>

            <div className="sm:justify-self-end">
              <StatusBadge q={q} />
            </div>
          </li>
        );
      })}
    </ol>
  </div>
);

const CertificationCard: React.FC<{ q: Qualification }> = ({ q }) => {
  const Logo = ISSUER_ICONS[q.issuer] ?? BadgeCheck;
  const hasCredential = q.credentialId && q.credentialId !== PENDING_CREDENTIAL;

  return (
    <TiltCard
      maxTilt={5}
      className="flex h-full flex-col rounded-2xl border border-line bg-surface p-6 sm:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-fg">
          <Logo size={22} aria-hidden={true} />
        </span>
        <span className="font-mono text-xs tabular-nums text-muted">{q.date}</span>
      </div>

      <h4 className="mt-6 font-display text-lg font-medium leading-snug tracking-[-0.01em] text-fg text-balance">
        {formatTitle(q.title)}
      </h4>
      <p className="mt-1 text-sm text-muted">{q.issuer}</p>
      <p className="mt-4 text-sm leading-relaxed text-muted text-pretty">{q.description}</p>

      <dl className="mt-auto border-t border-line pt-4 font-mono text-[0.7rem] leading-relaxed">
        <div className="flex flex-col gap-1">
          <dt className="uppercase tracking-[0.14em] text-muted">Credential ID</dt>
          <dd className={hasCredential ? 'break-all text-fg select-all' : 'text-muted'}>
            {hasCredential ? q.credentialId : 'Pending'}
          </dd>
        </div>
      </dl>
    </TiltCard>
  );
};

const AchievementCard: React.FC<{ q: Qualification }> = ({ q }) => {
  const Icon = ACHIEVEMENT_ICONS[q.title] ?? BadgeCheck;
  return (
    <div className="flex h-full gap-4 rounded-2xl border border-line bg-surface p-6">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-accent-ink">
        <Icon size={18} aria-hidden={true} />
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h4 className="font-display text-lg font-medium leading-snug text-fg">{q.title}</h4>
          <span className="font-mono text-xs tabular-nums text-muted">{formatDate(q.date)}</span>
        </div>
        <p className="mt-0.5 text-sm text-muted">{q.issuer}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted text-pretty">{q.description}</p>
      </div>
    </div>
  );
};

const Qualifications: React.FC = () => (
  <Section id="qualifications" aria-labelledby="qualifications-heading">
    <Reveal>
      <SectionHeading
        id="qualifications-heading"
        index={3}
        label="Qualifications"
        title="Credentials behind the work"
        lead="Two cum laude Information Systems degrees from the University of Johannesburg, an M.Com in IT under way researching the impact of AI on DevOps, and AWS certifications across the practitioner, developer and operations tracks."
      />
    </Reveal>

    <div className="space-y-16 md:space-y-20">
      <section aria-labelledby="education-heading">
        <Reveal>
          <GroupHeading id="education-heading" title="Education" count={education.length} />
        </Reveal>
        <Reveal delay={0.05}>
          <EducationList />
        </Reveal>
      </section>

      <section aria-labelledby="certifications-heading">
        <Reveal>
          <GroupHeading id="certifications-heading" title="Certifications" count={certifications.length}>
            <MagneticButton
              href={CERTIFICATES_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              strength={0.2}
            >
              View all certificates
              <ArrowUpRight size={16} aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </MagneticButton>
          </GroupHeading>
        </Reveal>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((q, i) => (
            <Reveal as="li" key={q.id} delay={i * 0.06} className="h-full">
              <CertificationCard q={q} />
            </Reveal>
          ))}
        </ul>
      </section>

      {achievements.length > 0 && (
        <section aria-labelledby="community-heading">
          <Reveal>
            <GroupHeading id="community-heading" title="Community" count={achievements.length} />
          </Reveal>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {achievements.map((q, i) => (
              <Reveal as="li" key={q.id} delay={i * 0.06} className="h-full">
                <AchievementCard q={q} />
              </Reveal>
            ))}
          </ul>
        </section>
      )}
    </div>
  </Section>
);

export default Qualifications;
