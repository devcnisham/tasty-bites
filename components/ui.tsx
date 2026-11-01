"use client";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
export function Reveal({
  children,
  className = "",
  delay = 0,
  layout = false,
  interactive = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  layout?: boolean;
  interactive?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      layout={layout}
      whileHover={interactive && !reduce ? { y: -6 } : undefined}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.22, 1, 0.36, 1],
        layout: { duration: 0.45, delay: 0 },
      }}
    >
      {children}
    </motion.div>
  );
}
export function Modal({
  title,
  close,
  children,
  className = "",
}: {
  title: string;
  close: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prior = document.activeElement as HTMLElement;
    const body = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const els = ref.current?.querySelectorAll<HTMLElement>(
          'button,input,select,textarea,a[href],[tabindex="0"]',
        );
        if (!els?.length) return;
        const first = els[0],
          last = els[els.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = body;
      document.removeEventListener("keydown", onKey);
      prior?.focus();
    };
  }, [close]);
  return (
    <div
      className="overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`modal ${className}`}
      >
        <div className="row between">
          <h2>{title}</h2>
          <button
            className="icon-btn"
            aria-label="Close dialog"
            onClick={close}
          >
            <X />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}
export function Heading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="page-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}
export function Bake({
  kind = "cake",
  className = "",
}: {
  kind?: string;
  className?: string;
}) {
  return (
    <svg
      className={`bake-art ${className}`}
      viewBox="0 0 500 420"
      role="img"
      aria-label={`${kind} illustration`}
    >
      <defs>
        <linearGradient id={`icing-${kind}`} x2="0" y2="1">
          <stop stopColor="#f7bdc1" />
          <stop offset="1" stopColor="#d87987" />
        </linearGradient>
        <linearGradient id={`dough-${kind}`} x2=".3" y2="1">
          <stop stopColor="#f3c87d" />
          <stop offset="1" stopColor="#a65e32" />
        </linearGradient>
      </defs>
      <ellipse
        cx="250"
        cy="356"
        rx="163"
        ry="23"
        fill="#5d3529"
        opacity=".12"
      />
      {kind === "cake" ? (
        <>
          <ellipse cx="250" cy="341" rx="174" ry="24" fill="#fff8ee" />
          <path
            d="M110 190Q250 146 390 190V306Q250 371 110 306Z"
            fill="#ba7955"
          />
          <path
            d="M110 211Q250 263 390 211V242Q250 292 110 242Z"
            fill="#ffe9c5"
          />
          <path
            d="M110 276Q250 325 390 276V300Q250 350 110 300Z"
            fill="#f9c4c1"
          />
          <ellipse cx="250" cy="187" rx="140" ry="48" fill="#fbe8dc" />
          <path
            d="M110 185C130 209 145 203 160 220S179 255 191 223S215 219 230 225S250 249 264 224S292 218 311 224S330 244 346 220S378 214 390 187Q250 135 110 185"
            fill={`url(#icing-${kind})`}
          />
          {[170, 220, 270, 320].map((x, i) => (
            <g key={x} transform={`translate(${x} ${149 + (i % 2) * 8})`}>
              <path
                d="M-15 8Q-20-16 0-24Q20-13 14 7Q0 20-15 8"
                fill="#b53749"
              />
              <path d="M-10-16L0-27L10-16L0-18Z" fill="#547550" />
              <path
                d="M-6-5L-3-1M5-9L7-5M0 7L3 10"
                stroke="#fbe0a8"
                strokeWidth="2"
              />
            </g>
          ))}
          <path d="M241 147V85" stroke="#f5cf7c" strokeWidth="9" />
          <path d="M241 81Q223 66 241 45Q258 66 241 81" fill="#e7a151" />
        </>
      ) : kind === "cookie" ? (
        <>
          <circle
            cx="250"
            cy="220"
            r="132"
            fill={`url(#dough-${kind})`}
            stroke="#c98e51"
            strokeWidth="6"
          />
          {[
            [180, 150],
            [270, 120],
            [320, 185],
            [210, 240],
            [300, 280],
            [160, 270],
            [260, 200],
            [240, 320],
          ].map(([x, y], i) => (
            <path
              key={i}
              d={`M${x} ${y}l15 -5l9 16l-15 12l-14 -9z`}
              fill="#56362e"
            />
          ))}
          <circle cx="200" cy="180" r="5" fill="#e5b56f" />
        </>
      ) : kind === "macaron" ? (
        <>
          {[
            [172, 253, "#b5c396"],
            [293, 281, "#dca0ac"],
            [246, 167, "#e6bd7c"],
          ].map(([x, y, c], i) => (
            <g
              key={i}
              transform={`translate(${x} ${y}) rotate(${i === 2 ? -17 : 12})`}
            >
              <ellipse cy="10" rx="87" ry="42" fill={String(c)} />
              <rect
                x="-84"
                y="-1"
                width="168"
                height="17"
                rx="8"
                fill="#fff3df"
              />
              <path d="M-86-5Q-85-72 0-72Q85-72 86-5Z" fill={String(c)} />
              <path
                d="M-75-10Q0-33 75-10"
                fill="none"
                stroke="#fff"
                opacity=".25"
                strokeWidth="5"
              />
            </g>
          ))}
        </>
      ) : kind === "bread" ? (
        <>
          <path
            d="M87 300Q70 155 170 135Q290 73 389 202L406 303Q251 364 87 300"
            fill={`url(#dough-${kind})`}
          />
          {[165, 225, 285].map((x) => (
            <path
              key={x}
              d={`M${x} 170q-25 48-12 88`}
              stroke="#f7dea8"
              strokeWidth="13"
              fill="none"
              strokeLinecap="round"
            />
          ))}
        </>
      ) : (
        <>
          <path d="M154 242H350L326 344Q249 367 177 344Z" fill="#b88867" />
          {[190, 220, 250, 280, 310].map((x) => (
            <path
              key={x}
              d={`M${x} 252l5 86`}
              stroke="#dfb597"
              strokeWidth="6"
            />
          ))}
          <path
            d="M146 242Q118 203 175 185Q134 143 211 127Q187 91 254 73Q255 111 291 124Q349 143 319 179Q385 199 351 242Z"
            fill={`url(#icing-${kind})`}
          />
          <circle cx="255" cy="65" r="20" fill="#b93649" />
          <path
            d="M257 49q-1-29 24-36"
            fill="none"
            stroke="#66764a"
            strokeWidth="5"
          />
        </>
      )}
      <path
        d="M85 99l9 15M405 126l-14 9M394 331l12 7M100 316l-13 6"
        stroke="#b67c52"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
export function Arrow() {
  return <ArrowUpRight size={18} />;
}
