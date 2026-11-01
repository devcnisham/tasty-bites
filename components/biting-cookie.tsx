"use client";

import { useId } from "react";
import { getImageProps } from "next/image";
import { motion, useTransform, type MotionValue } from "framer-motion";
const cookieSource = getImageProps({
  src: "/images/stock/floating-cookie.png",
  alt: "",
  width: 600,
  height: 388,
}).props.src;

const bites = [
  { at: 0.14, x: 2180, y: 310, r: 255 },
  { at: 0.32, x: 2100, y: 970, r: 330 },
  { at: 0.51, x: 420, y: 270, r: 340 },
  { at: 0.7, x: 500, y: 1150, r: 390 },
  { at: 0.9, x: 1210, y: 760, r: 800 },
];

function Bite({
  progress,
  at,
  x,
  y,
  r,
}: {
  progress: MotionValue<number>;
  at: number;
  x: number;
  y: number;
  r: number;
}) {
  const radius = useTransform(progress, [at, at + 0.035], [0, r]);
  const tooth = useTransform(progress, [at, at + 0.035], [0, r * 0.69]);
  return (
    <g fill="black">
      <motion.circle cx={x} cy={y} r={radius} />
      <motion.circle cx={x - r * 0.65} cy={y - r * 0.52} r={tooth} />
      <motion.circle cx={x + r * 0.24} cy={y + r * 0.75} r={tooth} />
    </g>
  );
}

function Crumbs({
  progress,
  at,
  x,
  y,
  r,
}: {
  progress: MotionValue<number>;
  at: number;
  x: number;
  y: number;
  r: number;
}) {
  const opacity = useTransform(
    progress,
    [at, at + 0.018, at + 0.13],
    [0, 1, 0],
  );
  const fall = useTransform(progress, [at, at + 0.14], [0, 340]);
  return (
    <motion.g style={{ opacity, y: fall }} aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map((n) => {
        const cx = x - r * 0.55 + (n % 3) * 55,
          cy = y - r * 0.2 + Math.floor(n / 3) * 44;
        return (
          <path
            key={n}
            d={`M${cx} ${cy}l${14 + n * 2} -7l13 16l-10 13l-19 -7z`}
            fill={n % 2 ? "#7f492c" : "#c58b50"}
            transform={`rotate(${n * 27} ${cx} ${cy})`}
          />
        );
      })}
    </motion.g>
  );
}

export default function BitingCookie({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const maskId = `cookie-bites-${useId().replace(/:/g, "")}`;
  return (
    <svg
      viewBox="0 0 2320 1500"
      className="biting-cookie"
      role="img"
      aria-label="A floating chocolate chip cookie, eaten bite by bite as you scroll"
    >
      <defs>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="2320"
          height="1500"
        >
          <rect width="2320" height="1500" fill="white" />
          {bites.map((bite) => (
            <Bite key={bite.at} progress={progress} {...bite} />
          ))}
        </mask>
      </defs>
      <image
        href={cookieSource}
        width="2320"
        height="1500"
        mask={`url(#${maskId})`}
      />
      {bites.map((bite) => (
        <Crumbs key={bite.at} progress={progress} {...bite} />
      ))}
    </svg>
  );
}
