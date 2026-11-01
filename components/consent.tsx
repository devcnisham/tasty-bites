"use client";
import { useEffect, useState, useCallback } from "react";
import { Cookie, ShieldCheck, Check, X } from "lucide-react";
import { Modal } from "./ui";
import { useStore } from "./store";
export const cookieRows = [
  ["tb_consent", "Necessary", "Your consent choices", "6 months"],
  [
    "tb_demo (localStorage)",
    "Necessary",
    "Explicit demo account, cart, purchases and learning records",
    "Until cleared",
  ],
  [
    "theme / positions in tb_demo",
    "Preferences",
    "Theme and automatic playback resume",
    "Until cleared",
  ],
  ["tb_offer", "Preferences", "Dismissed welcome offer", "30 days"],
  [
    "Demo analytics",
    "Analytics",
    "In-memory page and watch events; no external request",
    "Session only",
  ],
  [
    "Demo marketing",
    "Marketing",
    "In-memory campaign event; no external pixel",
    "Session only",
  ],
];
export default function ConsentUI() {
  const { s, ready, consentOpen, setConsentOpen, saveConsent, events, event } =
    useStore();
  const [p, setP] = useState({
    preferences: false,
    analytics: false,
    marketing: false,
  });
  const [debug, setDebug] = useState(false);
  const close = useCallback(() => setConsentOpen(false), [setConsentOpen]);
  useEffect(() => {
    if (consentOpen)
      setP({
        preferences: s.consent?.preferences || false,
        analytics: s.consent?.analytics || false,
        marketing: s.consent?.marketing || false,
      });
  }, [consentOpen, s.consent]);
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        setDebug((v) => !v);
      }
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, []);
  return (
    <>
      {ready && !s.consent && !consentOpen && (
        <section className="consent-banner" aria-label="Cookie consent">
          <Cookie size={28} />
          <div>
            <strong>A little cookie housekeeping.</strong>
            <p>
              Essential storage keeps your demo working. You choose whether we
              remember preferences or enable demo analytics and marketing.
            </p>
          </div>
          <div className="row wrap">
            <button
              className="btn"
              onClick={() =>
                saveConsent({
                  preferences: true,
                  analytics: true,
                  marketing: true,
                })
              }
            >
              Accept all
            </button>
            <button
              className="btn outline"
              onClick={() =>
                saveConsent({
                  preferences: false,
                  analytics: false,
                  marketing: false,
                })
              }
            >
              Reject non-essential
            </button>
            <button className="text-btn" onClick={() => setConsentOpen(true)}>
              Customise
            </button>
          </div>
        </section>
      )}
      {consentOpen && (
        <Modal title="Your cookie choices" close={close}>
          <p>
            You’re in control. Optional categories are off until you choose
            them.
          </p>
          <div className="consent-choice">
            <ShieldCheck />
            <div>
              <strong>Strictly necessary · Always on</strong>
              <p>
                Consent, cart, demo account and your explicit learning records.
              </p>
              <small>tb_consent: 6 months · tb_demo: until cleared</small>
            </div>
            <Check />
          </div>
          {(["preferences", "analytics", "marketing"] as const).map((k) => (
            <label className="consent-choice" key={k}>
              <div>
                <strong className="capitalize">{k}</strong>
                <p>
                  {k === "preferences"
                    ? "Remember your theme, automatic lesson position and welcome offer dismissal."
                    : k === "analytics"
                      ? "Demonstrate visit and watch events in the local debug panel."
                      : "Demonstrate a campaign event in memory. No external advertising tools load."}
                </p>
                <small>
                  {k === "preferences"
                    ? "theme / positions: until cleared; tb_offer: 30 days"
                    : "No cookies; session memory only"}
                </small>
              </div>
              <input
                type="checkbox"
                role="switch"
                checked={p[k]}
                onChange={(e) => setP({ ...p, [k]: e.target.checked })}
              />
            </label>
          ))}
          <div className="row wrap">
            <button className="btn" onClick={() => saveConsent(p)}>
              Save my choices
            </button>
            <button
              className="btn outline"
              onClick={() =>
                saveConsent({
                  preferences: false,
                  analytics: false,
                  marketing: false,
                })
              }
            >
              Withdraw consent
            </button>
          </div>
          <p className="muted small">
            All storage is first party. Legal copy is a demo placeholder.
          </p>
        </Modal>
      )}
      {debug && (
        <aside className="debug">
          <div className="row between">
            <strong>Consent debug · Alt+D</strong>
            <button
              className="icon-btn"
              aria-label="Close debug"
              onClick={() => setDebug(false)}
            >
              <X size={16} />
            </button>
          </div>
          <p>
            Necessary ON · Preferences {s.consent?.preferences ? "ON" : "OFF"} ·
            Analytics {s.consent?.analytics ? "ON" : "OFF"} · Marketing{" "}
            {s.consent?.marketing ? "ON" : "OFF"}
          </p>
          <button
            className="text-btn"
            onClick={() => {
              event("test_visit");
              event("demo_pixel", "marketing");
            }}
          >
            Send test events
          </button>
          {events.map((e, i) => (
            <div key={i}>{e}</div>
          ))}
        </aside>
      )}
    </>
  );
}
