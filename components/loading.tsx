"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useStore } from "./store";
import BakingMark from "./baking-mark";
import { X } from "lucide-react";

let introPlayed = false;
export function StartupLoader() {
  const { ready } = useStore();
  const path = usePathname();
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(false);
    if (!ready || path !== "/" || reduce === null) return;
    let seen = introPlayed;
    try {
      seen = seen || sessionStorage.getItem("tb_intro_seen_v3") === "1";
    } catch {}
    if (seen || reduce) return;
    introPlayed = true;
    try {
      sessionStorage.setItem("tb_intro_seen_v3", "1");
    } catch {}
    setShow(true);
    const timer = setTimeout(() => setShow(false), 2850);
    return () => clearTimeout(timer);
  }, [ready, reduce, path]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="startup-loader"
          role="status"
          aria-label="Preparing Tasty Bite Baking Studio"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: reduce ? 0 : -12 }}
          transition={{ duration: reduce ? 0 : 0.35 }}
        >
          <div className="startup-inner">
            <div className="startup-mark">
              <BakingMark />
            </div>
          </div>
          <button
            className="startup-close"
            aria-label="Skip logo introduction"
            onClick={() => setShow(false)}
          >
            <X size={20} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CourseSkeletons() {
  return (
    <div className="course-grid loading-grid" aria-hidden="true">
      {[0, 1, 2].map((n) => (
        <div className="skeleton-card" key={n}>
          <div className="skeleton skeleton-image" />
          <div className="skeleton-copy">
            <div className="skeleton skeleton-line short" />
            <div className="skeleton skeleton-line title" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line medium" />
            <div className="skeleton skeleton-button" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div role="status" aria-label="Loading your courses" aria-busy="true">
      <div className="three-grid loading-stats" aria-hidden="true">
        {[0, 1, 2].map((n) => (
          <div className="skeleton skeleton-stat" key={n} />
        ))}
      </div>
      <CourseSkeletons />
      <span className="sr-only">Loading your learning dashboard.</span>
    </div>
  );
}
