import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { MagneticButton, Reveal, Section, SectionHeading, TiltCard } from './ui';
import PostCover from './blog/PostCover';
import PostMeta from './blog/PostMeta';
import { posts } from './blog/posts';
import type { Post } from './blog/posts';

/** Number of compact rows shown beside the featured post. */
const COMPACT_COUNT = 3;

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * The title link stretches over the whole card (`after:inset-0`), so the card is one
 * click target while the accessible name stays just the title.
 */
const stretchedLink =
  'text-fg hover:text-fg after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent';

const FeaturedPost: React.FC<{ post: Post }> = ({ post }) => (
  <TiltCard
    maxTilt={2.5}
    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors duration-200 hover:border-muted/60"
  >
    <div className="relative">
      <PostCover
        post={post}
        width={1200}
        height={675}
        sizes="(min-width: 1152px) 640px, (min-width: 1024px) 56vw, (min-width: 640px) calc(100vw - 4rem), calc(100vw - 2.5rem)"
        className="aspect-video border-b border-line"
      />
      <span className="absolute top-4 left-4 rounded-full border border-line bg-bg/75 px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-fg backdrop-blur-md">
        Latest
      </span>
    </div>

    <div className="flex flex-1 flex-col p-6 sm:p-8">
      <PostMeta post={post} withCategory />
      <h3 className="mt-5 font-display text-2xl font-semibold leading-[1.12] tracking-display text-balance sm:text-[2.125rem]">
        <Link to={`/blog/${post.slug}`} className={stretchedLink}>
          {post.title}
        </Link>
      </h3>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-muted text-pretty line-clamp-3">
        {post.excerpt}
      </p>
      <span
        aria-hidden="true"
        className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-medium text-accent-ink"
      >
        Read article
        <ArrowRight
          size={16}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </span>
    </div>
  </TiltCard>
);

const CompactPost: React.FC<{ post: Post; index: number }> = ({ post, index }) => (
  <TiltCard
    maxTilt={3}
    className="group flex h-full gap-4 rounded-2xl border border-line bg-surface p-5 transition-colors duration-200 hover:border-muted/60 sm:gap-5 sm:p-6"
  >
    <span aria-hidden="true" className="pt-1 font-mono text-xs tabular-nums text-muted">
      {pad(index)}
    </span>
    <div className="min-w-0 flex-1">
      <PostMeta post={post} withCategory />
      <h3 className="mt-3 font-display text-lg font-semibold leading-snug tracking-[-0.02em] text-pretty sm:text-xl">
        <Link to={`/blog/${post.slug}`} className={stretchedLink}>
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted text-pretty line-clamp-2">
        {post.excerpt}
      </p>
    </div>
    <ArrowUpRight
      size={18}
      aria-hidden="true"
      className="mt-0.5 shrink-0 text-muted transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-ink"
    />
  </TiltCard>
);

const Blog: React.FC = () => {
  const [featured, ...rest] = posts;
  const compact = rest.slice(0, COMPACT_COUNT);

  if (!featured) return null;

  return (
    <Section id="blog" aria-labelledby="blog-heading">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-x-10 gap-y-6 md:mb-16">
        <Reveal>
          <SectionHeading
            id="blog-heading"
            index={5}
            label="Writing"
            title="Notes from the build"
            lead="Field notes on software engineering, data, cloud and building with AI."
            className="mb-0! md:mb-0!"
          />
        </Reveal>
        <Reveal delay={0.05}>
          <MagneticButton href="#/blog" variant="secondary">
            All writing
            <ArrowRight size={16} aria-hidden="true" />
          </MagneticButton>
        </Reveal>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <Reveal className="h-full lg:col-span-7">
          <FeaturedPost post={featured} />
        </Reveal>
        <ol className="grid gap-4 lg:col-span-5 lg:grid-rows-3">
          {compact.map((post, i) => (
            <Reveal as="li" key={post.id} delay={0.06 * (i + 1)} className="h-full">
              <CompactPost post={post} index={i + 2} />
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
};

export default Blog;
