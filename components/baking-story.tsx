"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Bake } from "./ui";
import BitingCookie from "./biting-cookie";

export default function BakingStory() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: progress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const p = useSpring(progress, {
    stiffness: 95,
    damping: 26,
    restDelta: 0.001,
  });
  const background = useTransform(
    p,
    [0, 0.36, 0.68, 1],
    ["#fcecf2", "#f1c4d8", "#e7d7ed", "#fcecf2"],
  );
  const x = useTransform(p, [0, 0.35, 0.68, 1], ["8%", "-6%", "10%", "0%"]);
  const y = useTransform(p, [0, 0.35, 0.68, 1], ["12%", "-8%", "6%", "-2%"]);
  const rotate = useTransform(p, [0, 0.35, 0.68, 1], [-24, 16, -16, 4]);
  const rotateY = useTransform(p, [0, 0.35, 0.68, 1], [-10, 16, -12, 0]);
  const scale = useTransform(p, [0, 0.35, 0.68, 1], [0.78, 1.06, 0.94, 1]);
  const one = useTransform(p, [0, 0.2, 0.32], [1, 1, 0]);
  const oneY = useTransform(p, [0, 0.2, 0.32], ["0%", "0%", "-20%"]);
  const two = useTransform(p, [0.2, 0.34, 0.52, 0.65], [0, 1, 1, 0]);
  const twoY = useTransform(
    p,
    [0.2, 0.34, 0.52, 0.65],
    ["20%", "0%", "0%", "-20%"],
  );
  const three = useTransform(p, [0.54, 0.7, 1], [0, 1, 1]);
  const threeY = useTransform(p, [0.54, 0.7, 1], ["20%", "0%", "0%"]);
  const cookieX = useTransform(p, [0, 1], ["-40%", "60%"]);
  const cookieRotate = useTransform(p, [0, 1], [-35, 65]);
  const macaronY = useTransform(p, [0, 0.5, 1], ["25%", "-45%", "15%"]);
  if (reduce)
    return (
      <section
        ref={ref}
        className="baking-story-static section"
        id="baking-story"
      >
        <span className="eyebrow">A LITTLE FLOUR. A LITTLE MAGIC.</span>
        <h2>Mix. Make. Celebrate.</h2>
        <p>Little steps. Lovely bakes. A whole new kind of confidence.</p>
        <div className="story-static-art">
          <Image
            src="/images/stock/floating-cookie.png"
            alt="A golden chocolate chip cookie"
            width={2320}
            height={1500}
            sizes="(max-width:560px) 85vw, 450px"
          />
        </div>
        <Link href="/courses" className="btn">
          Find your first bake <ArrowUpRight size={18} />
        </Link>
      </section>
    );
  return (
    <section
      className="baking-story"
      ref={ref}
      id="baking-story"
      aria-label="From your first whisk to your next celebration"
    >
      <motion.div className="story-stage" style={{ background }}>
        <div className="story-copy-stack">
          <motion.div className="story-copy" style={{ opacity: one, y: oneY }}>
            <span className="eyebrow">01 / A LITTLE CURIOSITY</span>
            <h2>
              It starts
              <br />
              with a whisk.
            </h2>
            <p>
              A bowl, a few ingredients, and that lovely feeling of trying
              something new.
            </p>
          </motion.div>
          <motion.div className="story-copy" style={{ opacity: two, y: twoY }}>
            <span className="eyebrow">02 / EVERYDAY MAGIC</span>
            <h2>
              Then comes
              <br />
              the “I made that.”
            </h2>
            <p>
              The first perfect rise. The swirl of frosting. A little
              proud-of-yourself moment.
            </p>
          </motion.div>
          <motion.div
            className="story-copy"
            style={{ opacity: three, y: threeY }}
          >
            <span className="eyebrow">03 / SOMETHING TO SHARE</span>
            <h2>
              And suddenly,
              <br />
              it’s a celebration.
            </h2>
            <p>
              Make the birthday cake. Bring the cookies. Turn an ordinary day
              into something sweet.
            </p>
          </motion.div>
        </div>
        <motion.div
          className="story-orbit orbit-one"
          style={{ rotate }}
          aria-hidden="true"
        />
        <motion.div
          className="story-cake story-floating-cookie"
          style={{ x, y, rotate, rotateY, scale }}
        >
          <BitingCookie progress={p} />
        </motion.div>
        <motion.div
          className="story-cookie"
          style={{ x: cookieX, rotate: cookieRotate }}
          aria-hidden="true"
        >
          <Bake kind="cookie" />
        </motion.div>
        <motion.div
          className="story-macaron"
          style={{ y: macaronY, rotate }}
          aria-hidden="true"
        >
          <Bake kind="macaron" />
        </motion.div>
        <div className="story-bottomline">
          <Link href="/courses" className="story-course-link">
            Explore our courses <ArrowUpRight size={17} />
          </Link>
        </div>
        <motion.div
          className="story-progress"
          style={{ scaleX: p }}
          aria-hidden="true"
        />
      </motion.div>
    </section>
  );
}
