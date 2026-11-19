"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "up" | "grow";
};

export function ScrollReveal({ children, className, delay = 0, variant = "up" }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    setIsReady(true);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setIsVisible(true);
      observer.unobserve(entry.target);
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const style = { "--lgap-reveal-delay": `${delay}ms` } as CSSProperties & Record<"--lgap-reveal-delay", string>;
  const classes = ["lgap-reveal", `lgap-reveal-${variant}`, isReady ? "is-ready" : "", isVisible ? "is-visible" : "", className].filter(Boolean).join(" ");

  return <div ref={ref} className={classes} style={style}>{children}</div>;
}
