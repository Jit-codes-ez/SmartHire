import useScrollReveal from "../hooks/useScrollReveal.js";

/**
 * Wraps any block of content so it fades/rises into view on scroll.
 * Same animation everywhere it's used — the single source of truth
 * for scroll-in motion across every page.
 *
 * Usage:
 *   <Reveal><section>...</section></Reveal>
 *   <Reveal delay={0.1} as="div" className="grid ...">...</Reveal>
 */
export default function Reveal({ children, delay = 0, as: Tag = "div", className = "", style = {} }) {
  const [ref, inView] = useScrollReveal();

  return (
    <Tag
      ref={ref}
      className={`sh-reveal ${inView ? "sh-reveal-visible" : ""} ${className}`}
      style={{ ...style, transitionDelay: inView ? `${delay}s` : "0s" }}
    >
      {children}
    </Tag>
  );
}
