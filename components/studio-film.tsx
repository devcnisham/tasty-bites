"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Play, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Modal, Reveal } from "./ui";

export default function StudioFilm({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const reduce = useReducedMotion();
  return (
    <section
      className={`section film-section ${embedded ? "film-embedded" : ""}`}
    >
      <Reveal>
        <motion.button
          className="film-teaser"
          onClick={() => setOpen(true)}
          aria-label="Play a cake-decorating film"
          whileHover={reduce ? {} : { scale: 0.995 }}
          whileTap={reduce ? {} : { scale: 0.985 }}
        >
          <Image
            src="/images/stock/film-poster.jpg"
            alt="A pastry chef adding delicate decorations to a frosted cake"
            fill
            sizes="(max-width:800px) 88vw, 1152px"
          />
          <span className="film-shade" />
          <span className="film-topline">
            THE ART OF TAKING YOUR TIME <span>01: A LITTLE KITCHEN FILM</span>
          </span>
          <span className="film-play">
            <Play size={25} fill="currentColor" />
          </span>
          <span className="film-copy">
            <span className="eyebrow">A MOMENT OF MAKING</span>
            <span className="film-title">
              The lovely little
              <br />
              <em>details.</em>
            </span>
            <span className="film-watch">
              Watch the film <ArrowUpRight size={16} />
            </span>
          </span>
        </motion.button>
      </Reveal>
      {open && (
        <Modal title="A moment of making" close={close}>
          <video
            className="studio-film"
            controls
            playsInline
            autoPlay
            preload="metadata"
            poster="/images/stock/film-poster.jpg"
          >
            <source src="/video/cake-decorating.mp4" type="video/mp4" />
            Your browser cannot play this video.
          </video>
          <p className="film-credit">
            Stock baking inspiration ·{" "}
            <a
              href="https://mixkit.co/free-stock-video/pastry-chef-decorating-a-cake-with-edible-pearls-50014/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Footage from Mixkit ↗
            </a>
          </p>
        </Modal>
      )}
    </section>
  );
}
