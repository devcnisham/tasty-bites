"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowDown, ArrowUpRight, Heart } from "lucide-react";
import { portfolio } from "@/data/portfolio";

export function HeroTitle() {
  const reduce = useReducedMotion();
  return (
    <h1 className="hero-editorial-title">
      {[
        <>Good things</>,
        <>come to those</>,
        <>
          who <em>bake.</em>
        </>,
      ].map((line, i) => (
        <span className="title-mask" key={i}>
          <motion.span
            initial={reduce ? false : { y: "110%", rotate: 2 }}
            animate={{ y: "0%", rotate: 0 }}
            transition={{
              duration: 0.95,
              delay: 0.1 + i * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
      <svg viewBox="0 0 240 20" aria-hidden="true">
        <motion.path
          d="M4 12Q110-6 235 10M28 18Q125 4 213 17"
          stroke="currentColor"
          fill="none"
          strokeWidth="3"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        />
      </svg>
    </h1>
  );
}

export default function HeroArtwork() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0),
    my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 65, damping: 20 }),
    y = useSpring(my, { stiffness: 65, damping: 20 });
  const rotate = useTransform(x, [-15, 15], [-5, -1]);
  const secondaryX = useTransform(x, (v) => v * -0.8),
    secondaryY = useTransform(y, (v) => v * -0.6);
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      className="hero-visual editorial-art"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left - r.width / 2) / 22);
        my.set((e.clientY - r.top - r.height / 2) / 25);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <div className="editorial-halo" />
      <div className="editorial-orbit" aria-hidden="true" />
      <motion.div
        className="hero-photo-main"
        style={{ x, y, rotate }}
        initial={reduce ? false : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          href="/about#studio-gallery"
          className={`hero-photo-link ${loaded ? "photo-ready" : ""}`}
          aria-label="Explore the baking inspiration gallery"
        >
          <Image
            src={portfolio[0].src}
            alt={portfolio[0].alt}
            fill
            sizes="(max-width:560px) 70vw, (max-width:800px) 35vw, 340px"
            preload
            style={{ objectPosition: portfolio[0].position }}
            onLoad={() => setLoaded(true)}
          />
          <span className="hero-photo-caption">
            A little romance. A little frosting.
            <ArrowUpRight size={17} />
          </span>
        </Link>
        <span className="photo-tape" aria-hidden="true" />
      </motion.div>
      <motion.div
        className="hero-photo-small noir"
        style={{ x: secondaryX, y: secondaryY, rotate: 9 }}
        initial={reduce ? false : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.85, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          href="/about#studio-gallery"
          aria-label="See heart-shaped pink macarons"
        >
          <Image
            src={portfolio[1].src}
            alt={portfolio[1].alt}
            fill
            sizes="(max-width:560px) 110px, 140px"
            style={{ objectPosition: "50% 40%" }}
          />
          <span>the little details ♡</span>
        </Link>
      </motion.div>
      <motion.div
        className="hero-photo-small sweets"
        style={{ x: secondaryX, y: secondaryY, rotate: -11 }}
        initial={reduce ? false : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.85, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          href="/about#studio-gallery"
          aria-label="See pastel patisserie inspiration"
        >
          <Image
            src={portfolio[2].src}
            alt={portfolio[2].alt}
            fill
            sizes="(max-width:560px) 100px, 130px"
          />
          <span>small bakes. big love.</span>
        </Link>
      </motion.div>
      <div className="editorial-note">
        a little flour.
        <br />a little magic.<span>↘</span>
      </div>
      <span className="editorial-heart" aria-hidden="true">
        ♡
      </span>
      <div className="editorial-seal">
        <Heart size={19} />
        <span>
          MADE WITH LOVE
          <br />
          <strong>with a little love</strong>
        </span>
      </div>
      <Link href="#baking-story" className="hero-scroll-link">
        <ArrowDown size={14} />
        Scroll for the sweet part
      </Link>
    </div>
  );
}
