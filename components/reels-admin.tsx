"use client";

import Image from "next/image";
import { ArrowUp, ArrowDown, Trash2, Plus } from "lucide-react";
import { useStore } from "./store";
import { demoReels } from "@/data/reels";
import { photos } from "@/data/portfolio";

export default function ReelsAdmin() {
  const { s, set, toast } = useStore();
  function move(from: number, to: number) {
    if (to < 0 || to >= s.reels.length) return;
    set((x) => {
      const reels = [...x.reels];
      const [reel] = reels.splice(from, 1);
      reels.splice(to, 0, reel);
      return { ...x, reels };
    });
  }
  return (
    <div className="two-grid reels-admin">
      <form
        className="panel"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          let url: URL;
          try {
            url = new URL(String(data.get("url")));
          } catch {
            toast("Enter a valid Instagram reel link.");
            return;
          }
          if (
            url.protocol !== "https:" ||
            !["instagram.com", "www.instagram.com"].includes(url.hostname) ||
            !/^\/(reel|p)\/[A-Za-z0-9_-]+\/?$/.test(url.pathname)
          ) {
            toast("Use an Instagram /reel/ or /p/ link.");
            return;
          }
          if (s.reels.some((r) => r.instagramUrl === url.href)) {
            toast("That reel is already in the layout.");
            return;
          }
          set((x) => ({
            ...x,
            reels: [
              ...x.reels,
              {
                id: `reel-${Date.now()}`,
                title: String(data.get("title")).trim(),
                cover: String(data.get("cover")),
                instagramUrl: url.href,
                demo: false,
              },
            ],
          }));
          toast("Reel saved in this browser");
          e.currentTarget.reset();
        }}
      >
        <h3>A little more to share.</h3>
        <p>
          Add real Instagram reels here when they’re ready. Saved reels appear
          on the landing page.
        </p>
        <label>
          Reel title
          <input
            required
            name="title"
            maxLength={80}
            placeholder="A lovely little bake"
          />
        </label>
        <label>
          Instagram reel link
          <input
            required
            name="url"
            type="url"
            placeholder="https://www.instagram.com/reel/…"
          />
        </label>
        <label>
          Cover photograph
          <select name="cover">
            {Object.values(photos).map((photo) => (
              <option value={photo.src} key={photo.src}>
                {photo.category}
              </option>
            ))}
          </select>
        </label>
        <button className="btn">
          <Plus size={16} />
          Save reel
        </button>
        <p className="small muted">
          Browser-only demo. Real Instagram links open in a new tab; no tracking
          embed loads automatically.
        </p>
      </form>
      <div>
        <div className="row between">
          <h3>Your reel layout</h3>
          <button
            className="text-btn"
            onClick={() => {
              set((x) => ({
                ...x,
                reels: [...demoReels, ...x.reels.filter((r) => !r.demo)],
              }));
              toast("Demo reels restored");
            }}
          >
            Restore demos
          </button>
        </div>
        {s.reels.map((reel, i) => (
          <div className="panel reel-admin-row" key={reel.id}>
            <Image src={reel.cover} alt="" width={64} height={85} />
            <div>
              <strong>{reel.title}</strong>
              <small>{reel.demo ? "Demo baking film" : "Instagram reel"}</small>
            </div>
            <div className="row">
              <button
                className="icon-btn"
                disabled={i === 0}
                aria-label={`Move ${reel.title} up`}
                onClick={() => move(i, i - 1)}
              >
                <ArrowUp size={16} />
              </button>
              <button
                className="icon-btn"
                disabled={i === s.reels.length - 1}
                aria-label={`Move ${reel.title} down`}
                onClick={() => move(i, i + 1)}
              >
                <ArrowDown size={16} />
              </button>
              <button
                className="icon-btn"
                aria-label={`Remove ${reel.title}`}
                onClick={() => {
                  set((x) => ({
                    ...x,
                    reels: x.reels.filter((r) => r.id !== reel.id),
                  }));
                  toast("Reel removed", () =>
                    set((x) => ({
                      ...x,
                      reels: x.reels.some((r) => r.id === reel.id)
                        ? x.reels
                        : [...x.reels.slice(0, i), reel, ...x.reels.slice(i)],
                    })),
                  );
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {!s.reels.length && (
          <div className="panel">
            <p>No reels yet. Add a reel or restore the demos.</p>
          </div>
        )}
      </div>
    </div>
  );
}
