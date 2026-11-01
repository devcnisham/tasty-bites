"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CalendarDays,
  Clock,
  MapPin,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Copy,
  Leaf,
} from "lucide-react";
import { Reveal } from "./ui";
import { useStore } from "./store";

const offers = [
  {
    id: "moon-cake",
    label: "FEATURED STUDIO WORKSHOP",
    title: "Trendy Moon Cake Class",
    description:
      "A beautiful little bake, a delicious new skill. Explore an eggless moon cake class with Tasty Bite Baking Studio.",
    image: "/posters/moon-cake-class-v2.png",
    alt: "Tasty Bite Baking Studio poster for the eggless Moon Cake Class on 2 November, from 9:30 AM to 1 PM, with WhatsApp contact 9620392088",
    poster: true,
  },
  {
    id: "welcome",
    label: "A LITTLE WELCOME TREAT",
    title: "Your first bake, a little sweeter.",
    description:
      "Find a course you love and take 10% off your demo order. A little encouragement to start something lovely.",
    image: "/images/stock/pink-cake.jpg",
    alt: "A pale pink cake with delicate piped frosting",
    poster: false,
  },
];

export default function Offers() {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const { toast } = useStore();
  const offer = offers[index];
  return (
    <section className="section offers-section" id="classes-and-offers">
      <Reveal className="section-title row between offers-heading">
        <div>
          <span className="eyebrow">A LITTLE SOMETHING TO LOOK FORWARD TO</span>
          <h2>Fresh from the studio.</h2>
        </div>
        <div className="row">
          <button
            className="circle-btn"
            aria-label="Previous class or offer"
            onClick={() =>
              setIndex((index + offers.length - 1) % offers.length)
            }
          >
            <ChevronLeft />
          </button>
          <button
            className="circle-btn"
            aria-label="Next class or offer"
            onClick={() => setIndex((index + 1) % offers.length)}
          >
            <ChevronRight />
          </button>
        </div>
      </Reveal>
      <AnimatePresence mode="wait">
        <motion.div
          className="offer-feature"
          key={offer.id}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : -8 }}
          transition={{ duration: reduce ? 0 : 0.3 }}
        >
          <div className={`offer-visual ${offer.poster ? "has-poster" : ""}`}>
            <Image
              src={offer.image}
              alt={offer.alt}
              fill
              sizes="(max-width:560px) 88vw, 420px"
              style={{
                objectFit: offer.poster ? "contain" : "cover",
                objectPosition: offer.poster ? "50% 50%" : "50% 65%",
              }}
            />
          </div>
          <div className="offer-copy">
            <span className="eyebrow">{offer.label}</span>
            <h3>{offer.title}</h3>
            <p>{offer.description}</p>
            {offer.poster ? (
              <>
                <div className="offer-details">
                  <span>
                    <CalendarDays size={18} />
                    <strong>2 November</strong>
                  </span>
                  <span>
                    <Clock size={18} />
                    9:30 AM – 1:00 PM
                  </span>
                  <span>
                    <MapPin size={18} />
                    Mangalore · Studio class
                  </span>
                  <span>
                    <Leaf size={18} />
                    Eggless
                  </span>
                </div>
                <a
                  className="btn"
                  href="https://wa.me/919620392088?text=Hi%20Tasty%20Bite%2C%20I%27d%20like%20to%20know%20more%20about%20the%20Moon%20Cake%20Class."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ask about this class <ArrowUpRight size={18} />
                </a>
                <small className="offer-contact">
                  WhatsApp · +91 96203 92088
                </small>
              </>
            ) : (
              <>
                <div className="offer-coupon">
                  <span>YOUR LITTLE TREAT</span>
                  <strong>WELCOME10</strong>
                  <button
                    aria-label="Copy WELCOME10 coupon"
                    onClick={() => {
                      void navigator.clipboard
                        .writeText("WELCOME10")
                        .then(() =>
                          toast("WELCOME10 copied — use it at checkout."),
                        )
                        .catch(() =>
                          toast("Use WELCOME10 at checkout for 10% off."),
                        );
                    }}
                  >
                    <Copy size={18} />
                  </button>
                </div>
                <Link href="/courses" className="btn">
                  Find your first bake <ArrowUpRight size={18} />
                </Link>
                <small className="offer-contact">
                  Demo offer · One code per order
                </small>
              </>
            )}
            <div className="offer-dots" aria-label="Choose a class or offer">
              {offers.map((o, i) => (
                <button
                  key={o.id}
                  aria-label={`Show ${o.title}`}
                  aria-pressed={index === i}
                  className={index === i ? "current" : ""}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
