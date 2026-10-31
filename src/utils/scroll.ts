/** Breathing room kept between the fixed nav and the target heading. */
const GAP = 16;

/**
 * Height of the fixed primary nav, measured rather than assumed, so it includes the
 * safe-area inset on notched phones in standalone or landscape mode.
 */
export const navOffset = (): number => {
  const nav = document.querySelector<HTMLElement>('nav[aria-label="Primary"]');
  return (nav?.offsetHeight ?? 64) + GAP;
};

/** Smoothly scrolls so the element's top sits just below the fixed nav. */
export const scrollToElement = (el: Element | null, behavior: ScrollBehavior = 'smooth'): void => {
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - navOffset();
  window.scrollTo({ top, behavior });
};
