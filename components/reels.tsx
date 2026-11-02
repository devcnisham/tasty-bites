"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Instagram from "./instagram-icon";
import { useStore } from "./store";
import { Modal, Reveal } from "./ui";
import type { Reel } from "@/data/reels";

function ReelCard({ reel, play }: { reel: Reel; play: () => void }) {
  const reduced = useReducedMotion();
  const contents = (
    <>
      <Image
        src={reel.cover}
        alt={reel.title}
        fill
        sizes="(max-width:560px) 72vw, (max-width:800px) 40vw, 25vw"
      />
      <span className="reel-gradient" />
      <span className="reel-top">
        <Instagram size={17} />
        <span>{reel.demo ? "DEMO REEL" : "INSTAGRAM REEL"}</span>
      </span>
      <span className="reel-caption">
        <strong>{reel.title}</strong>
        <small>
          {reel.demo ? "Open the reel" : "Watch on Instagram"}{" "}
          <ArrowUpRight size={13} />
        </small>
      </span>
    </>
  );
  return (
    <motion.div
      className="reel-card"
      whileHover={reduced ? {} : { y: -7 }}
      transition={{ type: "spring", stiffness: 170, damping: 24 }}
    >
      {reel.instagramUrl ? (
        <a
          href={reel.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Watch ${reel.title} on Instagram`}
        >
          {contents}
        </a>
      ) : (
        <button onClick={play} aria-label={`Play demo reel: ${reel.title}`}>
          {contents}
        </button>
      )}
    </motion.div>
  );
}

export default function Reels() {
  const { s } = useStore();
  const [active, setActive] = useState<Reel | null>(null);
  const close = useCallback(() => setActive(null), []);
  const track = useRef<HTMLDivElement>(null);
  if (!s.reels.length) return null;
  return (
    <section className="section reels-section" id="studio-reels">
      <Reveal className="section-title reels-heading">
        <div>
          <span className="eyebrow">THE SWEET SIDE OF YOUR SCROLL</span>
          <h2>
            Little moments.
            <br />
            <em>Lovely things.</em>
          </h2>
        </div>
        <div>
          <a
            className="instagram-reels-link"
            href="https://www.instagram.com/tasty_bite_baking_studio/reels/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram size={18} />
            @tasty_bite_baking_studio <ArrowUpRight size={16} />
          </a>
          <div className="row reel-arrows">
            <button
              className="circle-btn"
              aria-label="Previous reels"
              onClick={() =>
                track.current?.scrollBy({ left: -330, behavior: "smooth" })
              }
            >
              <ChevronLeft />
            </button>
            <button
              className="circle-btn"
              aria-label="Next reels"
              onClick={() =>
                track.current?.scrollBy({ left: 330, behavior: "smooth" })
              }
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </Reveal>
      <div className="reels-track" ref={track}>
        {s.reels.map((reel, i) => (
          <Reveal key={reel.id} className="reel-item" delay={i * 0.07}>
            <ReelCard reel={reel} play={() => setActive(reel)} />
          </Reveal>
        ))}
      </div>
      <p className="reels-footnote">
        {s.reels.some((r) => r.demo)
          ? "Demo reels feature stock baking footage. A little preview of what’s to come."
          : "More little moments from the kitchen, on Instagram."}
      </p>
      {active && (
        <Modal title={active.title} close={close} className="reel-player-modal">
          <video
            className="reel-modal-video"
            controls
            playsInline
            autoPlay
            poster={active.cover}
            src={active.video}
          />
          <p className="film-credit">
            Demo reel · stock baking footage from Mixkit.
          </p>
        </Modal>
      )}
    </section>
  );
}
