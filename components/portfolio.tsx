"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { portfolio, coursePhotos, type StudioPhoto } from "@/data/portfolio";
import type { Course } from "@/data/courses";
import { Bake, Modal, Reveal } from "./ui";

export function CourseVisual({ c }: { c: Course }) {
  const photo = coursePhotos[c.id];
  return photo ? (
    <Image
      className="course-photo"
      src={photo.src}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      sizes="(max-width:560px) 88vw, 33vw"
      style={{ objectPosition: photo.position }}
    />
  ) : (
    <Bake kind={c.kind} />
  );
}

function InteractivePhoto({
  photo,
  open,
}: {
  photo: StudioPhoto;
  open: () => void;
}) {
  const reduce = useReducedMotion();
  const px = useMotionValue(50),
    py = useMotionValue(50);
  const lx = useSpring(px, { stiffness: 150, damping: 24 }),
    ly = useSpring(py, { stiffness: 150, damping: 24 });
  const rotateX = useTransform(ly, [0, 100], [3, -3]),
    rotateY = useTransform(lx, [0, 100], [-3, 3]);
  const shine = useMotionTemplate`radial-gradient(350px circle at ${lx}% ${ly}%,rgba(255,255,255,.24),transparent 70%)`;
  return (
    <motion.button
      className="portfolio-photo"
      aria-label={`View ${photo.category.toLowerCase()} photograph`}
      onClick={open}
      style={{ rotateX: reduce ? 0 : rotateX, rotateY: reduce ? 0 : rotateY }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width) * 100);
        py.set(((e.clientY - r.top) / r.height) * 100);
      }}
      onPointerLeave={() => {
        px.set(50);
        py.set(50);
      }}
      whileHover={reduce ? {} : { y: -8 }}
      whileTap={reduce ? {} : { scale: 0.985 }}
      transition={{ type: "spring", stiffness: 160, damping: 22 }}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="(max-width:560px) 88vw, (max-width:800px) 45vw, 30vw"
        style={{ objectPosition: photo.position }}
      />
      <motion.span
        className="portfolio-gloss"
        style={{ background: shine }}
        aria-hidden="true"
      />
    </motion.button>
  );
}

export function PhotoGallery({
  showHeading = true,
}: {
  showHeading?: boolean;
}) {
  const [active, setActive] = useState<number | null>(null);
  const close = useCallback(() => setActive(null), []);
  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setActive((n) => (n === null ? null : (n + 1) % 3));
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActive((n) => (n === null ? null : (n + 2) % 3));
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active]);
  return (
    <>
      {showHeading && (
        <Reveal className="section-title portfolio-heading">
          <div>
            <span className="eyebrow">STUDIO INSPIRATION</span>
            <h2>
              A little glimpse.
              <br />A lot of possibility.
            </h2>
          </div>
          <p>
            A few lovely ideas for your next bake.
            <br />
            Curated baking photography.
          </p>
        </Reveal>
      )}
      <div className="portfolio-grid">
        {portfolio.map((photo, i) => (
          <Reveal
            key={photo.src}
            className={`portfolio-piece portfolio-piece-${i}`}
            delay={i * 0.09}
          >
            <InteractivePhoto
              photo={photo}
              open={() => setActive(i)}
            />
            <div className="portfolio-caption">
              <span className="eyebrow">{photo.category}</span>
              <h3>{photo.title}</h3>
            </div>
          </Reveal>
        ))}
      </div>
      {active !== null && (
        <Modal title="The sweet edit" close={close}>
          <div className="photo-lightbox">
            <Image
              src={portfolio[active].src}
              alt={portfolio[active].alt}
              width={portfolio[active].width}
              height={portfolio[active].height}
              sizes="(max-width:600px) 85vw, 520px"
            />
            <div className="lightbox-caption">
              <span>{portfolio[active].title}</span>
              <span>0{active + 1} / 03</span>
            </div>
          </div>
          <div className="row between lightbox-controls">
            <button
              className="circle-btn"
              aria-label="Previous photograph"
              onClick={() => setActive((active + 2) % 3)}
            >
              <ChevronLeft />
            </button>
            <p>{portfolio[active].category}</p>
            <button
              className="circle-btn"
              aria-label="Next photograph"
              onClick={() => setActive((active + 1) % 3)}
            >
              <ChevronRight />
            </button>
          </div>
          <button className="text-btn" onClick={close}>
            <X size={15} />
            Back to the studio
          </button>
        </Modal>
      )}
    </>
  );
}

export default function Portfolio() {
  return (
    <section className="section portfolio-section">
      <PhotoGallery />
    </section>
  );
}
