import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Share2 } from 'lucide-react';
import { EASE_OUT, MagneticButton, useReducedMotion } from './ui';
import SEO from './SEO';
import PostBody from './blog/PostBody';
import PostCover from './blog/PostCover';
import PostMeta from './blog/PostMeta';
import { neighbours, posts } from './blog/posts';
import type { Post } from './blog/posts';
import { copyText } from '../utils/clipboard';
import profile from '../data/profile.json';

/** Small 160x200 crop; shown at 40px, so this covers up to 4x screens. */
const AVATAR_SRC = `${import.meta.env.BASE_URL}images/cecil-portrait-160.webp`;

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

const NeighbourLink: React.FC<{ post: Post; direction: 'older' | 'newer' }> = ({
  post,
  direction,
}) => {
  const newer = direction === 'newer';
  return (
    <Link
      to={`/blog/${post.slug}`}
      rel={newer ? 'next' : 'prev'}
      className={`group flex h-full flex-col gap-3 rounded-2xl border border-line bg-surface p-5 text-fg transition-colors duration-200 hover:border-muted/60 hover:bg-surface-2 hover:text-fg sm:p-6 ${
        newer ? 'sm:items-end sm:text-right' : ''
      }`}
    >
      <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted group-hover:text-accent-ink">
        {!newer && (
          <ArrowLeft
            size={14}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />
        )}
        {newer ? 'Newer' : 'Older'}
        {newer && (
          <ArrowRight
            size={14}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        )}
      </span>
      <span className="font-display text-lg font-semibold leading-snug tracking-[-0.02em] text-pretty">
        {post.title}
      </span>
    </Link>
  );
};

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const reduced = useReducedMotion();
  const [shareSuccess, setShareSuccess] = useState(false);

  const blog = posts.find((post) => post.slug === slug);
  const { older, newer } = neighbours(slug ?? '');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (blog) document.title = `${blog.title} | Cecil Sithole`;
    return () => {
      document.title = "Cecil's Portfolio";
    };
  }, [blog]);

  useEffect(() => {
    if (!shareSuccess) return;
    const t = window.setTimeout(() => setShareSuccess(false), 2000);
    return () => window.clearTimeout(t);
  }, [shareSuccess]);

  const shareBlog = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: blog?.title, text: blog?.excerpt, url });
      } catch {
        // The user dismissed the share sheet; nothing to do.
      }
      return;
    }
    if (await copyText(url)) setShareSuccess(true);
  };

  if (!blog) {
    return (
      <main className="grid min-h-svh place-items-center px-5 pt-16">
        <div className="max-w-md text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-ink">404</p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-display text-fg">
            Article not found
          </h1>
          <p className="mt-4 text-muted">
            The article you're looking for doesn't exist or has moved.
          </p>
          <div className="mt-8">
            <MagneticButton href="#/blog" variant="secondary">
              <ArrowLeft size={16} aria-hidden="true" />
              All writing
            </MagneticButton>
          </div>
        </div>
      </main>
    );
  }

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0.15 : 0.6, delay: reduced ? 0 : delay, ease: EASE_OUT },
  });

  return (
    <main className="min-h-svh pt-16">
      <SEO
        title={`${blog.title} | Cecil Sithole`}
        description={blog.excerpt}
        image={blog.image}
        url={window.location.href}
        type="article"
        author={blog.author}
        publishedTime={blog.date}
      />

      <article>
        {/* Header */}
        <motion.header
          {...enter(0)}
          className="mx-auto w-full max-w-3xl px-5 pt-12 sm:px-8 md:pt-20"
        >
          <Link
            to="/blog"
            className="-my-3 inline-flex min-h-11 items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted hover:text-fg"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            All writing
          </Link>

          <p className="mt-10 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent-ink">
            {blog.category}
          </p>
          <h1 className="mt-4 font-display text-[clamp(2.25rem,5.5vw,3.75rem)] font-semibold leading-[1.04] tracking-display text-fg text-balance">
            {blog.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted text-pretty sm:text-xl">
            {blog.excerpt}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
            <div className="flex items-center gap-3">
              <img
                src={AVATAR_SRC}
                alt=""
                width={160}
                height={200}
                decoding="async"
                className="h-10 w-10 rounded-full border border-line object-cover object-[50%_18%]"
              />
              <div>
                <p className="text-sm font-medium text-fg">
                  {blog.author.startsWith('Cecil') ? profile.name : blog.author}
                </p>
                <PostMeta post={blog} month="long" className="mt-1 text-[0.68rem]" />
              </div>
            </div>
            <button
              type="button"
              onClick={shareBlog}
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm text-fg hover:border-muted hover:bg-surface-2"
            >
              {shareSuccess ? (
                <Check size={16} aria-hidden="true" className="text-accent-ink" />
              ) : (
                <Share2 size={16} aria-hidden="true" />
              )}
              <span aria-live="polite">{shareSuccess ? 'Link copied' : 'Share'}</span>
            </button>
          </div>
        </motion.header>

        {/* Cover */}
        <motion.figure {...enter(0.08)} className="mx-auto mt-10 w-full max-w-5xl px-5 sm:px-8">
          <PostCover
            post={blog}
            width={1600}
            height={800}
            priority
            sizes="(min-width: 1024px) 960px, (min-width: 640px) calc(100vw - 4rem), calc(100vw - 2.5rem)"
            className="aspect-[2/1] rounded-2xl border border-line"
          />
        </motion.figure>

        {/* Body */}
        <motion.div {...enter(0.14)} className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 md:py-16">
          <div className="mx-auto max-w-prose">
            {blog.content ? (
              <PostBody markdown={blog.content} />
            ) : (
              <p className="text-muted">This article has no content yet.</p>
            )}

            {blog.references && blog.references.length > 0 && (
              <section aria-labelledby="references-heading" className="mt-16 border-t border-line pt-10">
                <h2
                  id="references-heading"
                  className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted"
                >
                  References and further reading
                </h2>
                <ol className="mt-6 divide-y divide-line">
                  {blog.references.map((ref) => (
                    <li key={ref.url}>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-4 py-4 text-fg hover:text-fg"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium group-hover:text-accent-ink">
                            {ref.title}
                            <span className="sr-only"> (opens in a new tab)</span>
                          </span>
                          {ref.description && (
                            <span className="mt-1 block text-sm text-muted">{ref.description}</span>
                          )}
                        </span>
                        <span className="hidden shrink-0 pt-1 font-mono text-xs text-muted sm:block">
                          {hostOf(ref.url)}
                        </span>
                        <ArrowUpRight
                          size={16}
                          aria-hidden="true"
                          className="mt-1 shrink-0 text-muted transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-ink"
                        />
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>
        </motion.div>
      </article>

      {/* Older / newer */}
      {(older || newer) && (
        <nav
          aria-label="More writing"
          className="mx-auto w-full max-w-3xl px-5 pb-24 sm:px-8 md:pb-32"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>{older && <NeighbourLink post={older} direction="older" />}</div>
            <div>{newer && <NeighbourLink post={newer} direction="newer" />}</div>
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/blog"
              className="inline-flex min-h-11 items-center gap-2 px-3 font-mono text-xs uppercase tracking-[0.16em] text-muted hover:text-fg"
            >
              All writing
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </nav>
      )}
    </main>
  );
};

export default BlogPost;
