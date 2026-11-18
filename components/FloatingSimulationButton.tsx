"use client";

import { Calculator } from "lucide-react";
import { useEffect, useState } from "react";

export function FloatingSimulationButton() {
  const [heroVisible, setHeroVisible] = useState(true);
  const [simulationVisible, setSimulationVisible] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const observe = (id: string, update: (visible: boolean) => void) => {
      const element = document.getElementById(id);
      if (!element) return null;
      const observer = new IntersectionObserver(([entry]) => update(entry.isIntersecting), { threshold: 0.05 });
      observer.observe(element);
      return observer;
    };

    const heroObserver = observe("top", setHeroVisible);
    const simulationObserver = observe("simulation", setSimulationVisible);
    const contactObserver = observe("contact", setContactVisible);

    return () => {
      heroObserver?.disconnect();
      simulationObserver?.disconnect();
      contactObserver?.disconnect();
    };
  }, []);

  const visible = !heroVisible && !simulationVisible && !contactVisible;

  return (
    <a className={`lgap-floating-simulation${visible ? " is-visible" : ""}`} href="#simulation" aria-hidden={!visible} tabIndex={visible ? 0 : -1}>
      <Calculator aria-hidden="true" />
      <span>導入効果を試算してみる</span>
    </a>
  );
}
