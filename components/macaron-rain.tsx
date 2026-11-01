"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function WelcomeMacarons() {
  const path = usePathname();
  const landingEntry = useRef(path === "/");
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (
      !landingEntry.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    setActive(true);
    const timer = setTimeout(() => setActive(false), 3600);
    return () => clearTimeout(timer);
  }, []);
  return active ? <MacaronRain /> : null;
}

const shades = [
  ["#dca0ba", "#f5c9dd"],
  ["#aebe9b", "#dae5c7"],
  ["#c3a4d4", "#e5d0ef"],
  ["#deb477", "#f4d4a3"],
];

export default function MacaronRain() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div className="macaron-rain" aria-hidden="true">
      {Array.from({ length: 30 }, (_, i) => {
        const color = shades[i % shades.length];
        return (
          <motion.div
            className="rain-macaron"
            key={i}
            style={{
              left: `${(i * 43 + 7) % 100}%`,
              width: 22 + ((i * 7) % 18),
            }}
            initial={{
              y: "-12vh",
              x: 0,
              rotate: ((i * 31) % 100) - 50,
              opacity: 0,
            }}
            animate={{
              y: "110vh",
              x: [0, i % 2 ? 24 : -24, 0],
              rotate: (i % 2 ? 1 : -1) * (180 + i * 8),
              opacity: [0, 0.9, 0.9, 0],
            }}
            transition={{
              duration: 2.4 + (i % 4) * 0.14,
              delay: (i % 7) * 0.1,
              ease: "linear",
            }}
          >
            <svg viewBox="0 0 70 45">
              <ellipse cx="35" cy="29" rx="30" ry="12" fill={color[0]} />
              <path d="M5 22Q7 3 35 3Q63 3 65 22Z" fill={color[1]} />
              <path d="M5 22Q35 28 65 22V28Q35 35 5 28Z" fill="#fff1dd" />
              <path
                d="M9 20Q34 25 61 20"
                fill="none"
                stroke={color[0]}
                strokeWidth="2"
              />
              <path
                d="M16 14Q30 5 45 9"
                fill="none"
                stroke="#fff"
                strokeOpacity=".35"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
}
