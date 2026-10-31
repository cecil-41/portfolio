import React from 'react';
import { ArrowUp } from 'lucide-react';
import profile from '../data/profile.json';
import { SOCIAL_ICONS } from './socialIcons';
import { useReducedMotion } from './ui';

/** Site footer, shown on every route. */
const Footer: React.FC = () => {
  const reduced = useReducedMotion();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      {/* Bottom padding clears the home indicator on notched phones. */}
      <div className="mx-auto flex w-full max-w-6xl flex-col-reverse gap-6 px-5 pt-8 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-sm text-muted">
          &copy; {year} {profile.name}. All rights reserved.
        </p>

        <div className="flex items-center gap-1">
          <ul className="flex items-center gap-1">
            {profile.socials.map((social) => {
              const Icon = SOCIAL_ICONS[social.id];
              if (!Icon) return null;
              const external = !social.url.startsWith('mailto:');
              return (
                <li key={social.id}>
                  <a
                    href={social.url}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    aria-label={external ? `${social.label} (opens in a new tab)` : social.label}
                    className="grid h-11 w-11 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-fg"
                  >
                    <Icon size={16} aria-hidden={true} />
                  </a>
                </li>
              );
            })}
          </ul>
          <span aria-hidden="true" className="mx-2 h-5 w-px bg-line" />
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })}
            aria-label="Back to top"
            className="inline-flex h-11 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3 font-mono text-xs uppercase tracking-[0.14em] text-muted hover:bg-surface-2 hover:text-fg"
          >
            <span className="sm:hidden">Top</span>
            <span className="hidden sm:inline">Back to top</span>
            <ArrowUp size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
