import React from 'react';
import type { Post } from './posts';
import { formatDate } from './posts';

interface PostMetaProps {
  post: Post;
  /** Show the category as a small tag before the date. */
  withCategory?: boolean;
  month?: 'short' | 'long';
  className?: string;
}

/** Mono metadata line: optional category tag, date and read time. */
const PostMeta: React.FC<PostMetaProps> = ({
  post,
  withCategory = false,
  month = 'short',
  className = '',
}) => (
  <p
    className={`flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs uppercase tracking-[0.12em] text-muted ${className}`}
  >
    {withCategory && (
      <span className="rounded-full border border-line px-2.5 py-1 text-[0.68rem] tracking-[0.14em] text-accent-ink">
        {post.category}
      </span>
    )}
    {/* Date and read time stay together so a wrap never strands the separator. */}
    <span className="inline-flex items-center gap-x-3 whitespace-nowrap">
      <time dateTime={post.date} className="tabular-nums">
        {formatDate(post.date, month)}
      </time>
      <span aria-hidden="true" className="text-line">
        /
      </span>
      <span className="tabular-nums">{post.readTime} min read</span>
    </span>
  </p>
);

export default PostMeta;
