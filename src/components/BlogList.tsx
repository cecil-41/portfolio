import React, { useEffect, useId, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Search, X } from 'lucide-react';
import { EASE_OUT, Reveal, SectionHeading, useReducedMotion } from './ui';
import SEO from './SEO';
import PostMeta from './blog/PostMeta';
import { categories, formatDate, posts } from './blog/posts';

const ALL = 'all';

const BlogList: React.FC = () => {
  const reduced = useReducedMotion();
  const searchId = useId();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(ALL);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredPosts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesSearch =
        !term ||
        post.title.toLowerCase().includes(term) ||
        post.excerpt.toLowerCase().includes(term);
      const matchesCategory = selectedCategory === ALL || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const filtering = searchTerm.trim() !== '' || selectedCategory !== ALL;
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(ALL);
  };

  const filterOptions = [{ name: ALL, count: posts.length }, ...categories];

  return (
    <main className="min-h-screen pt-16">
      <SEO
        title="Writing | Cecil Sithole"
        description="Articles by Cecil Sithole, a software engineer, on software engineering, data, cloud and AI."
      />

      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-24">
        <Reveal>
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted hover:text-fg"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Home
          </Link>
          <SectionHeading
            level={1}
            index={5}
            label="Writing"
            title="All writing"
            lead={`${posts.length} articles on software engineering, data, cloud and building with AI.`}
          />
        </Reveal>

        {/* Search and category filter */}
        <Reveal delay={0.05}>
          <div
            role="search"
            className="flex flex-col gap-4 border-y border-line py-5 md:flex-row md:items-center md:justify-between"
          >
            <div className="relative w-full md:max-w-sm">
              <label htmlFor={searchId} className="sr-only">
                Search articles
              </label>
              <Search
                size={16}
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
              />
              <input
                id={searchId}
                type="search"
                placeholder="Search articles"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 w-full rounded-full border border-line bg-surface pr-4 pl-11 text-sm text-fg placeholder:text-muted transition-colors hover:border-muted/60 focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-search-cancel-button]:hidden"
              />
            </div>

            <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
              {filterOptions.map(({ name, count }) => {
                const active = selectedCategory === name;
                return (
                  <button
                    key={name}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelectedCategory(name)}
                    className={`inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border px-3.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] ${
                      active
                        ? 'border-accent/60 bg-accent/10 text-fg'
                        : 'border-line bg-surface text-muted hover:border-muted/60 hover:text-fg'
                    }`}
                  >
                    {name === ALL ? 'All' : name}
                    <span className={`tabular-nums ${active ? 'text-accent-ink' : ''}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        <div className="mt-4 flex min-h-8 items-center justify-between gap-4">
          <p aria-live="polite" className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
            {filtering
              ? `${filteredPosts.length} of ${posts.length} ${posts.length === 1 ? 'article' : 'articles'}`
              : `${posts.length} articles, newest first`}
          </p>
          {filtering && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 font-mono text-xs uppercase tracking-[0.14em] text-muted hover:bg-surface-2 hover:text-fg"
            >
              <X size={13} aria-hidden="true" />
              Clear
            </button>
          )}
        </div>

        {/* Index */}
        {filteredPosts.length > 0 ? (
          <ol className="mt-6">
            <AnimatePresence initial={false}>
              {filteredPosts.map((post) => (
                <motion.li
                  key={post.id}
                  layout={!reduced}
                  initial={{ opacity: 0, y: reduced ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0.15 : 0.35, ease: EASE_OUT }}
                  className="border-b border-line first:border-t"
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group -mx-3 grid gap-x-8 gap-y-3 rounded-xl px-3 py-7 text-fg transition-colors duration-200 hover:bg-surface hover:text-fg sm:-mx-5 sm:px-5 md:grid-cols-[9rem_1fr_auto] md:items-baseline"
                  >
                    {/* Date column on desktop; the meta line below carries it on mobile. */}
                    <time
                      dateTime={post.date}
                      className="hidden font-mono text-xs uppercase tracking-[0.12em] tabular-nums text-muted md:block"
                    >
                      {formatDate(post.date)}
                    </time>
                    <div className="min-w-0">
                      <PostMeta post={post} withCategory className="mb-3 md:hidden" />
                      <h2 className="font-display text-xl font-semibold leading-snug tracking-[-0.02em] text-pretty sm:text-2xl">
                        {post.title}
                      </h2>
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted text-pretty sm:text-base">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="hidden items-center gap-4 md:flex">
                      <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-accent-ink">
                        {post.category}
                      </span>
                      <span className="font-mono text-xs tabular-nums text-muted">
                        {post.readTime} min
                      </span>
                      <ArrowUpRight
                        size={18}
                        aria-hidden="true"
                        className="text-muted transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-ink"
                      />
                    </div>
                  </Link>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-line px-6 py-16 text-center">
            <p className="font-display text-xl tracking-[-0.02em] text-fg">No articles match.</p>
            <p className="mt-2 text-sm text-muted">Try a different search term or category.</p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 inline-flex h-10 cursor-pointer items-center rounded-full border border-line bg-surface px-4 text-sm text-fg hover:border-muted hover:bg-surface-2"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default BlogList;
