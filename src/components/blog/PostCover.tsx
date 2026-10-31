import React from 'react';
import type { Post } from './posts';
import { photoSrc } from './posts';

interface PostCoverProps {
  post: Post;
  /** Intrinsic size requested from the image CDN and set on the <img>. */
  width: number;
  height: number;
  /** The post page cover is above the fold, so it loads eagerly. */
  priority?: boolean;
  /** Rendered width hint for the srcset, e.g. "(min-width: 1024px) 620px, 100vw". */
  sizes?: string;
  className?: string;
}

/** Candidate widths for the srcset; small enough for a 360px phone at 1x. */
const SRCSET_WIDTHS = [480, 800, 1200, 1600];

/**
 * A post's cover. Unsplash photos are resized and toned down to sit calmly on the
 * surface; anything else (logos, missing images) gets a quiet token-based pattern.
 * The wrapper sets the aspect ratio via `className`.
 */
const PostCover: React.FC<PostCoverProps> = ({
  post,
  width,
  height,
  priority = false,
  sizes = '100vw',
  className = '',
}) => {
  const src = photoSrc(post.image, width, height);
  // Same crop at each width (height follows the aspect ratio), never wider than requested.
  const srcSet = src
    ? SRCSET_WIDTHS.filter((w) => w <= width)
        .map((w) => `${photoSrc(post.image, w, Math.round((w * height) / width))} ${w}w`)
        .join(', ')
    : undefined;

  return (
    <div className={`relative overflow-hidden bg-surface-2 ${className}`}>
      {src ? (
        <>
          <img
            src={src}
            srcSet={srcSet}
            sizes={sizes}
            alt=""
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            className="absolute inset-0 h-full w-full object-cover grayscale contrast-110"
          />
          {/* A teal-to-blue duotone keeps every photo on palette, then a fade into the surface. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-br from-accent/45 to-accent-2/45 mix-blend-color"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-surface via-surface/20 to-transparent"
          />
        </>
      ) : (
        <span aria-hidden="true" className="absolute inset-0">
          <span className="absolute inset-0 bg-[radial-gradient(var(--color-line)_1px,transparent_1px)] bg-size-[16px_16px]" />
          <span className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_85%_10%,color-mix(in_oklab,var(--color-accent)_18%,transparent),transparent_70%)]" />
          <span className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_10%_100%,color-mix(in_oklab,var(--color-accent-2)_14%,transparent),transparent_70%)]" />
          <span className="absolute inset-x-0 top-1/2 h-px bg-linear-to-r from-transparent via-line to-transparent" />
          <span className="absolute right-6 bottom-5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">
            {post.category}
          </span>
        </span>
      )}
    </div>
  );
};

export default PostCover;
