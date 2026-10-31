import React, { isValidElement, useEffect, useRef, useState } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components, ExtraProps } from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { Check, Copy } from 'lucide-react';
import { copyText } from '../../utils/clipboard';

/**
 * Posts have unlabelled code fences, so highlight.js auto-detects. Limiting detection
 * to languages these posts actually use keeps the guesses sensible.
 */
const DETECT_SUBSET = ['python', 'bash', 'javascript', 'typescript', 'json', 'yaml', 'sql', 'xml', 'css'];

const LANGUAGE_NAMES: Record<string, string> = {
  python: 'Python',
  bash: 'Bash',
  shell: 'Shell',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  json: 'JSON',
  yaml: 'YAML',
  sql: 'SQL',
  xml: 'HTML',
  css: 'CSS',
};

/** react-markdown passes its hast `node` to every component; keep it off the DOM. */
function withoutNode<P extends ExtraProps>(props: P): Omit<P, 'node'> {
  const rest = { ...props };
  delete rest.node;
  return rest;
}

/** Reads the `language-x` class rehype-highlight puts on the <code> child. */
const languageOf = (children: ReactNode): string | null => {
  if (!isValidElement(children)) return null;
  const className = (children.props as { className?: string }).className ?? '';
  const match = /language-([\w-]+)/.exec(className);
  return match ? (LANGUAGE_NAMES[match[1]] ?? match[1]) : null;
};

const CodeBlock: React.FC<ComponentPropsWithoutRef<'pre'> & ExtraProps> = (props) => {
  const { children, className = '', ...rest } = withoutNode(props);
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const language = languageOf(children);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    const text = ref.current?.textContent ?? '';
    if (await copyText(text.replace(/\n$/, ''))) setCopied(true);
  };

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex h-12 items-center justify-between border-b border-line pr-0.5 pl-4">
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted">
          {language ?? 'Code'}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-11 min-w-11 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 font-mono text-xs text-muted hover:bg-surface-2 hover:text-fg"
        >
          {copied ? (
            <Check size={14} aria-hidden="true" className="text-accent-ink" />
          ) : (
            <Copy size={14} aria-hidden="true" />
          )}
          <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
          {!copied && <span className="sr-only"> code</span>}
        </button>
      </div>
      <pre
        ref={ref}
        className={`overflow-x-auto p-4 font-mono text-[0.8125rem] leading-[1.7] sm:p-5 ${className}`}
        {...rest}
      >
        {children}
      </pre>
    </div>
  );
};

const isExternal = (href?: string) => Boolean(href && /^https?:\/\//.test(href));

const components: Components = {
  // The post title is the page h1, so markdown headings shift down one level.
  h1: (props) => (
    <h2
      className="mt-14 mb-5 scroll-mt-24 font-display text-[1.75rem] font-semibold leading-tight tracking-display text-fg text-balance sm:text-3xl"
      {...withoutNode(props)}
    />
  ),
  h2: (props) => (
    <h3
      className="mt-10 mb-4 scroll-mt-24 font-display text-xl font-semibold leading-snug tracking-[-0.02em] text-fg sm:text-[1.375rem]"
      {...withoutNode(props)}
    />
  ),
  h3: (props) => (
    <h4
      className="mt-8 mb-3 font-display text-lg font-semibold leading-snug tracking-[-0.01em] text-fg"
      {...withoutNode(props)}
    />
  ),
  h4: (props) => (
    <h5
      className="mt-8 mb-3 font-mono text-xs font-medium uppercase tracking-[0.16em] text-fg"
      {...withoutNode(props)}
    />
  ),
  p: (props) => <p className="my-5" {...withoutNode(props)} />,
  a: (props) => {
    const { href, ...rest } = withoutNode(props);
    return (
      <a
        href={href}
        className="font-medium text-accent-ink underline decoration-accent/40 decoration-1 underline-offset-4 hover:text-fg hover:decoration-accent"
        {...(isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      />
    );
  },
  ul: (props) => (
    <ul className="my-5 list-disc space-y-2 pl-6 marker:text-accent" {...withoutNode(props)} />
  ),
  ol: (props) => (
    <ol
      className="my-5 list-decimal space-y-2 pl-6 marker:font-mono marker:text-sm marker:text-muted"
      {...withoutNode(props)}
    />
  ),
  li: (props) => <li className="pl-1.5" {...withoutNode(props)} />,
  strong: (props) => <strong className="font-semibold text-fg" {...withoutNode(props)} />,
  blockquote: (props) => (
    <blockquote
      className="my-8 border-l-2 border-accent pl-5 font-display text-lg leading-relaxed text-fg [&>p]:my-2"
      {...withoutNode(props)}
    />
  ),
  hr: (props) => <hr className="my-12 border-line" {...withoutNode(props)} />,
  img: (props) => {
    const { alt, ...rest } = withoutNode(props);
    return (
      <img
        alt={alt ?? ''}
        loading="lazy"
        decoding="async"
        className="my-8 w-full rounded-xl border border-line"
        {...rest}
      />
    );
  },
  pre: CodeBlock,
  table: (props) => (
    <div className="my-8 overflow-x-auto rounded-xl border border-line">
      <table className="w-full border-collapse text-left text-sm" {...withoutNode(props)} />
    </div>
  ),
  thead: (props) => <thead className="bg-surface-2" {...withoutNode(props)} />,
  th: (props) => (
    <th
      className="px-4 py-3 font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted"
      {...withoutNode(props)}
    />
  ),
  td: (props) => <td className="border-t border-line px-4 py-3 align-top" {...withoutNode(props)} />,
};

/**
 * Renders a post's markdown with token-based typography.
 * Inline code and the highlight.js colours live in index.css (`.post-body`).
 */
const PostBody: React.FC<{ markdown: string }> = ({ markdown }) => (
  <div className="post-body text-[1.0625rem] leading-[1.8] text-fg/85">
    <ReactMarkdown
      rehypePlugins={[[rehypeHighlight, { detect: true, subset: DETECT_SUBSET }]]}
      components={components}
    >
      {markdown}
    </ReactMarkdown>
  </div>
);

export default PostBody;
