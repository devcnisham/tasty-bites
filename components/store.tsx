"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { courses, Course } from "@/data/courses";
import { demoReels, type Reel } from "@/data/reels";
export type Consent = {
  version: number;
  timestamp: string;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
};
export type Order = {
  id: string;
  items: string[];
  total: number;
  date: string;
};
export type State = {
  role: "visitor" | "learner" | "admin";
  cart: string[];
  owned: string[];
  progress: Record<string, boolean>;
  notes: Record<string, string>;
  orders: Order[];
  courses: Course[];
  reels: Reel[];
  theme: string;
  welcome: boolean;
  consent: Consent | null;
  positions: Record<string, number>;
};
const initial: State = {
  role: "visitor",
  cart: [],
  owned: ["eggless-cakes"],
  progress: { "eggless-cakes-0-0": true, "eggless-cakes-0-1": true },
  notes: {},
  orders: [],
  courses,
  reels: demoReels,
  theme: "light",
  welcome: true,
  consent: null,
  positions: {},
};
type Store = {
  s: State;
  set: React.Dispatch<React.SetStateAction<State>>;
  ready: boolean;
  toast: (s: string, undo?: () => void) => void;
  notice: { text: string; undo?: () => void } | null;
  consentOpen: boolean;
  setConsentOpen: (v: boolean) => void;
  saveConsent: (p: Omit<Consent, "version" | "timestamp">) => void;
  events: string[];
  event: (name: string, category?: "analytics" | "marketing") => void;
};
const Context = createContext<Store>(null!);
export function Provider({ children }: { children: React.ReactNode }) {
  const [s, set] = useState(initial),
    [ready, setReady] = useState(false),
    [notice, setNotice] = useState<Store["notice"]>(null),
    [consentOpen, setConsentOpen] = useState(false),
    [events, setEvents] = useState<string[]>([]);
  useEffect(() => {
    window.dispatchEvent(new Event("tb:hydrated"));
    try {
      const raw = localStorage.getItem("tb_demo");
      const consentRaw = document.cookie
        .split("; ")
        .find((x) => x.startsWith("tb_consent="))
        ?.split("=")
        .slice(1)
        .join("=");
      const parsed = consentRaw
        ? JSON.parse(decodeURIComponent(consentRaw))
        : null;
      const consent =
        parsed?.version === 1 &&
        Date.now() - Date.parse(parsed.timestamp) < 183 * 86400000
          ? parsed
          : null;
      const stored = raw ? JSON.parse(raw) : {};
      set({
        ...initial,
        ...stored,
        consent,
        theme: consent?.preferences ? stored.theme || "light" : "light",
        positions: consent?.preferences ? stored.positions || {} : {},
        welcome: !document.cookie.includes("tb_offer="),
      });
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const { theme, positions, ...core } = s;
    localStorage.setItem(
      "tb_demo",
      JSON.stringify({
        ...core,
        ...(s.consent?.preferences ? { theme, positions } : {}),
      }),
    );
    document.documentElement.dataset.theme = s.theme;
  }, [s, ready]);
  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(null), 5000);
    return () => clearTimeout(id);
  }, [notice]);
  const toast = useCallback(
    (text: string, undo?: () => void) => setNotice({ text, undo }),
    [],
  );
  const event = useCallback(
    (name: string, category: "analytics" | "marketing" = "analytics") => {
      setEvents((x) =>
        [
          `${new Date().toLocaleTimeString()} · ${s.consent?.[category] ? "SENT" : "BLOCKED"} · ${category} · ${name}`,
          ...x,
        ].slice(0, 25),
      );
    },
    [s.consent],
  );
  const saveConsent = useCallback(
    (p: Omit<Consent, "version" | "timestamp">) => {
      const c = { ...p, version: 1, timestamp: new Date().toISOString() };
      document.cookie = `tb_consent=${encodeURIComponent(JSON.stringify(c))}; Max-Age=15811200; Path=/; SameSite=Lax`;
      localStorage.setItem("tb_consent", JSON.stringify(c));
      if (!p.preferences) {
        document.cookie = "tb_offer=; Max-Age=0; Path=/";
        localStorage.removeItem("tb_last_lesson");
      }
      set((x) => ({
        ...x,
        consent: c,
        positions: p.preferences ? x.positions : {},
      }));
      setConsentOpen(false);
      toast("Cookie choices saved");
    },
    [toast],
  );
  return (
    <Context.Provider
      value={{
        s,
        set,
        ready,
        notice,
        toast,
        consentOpen,
        setConsentOpen,
        saveConsent,
        events,
        event,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useStore = () => useContext(Context);
export const money = (v: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(v);
export const allLessons = (c: Course) => c.phases.flatMap((p) => p.lessons);
