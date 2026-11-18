"use client";

import { Calculator } from "lucide-react";
import { useEffect, useState } from "react";

export function FloatingSimulationButton() {
  const [heroVisible, setHeroVisible] = useState(true);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;

    const heroObserver = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0.05 });
    heroObserver.observe(hero);

    return () => {
      heroObserver.disconnect();
    };
  }, []);

  const visible = !heroVisible;

  return (
    <a className={`lgap-floating-simulation${visible ? " is-visible" : ""}`} href="#simulation" aria-hidden={!visible} tabIndex={visible ? 0 : -1}>
      <Calculator aria-hidden="true" />
      <span>導入効果を試算してみる</span>
    </a>
  );
}
