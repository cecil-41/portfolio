import React from 'react';
import type { ComponentType } from 'react';
import { Bot, Cable, Database, FileCode2, GraduationCap, Layers, LayoutDashboard, Workflow } from 'lucide-react';
import {
  SiAmazonwebservices,
  SiAngular,
  SiApachekafka,
  SiApachespark,
  SiDatabricks,
  SiDocker,
  SiDotnet,
  SiFastapi,
  SiGit,
  SiKubernetes,
  SiNodedotjs,
  SiOpenjdk,
  SiPython,
  SiReact,
  SiSplunk,
  SiTerraform,
  SiTypescript,
} from 'react-icons/si';
import { TbBrandCSharp, TbBrandReactNative } from 'react-icons/tb';
import { VscAzure } from 'react-icons/vsc';
import skillsData from '../data/skills.json';
import { Reveal, Section, SectionHeading, TiltCard } from './ui';

interface Skill {
  name: string;
  icon: string;
  years?: number;
}

interface SkillCategory {
  id: string;
  title: string;
  summary: string;
  featured?: boolean;
  skills: Skill[];
}

type IconType = ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>;

/** Data keys to icons. Simple Icons where a brand mark exists, lucide otherwise. */
const ICONS: Record<string, IconType[]> = {
  databricks: [SiDatabricks],
  spark: [SiApachespark],
  delta: [Layers],
  pipeline: [Workflow],
  kafka: [SiApachekafka],
  sql: [Database],
  dashboard: [LayoutDashboard],
  agent: [Bot],
  spec: [FileCode2],
  research: [GraduationCap],
  git: [SiGit],
  kubernetes: [SiDocker, SiKubernetes],
  terraform: [SiTerraform],
  azure: [VscAzure],
  aws: [SiAmazonwebservices],
  splunk: [SiSplunk],
  react: [SiReact],
  reactnative: [TbBrandReactNative],
  angular: [SiAngular],
  fastapi: [SiFastapi],
  dotnet: [TbBrandCSharp, SiDotnet],
  integration: [Cable],
  typescript: [SiTypescript],
  node: [SiNodedotjs],
  python: [SiPython],
  java: [SiOpenjdk],
};

const categories = skillsData as SkillCategory[];

/** Panels linked by the flow rail, in pipeline order. */
const FLOW_IDS = ['software', 'data', 'cloud'];

/** Placement in the bento grid. Software Engineering is the large hero panel. */
const LAYOUT: Record<string, string> = {
  software: 'md:col-span-2 lg:col-span-2 lg:row-span-2',
  data: '',
  ai: '',
  devops: 'md:col-span-2 lg:col-span-1',
  cloud: 'md:col-span-2 lg:col-span-2',
};

const SkillIcons: React.FC<{ icon: string; size: number }> = ({ icon, size }) => {
  const icons = ICONS[icon];
  if (!icons) return null;
  return (
    <span className="flex items-center gap-1">
      {icons.map((Icon, i) => (
        <Icon key={i} size={size} aria-hidden={true} />
      ))}
    </span>
  );
};

const Years: React.FC<{ years?: number }> = ({ years }) =>
  years ? (
    <span className="font-mono text-[0.7rem] tabular-nums text-muted">
      {years}
      <span className="sr-only"> years</span>
      <span aria-hidden="true">y</span>
    </span>
  ) : null;

/** Stage label for panels that sit on the pipeline, e.g. "01". */
const stageOf = (id: string) => {
  const i = FLOW_IDS.indexOf(id);
  return i === -1 ? null : String(i + 1).padStart(2, '0');
};

/**
 * A hairline rail with three stops (Software, Data, Cloud) and a pulse that travels along it,
 * echoing the hero pipeline. The pulse is hidden under reduced motion; the rail stays.
 */
const FlowRail: React.FC = () => {
  const stops = FLOW_IDS.map((id) => categories.find((c) => c.id === id)).filter(
    (c): c is SkillCategory => Boolean(c),
  );

  return (
    <div
      aria-hidden="true"
      className="mb-6 flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted"
    >
      {stops.map((stop, i) => (
        <React.Fragment key={stop.id}>
          <span className="flex shrink-0 items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full border border-accent bg-bg" />
            <span className="hidden sm:inline">{stop.title}</span>
            <span className="sm:hidden">{stop.title.split(' ')[0]}</span>
          </span>
          {i < stops.length - 1 && (
            <span className="relative h-px min-w-6 flex-1 overflow-hidden bg-line">
              <span
                className="absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-transparent via-accent to-transparent motion-safe:animate-flow motion-reduce:hidden"
                style={{ animationDelay: `${i * 1.6}s` }}
              />
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const PanelHeader: React.FC<{ category: SkillCategory; hero?: boolean }> = ({ category, hero }) => {
  const stage = stageOf(category.id);
  return (
    <>
      <h3 className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.16em] text-fg">
        {stage && (
          <span className="text-accent-ink">
            <span className="sr-only">Stage </span>
            {stage}
          </span>
        )}
        {category.title}
      </h3>
      <p
        className={
          hero
            ? 'mt-4 max-w-md font-display text-2xl leading-snug tracking-[-0.01em] text-fg text-pretty sm:text-[1.75rem]'
            : 'mt-3 text-sm leading-relaxed text-muted text-pretty'
        }
      >
        {category.summary}
      </p>
    </>
  );
};

/** The large featured panel: tools as a two-column list with icon tiles. */
const HeroPanel: React.FC<{ category: SkillCategory }> = ({ category }) => (
  <TiltCard
    maxTilt={2}
    className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface p-6 sm:p-8"
  >
    {/* Top hairline and a faint dot grid give the hero panel a little more presence. */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-accent/70 to-transparent"
    />
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--color-line)_1px,transparent_1px)] bg-size-[18px_18px] [mask-image:radial-gradient(ellipse_60%_60%_at_100%_0%,black,transparent)]"
    />

    <div className="relative">
      <PanelHeader category={category} hero />
    </div>

    <ul className="relative mt-8 grid gap-2 sm:grid-cols-2 lg:mt-auto lg:pt-10">
      {category.skills.map((skill) => (
        <li
          key={skill.name}
          className="flex items-center gap-3 rounded-xl border border-line bg-bg/40 p-3 transition-colors duration-200 hover:border-muted/60"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-surface-2 text-fg">
            <SkillIcons icon={skill.icon} size={17} />
          </span>
          <span className="min-w-0 flex-1 text-sm font-medium leading-snug text-fg">{skill.name}</span>
          <Years years={skill.years} />
        </li>
      ))}
    </ul>
  </TiltCard>
);

/** A standard panel: tools as wrapping chips. */
const Panel: React.FC<{ category: SkillCategory }> = ({ category }) => (
  <TiltCard
    maxTilt={4}
    className="flex h-full flex-col rounded-2xl border border-line bg-surface p-6 sm:p-7"
  >
    <PanelHeader category={category} />
    <ul className="mt-6 flex flex-wrap gap-2">
      {category.skills.map((skill) => (
        <li
          key={skill.name}
          className="flex items-center gap-2 rounded-full border border-line bg-surface-2/60 py-1.5 pr-3 pl-2.5 text-sm text-fg"
        >
          <span className="text-muted">
            <SkillIcons icon={skill.icon} size={14} />
          </span>
          {skill.name}
          <Years years={skill.years} />
        </li>
      ))}
    </ul>
  </TiltCard>
);

const Skills: React.FC = () => (
  <Section id="skills" aria-labelledby="skills-heading">
    <Reveal>
      <SectionHeading
        id="skills-heading"
        index={1}
        label="Skills"
        title="The stack I build and run on"
        lead="I work across software engineering, data engineering, cloud and system integration, with Python at the core. That means full-stack apps in React, Angular and .NET, real-time pipelines with Spark and Kafka on Azure Databricks, and agentic AI with spec-driven development in my daily workflow."
      />
    </Reveal>

    <Reveal delay={0.05}>
      <FlowRail />
    </Reveal>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category, i) => (
        <Reveal key={category.id} delay={i * 0.06} className={`h-full ${LAYOUT[category.id] ?? ''}`}>
          {category.featured ? <HeroPanel category={category} /> : <Panel category={category} />}
        </Reveal>
      ))}
    </div>
  </Section>
);

export default Skills;
