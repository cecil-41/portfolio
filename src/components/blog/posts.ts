import blogData from '../../data/blogs.json';

export interface Reference {
  title: string;
  url: string;
  description: string;
}

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  /** ISO date, e.g. "2026-03-17". */
  date: string;
  author: string;
  readTime: number;
  category: string;
  image: string;
  slug: string;
  content?: string;
  references?: Reference[];
}

/** All posts, newest first. Copied before sorting so the imported JSON is never mutated. */
export const posts: Post[] = [...(blogData as Post[])].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

/** Categories in the order they first appear (newest post first), with counts. */
export const categories: { name: string; count: number }[] = posts.reduce<
  { name: string; count: number }[]
>((acc, post) => {
  const found = acc.find((c) => c.name === post.category);
  if (found) found.count += 1;
  else acc.push({ name: post.category, count: 1 });
  return acc;
}, []);

/** "17 Mar 2026". Dates are calendar dates, so format in UTC to avoid an off-by-one in other zones. */
export const formatDate = (iso: string, month: 'short' | 'long' = 'short'): string =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month,
    year: 'numeric',
    timeZone: 'UTC',
  });

/**
 * A resized, format-negotiated URL for Unsplash photos, or null for anything else
 * (logos, missing images), in which case the caller renders the token pattern instead.
 */
export const photoSrc = (url: string, width: number, height: number): string | null => {
  try {
    const u = new URL(url);
    if (u.hostname !== 'images.unsplash.com') return null;
    u.searchParams.set('w', String(width));
    u.searchParams.set('h', String(height));
    u.searchParams.set('fit', 'crop');
    u.searchParams.set('auto', 'format');
    u.searchParams.set('q', '70');
    return u.toString();
  } catch {
    return null;
  }
};

/** Older and newer neighbours of a post in date order. */
export const neighbours = (slug: string): { older?: Post; newer?: Post } => {
  const i = posts.findIndex((p) => p.slug === slug);
  if (i === -1) return {};
  return { newer: posts[i - 1], older: posts[i + 1] };
};
