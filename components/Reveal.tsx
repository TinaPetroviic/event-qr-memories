"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealAnimation = "fade-up" | "scale-in" | "slide-in-left" | "slide-in-right";

/**
 * Scroll-triggered entrance wrapper for landing-page sections that live
 * below the fold. The hero above the fold animates on mount via plain
 * `.animate-fade-up` (no IntersectionObserver needed, it's already in
 * view) - this component covers everything a visitor only sees once they
 * scroll to it, so those sections don't just pop in with zero motion.
 *
 * Renders a single div (no extra nesting beyond what the caller already
 * had), stays invisible-but-in-flow until ~15% of it enters the viewport,
 * then plays one of the shared keyframes from globals.css. Fires once -
 * this is an entrance, not a scroll-linked toggle - and falls back to
 * simply visible with no animation if IntersectionObserver isn't
 * available or the visitor prefers reduced motion (handled by the
 * .animate-* classes themselves).
 */
export function Reveal({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  animation?: RevealAnimation;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      // No observer support (very old browser) - just show the content
      // immediately rather than leaving it invisible forever.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} ${visible ? `animate-${animation}` : "opacity-0"}`}
      style={visible ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
