"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function BakingMark() {
  const reduce = useReducedMotion();
  const spring = { type: "spring" as const, stiffness: 85, damping: 16 };
  return (
    <div className="animated-logo baking-mark" aria-hidden="true">
      <motion.svg viewBox="0 0 360 300" initial={false}>
        <motion.g
          initial={reduce ? false : { opacity: 0, scale: 0.7, rotate: -18 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ ...spring, delay: 0.1 }}
          style={{ transformOrigin: "180px 200px" }}
        >
          <ellipse
            cx="180"
            cy="207"
            rx="133"
            ry="46"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            transform="rotate(-12 180 207)"
          />
          <motion.ellipse
            cx="180"
            cy="207"
            rx="108"
            ry="30"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity=".55"
            transform="rotate(-12 180 207)"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9 }}
          />
        </motion.g>
        <motion.g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          initial={reduce ? false : { x: -32, y: 75, rotate: -25, opacity: 0 }}
          animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          transition={{ ...spring, delay: 0.5 }}
          style={{ transformOrigin: "165px 170px" }}
        >
          <path d="M106 217L239 99" strokeWidth="9" />
          <path
            d="M232 105Q246 119 259 105L294 64M232 105Q219 93 230 81L263 48M240 94L277 55M250 102L286 62"
            strokeWidth="5"
          />
        </motion.g>
        <motion.g
          fill="currentColor"
          initial={reduce ? false : { x: 34, y: 70, rotate: 28, opacity: 0 }}
          animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          transition={{ ...spring, delay: 0.75 }}
          style={{ transformOrigin: "193px 170px" }}
        >
          <path d="M154 227Q143 231 144 221L220 95Q227 83 233 87Q239 91 232 102L162 220Q158 226 154 227Z" />
          <ellipse
            cx="243"
            cy="67"
            rx="20"
            ry="38"
            transform="rotate(30 243 67)"
          />
        </motion.g>
        <motion.path
          d="M80 62L83 72L93 75L83 78L80 88L77 78L67 75L77 72Z"
          fill="currentColor"
          initial={reduce ? false : { opacity: 0, scale: 0 }}
          animate={{ opacity: 0.65, scale: 1 }}
          transition={{ delay: 1.3, duration: 0.45 }}
          style={{ transformOrigin: "80px 75px" }}
        />
      </motion.svg>
    </div>
  );
}
