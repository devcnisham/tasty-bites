"use client";
import { useEffect, useRef, useState, useEffectEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Check,
  Lock,
  ChevronRight,
  Download,
  ThumbsUp,
  Menu,
  ArrowRight,
} from "lucide-react";
import { Course } from "@/data/courses";
import { useStore, allLessons } from "./store";
import { Bake } from "./ui";
const time = (n: number) =>
  `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, "0")}`;
export default function Player({
  course: c,
  lessonId,
}: {
  course: Course;
  lessonId: string;
}) {
  const { s, set, toast, event } = useStore();
  const router = useRouter();
  const lessons = allLessons(c),
    lesson = lessons.find((l) => l.id === lessonId) || lessons[0];
  const unlocked = s.owned.includes(c.id) || lesson.preview;
  const [playing, setPlaying] = useState(false),
    [pos, setPos] = useState(() =>
      s.consent?.preferences ? s.positions[lesson.id] || 0 : 0,
    ),
    [speed, setSpeed] = useState(1),
    [volume, setVolume] = useState(0.8),
    [captions, setCaptions] = useState(false),
    [tab, setTab] = useState("Overview"),
    [servings, setServings] = useState(6),
    [checks, setChecks] = useState<string[]>([]),
    [likes, setLikes] = useState<string[]>([]),
    [sidebar, setSidebar] = useState(false),
    [countdown, setCountdown] = useState<number | null>(null),
    [real, setReal] = useState(false);
  const video = useRef<HTMLVideoElement>(null),
    frame = useRef<HTMLDivElement>(null),
    last = useRef(pos),
    completed = useRef(!!s.progress[lesson.id]);
  const duration =
    real && video.current?.duration && Number.isFinite(video.current.duration)
      ? video.current.duration
      : lesson.duration;
  const next = lessons[lessons.findIndex((l) => l.id === lesson.id) + 1];
  useEffect(() => {
    let live = true;
    fetch("/api/demo-media")
      .then((r) => r.json())
      .then((data: { available: boolean }) => {
        if (live) setReal(data.available === true);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  useEffect(() => {
    if (!playing || real) return;
    const id = setInterval(
      () => setPos((p) => Math.min(p + speed, duration)),
      1000,
    );
    return () => clearInterval(id);
  }, [playing, speed, real, duration]);
  useEffect(() => {
    if (!real || !video.current) return;
    video.current.playbackRate = speed;
    video.current.volume = volume;
    if (playing)
      void video.current.play().catch(() => {
        setPlaying(false);
        toast("Press play to start the video.");
      });
    else video.current.pause();
  }, [playing, speed, volume, real, toast]);
  useEffect(() => {
    if (!unlocked) return;
    if (pos > 0 && Math.floor(pos / 10) !== Math.floor(last.current / 10)) {
      last.current = pos;
      if (s.consent?.preferences)
        set((x) => ({ ...x, positions: { ...x.positions, [lesson.id]: pos } }));
      event(`watch_time ${lesson.id}`);
    }
    if (pos >= duration * 0.9 && !completed.current) {
      completed.current = true;
      set((x) => ({ ...x, progress: { ...x.progress, [lesson.id]: true } }));
      toast("A little more confidence. Lesson completed!");
      event("lesson_completed");
    }
    if (pos >= duration && playing) {
      setPlaying(false);
      if (next) setCountdown(5);
    }
  }, [
    pos,
    duration,
    playing,
    next,
    lesson.id,
    unlocked,
    set,
    event,
    toast,
    s.consent,
  ]);
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      if (next) router.push(`/learn/${c.id}/${next.id}`);
      setCountdown(null);
      return;
    }
    const id = setTimeout(
      () => setCountdown((v) => (v === null ? null : v - 1)),
      1000,
    );
    return () => clearTimeout(id);
  }, [countdown, next, router, c.id]);
  const seek = (n: number) => {
    const v = Math.max(0, Math.min(duration, n));
    setPos(v);
    if (video.current) video.current.currentTime = v;
  };
  const fullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else
      void frame.current
        ?.requestFullscreen()
        .catch(() => toast("Fullscreen is unavailable in this window."));
  };
  const keyHandler = useEffectEvent((e: KeyboardEvent) => {
    const t = e.target as HTMLElement;
    if (
      ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(t.tagName) ||
      !unlocked ||
      e.ctrlKey ||
      e.altKey ||
      e.metaKey
    )
      return;
    if (e.code === "Space") {
      e.preventDefault();
      setPlaying((v) => !v);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      seek(pos + 10);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      seek(pos - 10);
    }
    if (e.key === "f") fullscreen();
    if (e.key === "m") setVolume((v) => (v ? 0 : 0.8));
  });
  useEffect(() => {
    const f = (e: KeyboardEvent) => keyHandler(e);
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, []);
  const finished = lessons.filter((l) => s.progress[l.id]).length;
  return (
    <section className="learning section">
      <div className="row between">
        <Link href={`/courses/${c.id}`} className="text-btn">
          ← {c.title}
        </Link>
        <button
          className="btn outline mobile-only"
          onClick={() => setSidebar(!sidebar)}
        >
          <Menu size={17} /> Lessons
        </button>
      </div>
      <div className="learning-grid">
        <div>
          <div ref={frame} className="player">
            {unlocked ? (
              <>
                {real ? (
                  <video
                    ref={video}
                    src="/demo/lesson.mp4"
                    playsInline
                    onTimeUpdate={() => setPos(video.current?.currentTime || 0)}
                    onEnded={() => {
                      setPlaying(false);
                      if (next) setCountdown(5);
                    }}
                  />
                ) : (
                  <div className={`simulation ${playing ? "is-playing" : ""}`}>
                    <span className="simulation-label">
                      TASTY BITE’S KITCHEN · SIMULATED LESSON
                    </span>
                    <Bake kind={c.kind} />
                    <div className="baking-steam">∿ ∿ ∿</div>
                    {!playing && (
                      <button
                        className="player-big-play"
                        aria-label="Play lesson"
                        onClick={() => setPlaying(true)}
                      >
                        <Play size={32} fill="currentColor" />
                      </button>
                    )}
                  </div>
                )}
                <span className="watermark">demo.baker@example.com</span>
                {captions && (
                  <div className="captions">
                    {pos % 20 < 10
                      ? "Take your time. Measure your ingredients carefully."
                      : "Every lovely bake starts with a little preparation."}
                  </div>
                )}
                <div className="player-controls">
                  <input
                    type="range"
                    min={0}
                    max={duration}
                    step={1}
                    value={pos}
                    onChange={(e) => seek(Number(e.target.value))}
                    aria-label="Seek lesson"
                  />
                  <div className="row between">
                    <div className="row">
                      <button
                        className="icon-btn"
                        aria-label={playing ? "Pause" : "Play"}
                        onClick={() => setPlaying(!playing)}
                      >
                        {playing ? <Pause size={20} /> : <Play size={20} />}
                      </button>
                      <button
                        className="icon-btn"
                        aria-label="Toggle mute"
                        onClick={() => setVolume(volume ? 0 : 0.8)}
                      >
                        {volume ? <Volume2 size={19} /> : <VolumeX size={19} />}
                      </button>
                      <input
                        className="volume"
                        type="range"
                        min={0}
                        max={1}
                        step={0.1}
                        value={volume}
                        aria-label="Volume"
                        onChange={(e) => setVolume(Number(e.target.value))}
                      />
                      <small>
                        {time(pos)} / {time(duration)}
                      </small>
                    </div>
                    <div className="row">
                      <select
                        aria-label="Playback speed"
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                      >
                        {[0.75, 1, 1.25, 1.5, 1.75, 2].map((v) => (
                          <option key={v} value={v}>
                            {v}×
                          </option>
                        ))}
                      </select>
                      <button
                        className={`icon-btn ${captions ? "selected" : ""}`}
                        aria-label="Toggle sample captions"
                        aria-pressed={captions}
                        onClick={() => setCaptions(!captions)}
                      >
                        CC
                      </button>
                      <button
                        className="icon-btn"
                        aria-label="Fullscreen"
                        onClick={fullscreen}
                      >
                        <Maximize size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="locked">
                <Lock size={44} />
                <h2>A little more is waiting for you.</h2>
                <p>Purchase this course in the demo to unlock every lesson.</p>
                <Link href={`/courses/${c.id}`} className="btn">
                  Explore the full course
                </Link>
              </div>
            )}
            {countdown !== null && (
              <div className="autoplay">
                <p>Next lesson in {countdown}s</p>
                <button
                  className="btn outline"
                  onClick={() => setCountdown(null)}
                >
                  Stay here
                </button>
              </div>
            )}
          </div>
          <div className="row between lesson-title">
            <div>
              <span className="eyebrow">{c.title}</span>
              <h1>{lesson.title}</h1>
            </div>
            <button
              className="btn outline"
              disabled={!unlocked}
              onClick={() => {
                set((x) => ({
                  ...x,
                  progress: {
                    ...x.progress,
                    [lesson.id]: !x.progress[lesson.id],
                  },
                }));
                toast(
                  s.progress[lesson.id]
                    ? "Lesson marked incomplete"
                    : "Lesson completed",
                );
                completed.current = !s.progress[lesson.id];
              }}
            >
              <Check size={17} />
              {s.progress[lesson.id] ? "Completed" : "Mark complete"}
            </button>
          </div>
          <div className="tabs" role="tablist">
            {["Overview", "Recipe & ingredients", "Notes", "Q&A"].map((t) => (
              <button
                role="tab"
                aria-selected={tab === t}
                id={`tab-${t}`}
                key={t}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <div
            className="tab-panel panel"
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
          >
            {tab === "Overview" ? (
              <>
                <h3>A little preparation goes a long way.</h3>
                <p>
                  In this lesson, Tasty Bite walks you through the ingredients,
                  tools and techniques you’ll use. Pause whenever you need to,
                  take notes, and give yourself room to experiment.
                </p>
                <p className="muted">
                  Demo player: Space play/pause · ← → seek · M mute · F
                  fullscreen. Shortcuts work when focus is outside controls.
                </p>
                <p>
                  Auto-completion at 90%. Automatic resume is saved only with
                  Preferences consent.
                </p>
              </>
            ) : tab === "Recipe & ingredients" ? (
              <>
                <div className="row between wrap">
                  <h3>Your ingredient checklist</h3>
                  <label className="row">
                    Servings{" "}
                    <input
                      className="servings"
                      type="number"
                      min={1}
                      max={48}
                      value={servings}
                      onChange={(e) =>
                        setServings(
                          Math.max(
                            1,
                            Math.min(48, Number(e.target.value) || 1),
                          ),
                        )
                      }
                    />
                  </label>
                </div>
                {[
                  ["Flour", 180, "g"],
                  ["Butter", 90, "g"],
                  ["Sugar", 120, "g"],
                  ["Milk", 150, "ml"],
                  ["Vanilla", 1, "tsp"],
                  ["Baking powder", 1.5, "tsp"],
                ].map(([name, n, u]) => (
                  <label className="ingredient" key={String(name)}>
                    <input
                      type="checkbox"
                      checked={checks.includes(String(name))}
                      onChange={() =>
                        setChecks((x) =>
                          x.includes(String(name))
                            ? x.filter((v) => v !== name)
                            : [...x, String(name)],
                        )
                      }
                    />
                    <span>{name}</span>
                    <strong>
                      {+((Number(n) * servings) / 6).toFixed(1)} {u}
                    </strong>
                  </label>
                ))}
                <p className="muted small">
                  Sample ingredient list for demonstrating scaling. Replace with
                  the verified lesson recipe.
                </p>
                <button
                  className="btn outline"
                  onClick={() => {
                    window.print();
                    toast(
                      "Choose “Save as PDF” in the print dialog for your demo recipe.",
                    );
                  }}
                >
                  <Download size={17} />
                  Download recipe PDF
                </button>
              </>
            ) : tab === "Notes" ? (
              <>
                <h3>Your kitchen notes</h3>
                <label>
                  What would you like to remember?
                  <textarea
                    rows={7}
                    disabled={!unlocked}
                    value={s.notes[lesson.id] || ""}
                    onChange={(e) =>
                      set((x) => ({
                        ...x,
                        notes: { ...x.notes, [lesson.id]: e.target.value },
                      }))
                    }
                    placeholder="A flavour to try. A little tip. Your next experiment."
                  />
                </label>
                <small className="muted">
                  Saved in this browser as you type.
                </small>
              </>
            ) : (
              <>
                <h3>Questions from the kitchen</h3>
                {[
                  [
                    "Aanya",
                    "Can I prepare the dry ingredients the night before?",
                    "Yes — weigh them into a covered container and keep everything dry until you’re ready to bake.",
                  ],
                  [
                    "Meera",
                    "Should my butter be at room temperature?",
                    "For this sample recipe, yes. Soft enough to press gently, but not melted.",
                  ],
                ].map(([n, q, a]) => (
                  <div className="review" key={n}>
                    <strong>{n} · Sample question</strong>
                    <p>{q}</p>
                    <p className="answer">Tasty Bite: {a}</p>
                    <button
                      className="text-btn"
                      onClick={() =>
                        setLikes((v) =>
                          v.includes(n) ? v.filter((x) => x !== n) : [...v, n],
                        )
                      }
                    >
                      <ThumbsUp size={16} />
                      {likes.includes(n) ? "Liked" : "Helpful"} ·{" "}
                      {likes.includes(n) ? 4 : 3}
                    </button>
                  </div>
                ))}
                <button
                  className="btn outline"
                  onClick={() =>
                    toast(
                      "Live questions will be available with the real backend.",
                    )
                  }
                >
                  Ask a question
                </button>
              </>
            )}
          </div>
        </div>
        <aside className={`lesson-sidebar ${sidebar ? "visible" : ""}`}>
          <div className="row between">
            <h3>Your baking journey</h3>
            <span>
              {finished}/{lessons.length}
            </span>
          </div>
          <progress max={lessons.length} value={finished} />
          {c.phases.map((p, i) => (
            <details key={p.title} open>
              <summary>
                0{i + 1} · {p.title}
                <ChevronRight size={16} />
              </summary>
              {p.lessons.map((l) => (
                <Link
                  key={l.id}
                  className={`sidebar-lesson ${lesson.id === l.id ? "active" : ""}`}
                  href={`/learn/${c.id}/${l.id}`}
                >
                  {s.progress[l.id] ? (
                    <Check size={17} />
                  ) : !s.owned.includes(c.id) && !l.preview ? (
                    <Lock size={16} />
                  ) : (
                    <Play size={15} />
                  )}
                  <span>
                    {l.title}
                    <small>
                      {Math.round(l.duration / 60)} min{" "}
                      {l.preview ? "· Free preview" : ""}
                    </small>
                  </span>
                </Link>
              ))}
            </details>
          ))}
          {next && (
            <Link className="btn full" href={`/learn/${c.id}/${next.id}`}>
              Next lesson <ArrowRight size={17} />
            </Link>
          )}
        </aside>
      </div>
    </section>
  );
}
