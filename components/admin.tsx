"use client";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import {
  Plus,
  GripVertical,
  Trash2,
  Upload,
  Check,
  Users,
  IndianRupee,
  ShoppingBag,
  Award,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Course } from "@/data/courses";
import { useStore, money, allLessons } from "./store";
import { Bake, Heading } from "./ui";
import ReelsAdmin from "./reels-admin";
type Coupon = {
  code: string;
  type: string;
  value: number;
  expiry: string;
  limit: number;
  active: boolean;
};
export default function Admin() {
  const { s, set, toast } = useStore();
  const [tab, setTab] = useState("Overview"),
    [selected, setSelected] = useState(s.courses[0].id),
    [edit, setEdit] = useState<Course>(s.courses[0]),
    [coupons, setCoupons] = useState<Coupon[]>([]),
    [uploads, setUploads] = useState<{ name: string; progress: number }[]>([]),
    [query, setQuery] = useState(""),
    [loaded, setLoaded] = useState(false),
    [drag, setDrag] = useState<number | null>(null);
  useEffect(() => {
    try {
      setCoupons(JSON.parse(localStorage.getItem("tb_admin_coupons") || "[]"));
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded)
      localStorage.setItem("tb_admin_coupons", JSON.stringify(coupons));
  }, [coupons, loaded]);
  useEffect(() => {
    if (!uploads.some((u) => u.progress < 110)) return;
    const id = setInterval(
      () =>
        setUploads((us) =>
          us.map((u) => ({ ...u, progress: Math.min(110, u.progress + 10) })),
        ),
      450,
    );
    return () => clearInterval(id);
  }, [uploads]);
  if (s.role !== "admin")
    return (
      <section className="section narrow">
        <Heading
          eyebrow="BEHIND THE COUNTER"
          title="The studio’s little control room."
          description="Switch to the demo admin role to explore course building, uploads, coupons and students."
        />
        <button
          className="btn"
          onClick={() => set((x) => ({ ...x, role: "admin" }))}
        >
          Enter demo admin <ArrowUp size={16} />
        </button>
        <p className="muted">A presentation role, not a secure admin login.</p>
      </section>
    );
  function save() {
    if (!edit.title.trim()) {
      toast("Give your course a title first.");
      return;
    }
    set((x) => ({
      ...x,
      courses: x.courses.some((c) => c.id === edit.id)
        ? x.courses.map((c) => (c.id === edit.id ? edit : c))
        : [...x.courses, edit],
    }));
    toast("Course saved in this browser");
  }
  function reorder(from: number, to: number) {
    if (to < 0 || to >= edit.phases.length || from === to) return;
    const phases = [...edit.phases];
    const [p] = phases.splice(from, 1);
    phases.splice(to, 0, p);
    setEdit({ ...edit, phases });
  }
  function files(list: FileList | null) {
    if (!list) return;
    const valid = Array.from(list).filter((f) => f.type.startsWith("video/"));
    if (valid.length !== list.length)
      toast("Choose video files for the upload simulation.");
    setUploads((u) => [
      ...u,
      ...valid.map((f) => ({ name: f.name, progress: 0 })),
    ]);
    if (valid.length)
      toast("Upload simulation started. Files stay on your device.");
  }
  const chart = [
    { month: "Jun", revenue: 18000 },
    { month: "Jul", revenue: 29000 },
    { month: "Aug", revenue: 24000 },
    { month: "Sep", revenue: 47000 },
    { month: "Oct", revenue: 58000 },
    { month: "Nov", revenue: 69000 },
  ];
  return (
    <section className="section admin">
      <div className="row between">
        <Heading
          eyebrow="A LITTLE BEHIND-THE-SCENES MAGIC"
          title="Hello, Tasty Bite."
          description="Your studio at a glance. All figures and actions are demo data."
        />
        <span className="demo-chip">Owner demo</span>
      </div>
      <div className="tabs">
        {[
          "Overview",
          "Course builder",
          "Video uploads",
          "Coupons",
          "Students",
          "Reels",
        ].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={tab === t ? "selected" : ""}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "Reels" ? (
        <ReelsAdmin />
      ) : tab === "Overview" ? (
        <>
          <div className="four-grid stat-grid">
            {[
              [
                IndianRupee,
                "Revenue",
                money(246000 + s.orders.reduce((n, o) => n + o.total, 0)),
              ],
              [ShoppingBag, "Orders", String(143 + s.orders.length)],
              [Users, "Students", "286"],
              [Award, "Completion rate", "72%"],
            ].map(([Icon, label, v]) => {
              const I = Icon as typeof Users;
              return (
                <div className="panel" key={String(label)}>
                  <I />
                  <strong>{String(v)}</strong>
                  <span>{String(label)} · demo</span>
                </div>
              );
            })}
          </div>
          <div className="two-grid">
            <div className="panel chart">
              <h3>A growing little kitchen</h3>
              <p className="small muted">Illustrative monthly revenue · INR</p>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chart}>
                  <XAxis dataKey="month" />
                  <YAxis width={55} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#a74660"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="panel chart">
              <h3>Most-loved courses</h3>
              <ResponsiveContainer width="100%" height={285}>
                <BarChart
                  data={s.courses
                    .slice(0, 4)
                    .map((c) => ({ name: c.category, students: c.students }))}
                >
                  <XAxis dataKey="name" />
                  <YAxis width={40} />
                  <Tooltip />
                  <Bar
                    dataKey="students"
                    fill="#9aa87d"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <h2>Recent orders</h2>
          <div className="table-wrap panel">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Learner</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {s.orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>Demo baker</td>
                    <td>{money(o.total)}</td>
                    <td>Completed · mock</td>
                  </tr>
                ))}
                {["Aanya", "Meera", "Riya"].map((n, i) => (
                  <tr key={n}>
                    <td>TB-DEMO-10{i}</td>
                    <td>{n}</td>
                    <td>{money(1499 + i * 500)}</td>
                    <td>Sample order</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : tab === "Course builder" ? (
        <>
          <div className="row wrap builder-actions">
            <select
              aria-label="Select course to edit"
              value={selected}
              onChange={(e) => {
                setSelected(e.target.value);
                setEdit(s.courses.find((c) => c.id === e.target.value)!);
              }}
            >
              {s.courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            <button
              className="btn outline"
              onClick={() => {
                const id = `new-bake-${Date.now()}`;
                const c: Course = {
                  ...s.courses[0],
                  id,
                  title: "A lovely new course",
                  description: "Your next delicious idea.",
                  price: 999,
                  status: "draft",
                  phases: [],
                };
                set((x) => ({ ...x, courses: [...x.courses, c] }));
                setSelected(id);
                setEdit(c);
              }}
            >
              <Plus size={16} />
              New course
            </button>
          </div>
          <div className="detail-grid">
            <div className="panel">
              <label>
                Course title
                <input
                  value={edit.title}
                  onChange={(e) => setEdit({ ...edit, title: e.target.value })}
                />
              </label>
              <label>
                Description
                <textarea
                  value={edit.description}
                  onChange={(e) =>
                    setEdit({ ...edit, description: e.target.value })
                  }
                />
              </label>
              <div className="three-grid">
                <label>
                  Price (INR)
                  <input
                    type="number"
                    min={0}
                    value={edit.price}
                    onChange={(e) =>
                      setEdit({
                        ...edit,
                        price: Math.max(0, Number(e.target.value)),
                      })
                    }
                  />
                </label>
                <label>
                  Category
                  <select
                    value={edit.category}
                    onChange={(e) =>
                      setEdit({ ...edit, category: e.target.value })
                    }
                  >
                    {["Cakes", "Cookies", "Macarons", "Breads", "Frosting"].map(
                      (x) => (
                        <option key={x}>{x}</option>
                      ),
                    )}
                  </select>
                </label>
                <label>
                  Status
                  <select
                    value={edit.status}
                    onChange={(e) =>
                      setEdit({
                        ...edit,
                        status: e.target.value as Course["status"],
                      })
                    }
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </label>
              </div>
              <h3>Phases & lessons</h3>
              <p className="small muted">
                Drag phases to reorder, or use the arrow buttons.
              </p>
              {edit.phases.map((p, i) => (
                <div
                  className="builder-phase"
                  key={i}
                  draggable
                  onDragStart={() => setDrag(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (drag !== null) reorder(drag, i);
                    setDrag(null);
                  }}
                >
                  <div className="row">
                    <GripVertical size={18} />
                    <input
                      aria-label={`Phase ${i + 1} title`}
                      value={p.title}
                      onChange={(e) =>
                        setEdit({
                          ...edit,
                          phases: edit.phases.map((v, j) =>
                            j === i ? { ...v, title: e.target.value } : v,
                          ),
                        })
                      }
                    />
                    <button
                      className="icon-btn"
                      aria-label="Move phase up"
                      onClick={() => reorder(i, i - 1)}
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      className="icon-btn"
                      aria-label="Move phase down"
                      onClick={() => reorder(i, i + 1)}
                    >
                      <ArrowDown size={16} />
                    </button>
                    <button
                      className="icon-btn"
                      aria-label="Delete phase"
                      onClick={() =>
                        setEdit({
                          ...edit,
                          phases: edit.phases.filter((_, j) => j !== i),
                        })
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {p.lessons.map((l, j) => (
                    <div key={l.id} className="builder-lesson">
                      <input
                        aria-label="Lesson title"
                        value={l.title}
                        onChange={(e) =>
                          setEdit({
                            ...edit,
                            phases: edit.phases.map((v, k) =>
                              k === i
                                ? {
                                    ...v,
                                    lessons: v.lessons.map((a, b) =>
                                      b === j
                                        ? { ...a, title: e.target.value }
                                        : a,
                                    ),
                                  }
                                : v,
                            ),
                          })
                        }
                      />
                      <label className="check-label">
                        <input
                          type="checkbox"
                          checked={l.preview}
                          onChange={(e) =>
                            setEdit({
                              ...edit,
                              phases: edit.phases.map((v, k) =>
                                k === i
                                  ? {
                                      ...v,
                                      lessons: v.lessons.map((a, b) =>
                                        b === j
                                          ? { ...a, preview: e.target.checked }
                                          : a,
                                      ),
                                    }
                                  : v,
                              ),
                            })
                          }
                        />
                        Free preview
                      </label>
                      <button
                        className="icon-btn"
                        aria-label="Delete lesson"
                        onClick={() =>
                          setEdit({
                            ...edit,
                            phases: edit.phases.map((v, k) =>
                              k === i
                                ? {
                                    ...v,
                                    lessons: v.lessons.filter(
                                      (_, b) => b !== j,
                                    ),
                                  }
                                : v,
                            ),
                          })
                        }
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                  <button
                    className="text-btn"
                    onClick={() =>
                      setEdit({
                        ...edit,
                        phases: edit.phases.map((v, k) =>
                          k === i
                            ? {
                                ...v,
                                lessons: [
                                  ...v.lessons,
                                  {
                                    id: `lesson-${Date.now()}`,
                                    title: "A new little lesson",
                                    duration: 420,
                                    preview: false,
                                  },
                                ],
                              }
                            : v,
                        ),
                      })
                    }
                  >
                    <Plus size={15} />
                    Add lesson
                  </button>
                </div>
              ))}
              <div className="row between">
                <button
                  className="btn outline"
                  onClick={() =>
                    setEdit({
                      ...edit,
                      phases: [
                        ...edit.phases,
                        { title: "A new phase", lessons: [] },
                      ],
                    })
                  }
                >
                  <Plus size={16} />
                  Add phase
                </button>
                <button className="btn" onClick={save}>
                  Save course <Check size={17} />
                </button>
              </div>
            </div>
            <aside>
              <span className="eyebrow">LIVE CARD PREVIEW</span>
              <div className="course-card">
                <div className="course-art" style={{ background: edit.color }}>
                  <Bake kind={edit.kind} />
                </div>
                <div className="course-info">
                  <span className="eyebrow">{edit.status}</span>
                  <h3>{edit.title}</h3>
                  <p>{edit.description}</p>
                  <strong>{money(edit.price)}</strong>
                  <p>{allLessons(edit).length} lessons</p>
                </div>
              </div>
            </aside>
          </div>
        </>
      ) : tab === "Video uploads" ? (
        <>
          <div
            className="upload-zone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              files(e.dataTransfer.files);
            }}
          >
            <Upload size={42} />
            <h2>Drop a little kitchen magic here.</h2>
            <p>Simulated upload only. No file leaves your computer.</p>
            <label className="btn">
              Choose video files
              <input
                type="file"
                accept="video/*"
                multiple
                className="sr-only"
                onChange={(e) => files(e.target.files)}
              />
            </label>
          </div>
          {uploads.map((u, i) => (
            <div className="panel upload-item" key={`${u.name}-${i}`}>
              <div className="row between">
                <strong>{u.name}</strong>
                <span>
                  {u.progress < 100
                    ? `Uploading ${u.progress}%`
                    : u.progress < 110
                      ? "Processing…"
                      : "✓ Ready"}
                </span>
              </div>
              <progress value={Math.min(u.progress, 100)} max={100} />
            </div>
          ))}
        </>
      ) : tab === "Coupons" ? (
        <div className="two-grid">
          <form
            className="panel"
            onSubmit={(e) => {
              e.preventDefault();
              const d = new FormData(e.currentTarget);
              const code = String(d.get("code")).trim().toUpperCase();
              if (
                coupons.some((c) => c.code === code) ||
                ["WELCOME10", "BAKE500"].includes(code)
              ) {
                toast("That coupon code already exists.");
                return;
              }
              const type = String(d.get("type")),
                value = Number(d.get("value"));
              if (type === "percent" && value > 100) {
                toast("Percentage discounts cannot exceed 100.");
                return;
              }
              setCoupons((x) => [
                ...x,
                {
                  code,
                  type,
                  value,
                  expiry: String(d.get("expiry")),
                  limit: Number(d.get("limit")),
                  active: true,
                },
              ]);
              toast("Demo coupon saved");
              e.currentTarget.reset();
            }}
          >
            <h3>A sweet little offer</h3>
            <label>
              Code
              <input
                required
                name="code"
                pattern="[A-Za-z0-9]{3,20}"
                placeholder="SWEET20"
              />
            </label>
            <label>
              Discount type
              <select name="type">
                <option value="percent">Percentage</option>
                <option value="flat">Flat INR</option>
              </select>
            </label>
            <label>
              Value
              <input required type="number" name="value" min={1} />
            </label>
            <label>
              Expiry
              <input
                required
                name="expiry"
                type="date"
                min={new Date().toISOString().slice(0, 10)}
              />
            </label>
            <label>
              Usage limit
              <input required type="number" name="limit" min={1} />
            </label>
            <button className="btn">Create demo coupon</button>
            <p className="muted small">
              Custom coupons demonstrate management only. Checkout accepts
              WELCOME10 and BAKE500.
            </p>
          </form>
          <div>
            <div className="panel">
              <h3>WELCOME10 · 10%</h3>
              <p>BAKE500 · ₹500 off</p>
              <small>Built-in checkout demo codes</small>
            </div>
            {coupons.map((c, i) => (
              <div className="panel coupon-card" key={c.code}>
                <div className="row between">
                  <h3>{c.code}</h3>
                  <label className="check-label">
                    <input
                      type="checkbox"
                      checked={c.active}
                      onChange={() =>
                        setCoupons((x) =>
                          x.map((v, j) =>
                            j === i ? { ...v, active: !v.active } : v,
                          ),
                        )
                      }
                    />
                    {c.active ? "Active" : "Inactive"}
                  </label>
                </div>
                <p>
                  {c.type === "percent" ? `${c.value}%` : money(c.value)} off ·
                  expires {c.expiry}
                </p>
                <small>0 / {c.limit} demo uses</small>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <label className="search">
            <Users size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search demo students"
              aria-label="Search students"
            />
          </label>
          <div className="table-wrap panel">
            <table>
              <thead>
                <tr>
                  <th>Learner</th>
                  <th>Course</th>
                  <th>Access</th>
                </tr>
              </thead>
              <tbody>
                {["Demo baker", "Aanya", "Meera", "Riya"]
                  .filter((n) => n.toLowerCase().includes(query.toLowerCase()))
                  .map((n, i) => (
                    <tr key={n}>
                      <td>
                        {n}
                        <small className="block">
                          {i === 0
                            ? "demo.baker@example.com"
                            : "Sample learner"}
                        </small>
                      </td>
                      <td>{s.courses[0].title}</td>
                      <td>
                        {i === 0 ? (
                          <button
                            className="btn outline"
                            onClick={() => {
                              set((x) => ({
                                ...x,
                                owned: x.owned.includes(s.courses[0].id)
                                  ? x.owned.filter(
                                      (id) => id !== s.courses[0].id,
                                    )
                                  : [...x.owned, s.courses[0].id],
                              }));
                              toast("Demo learner access updated");
                            }}
                          >
                            {s.owned.includes(s.courses[0].id)
                              ? "Revoke access"
                              : "Grant access"}
                          </button>
                        ) : (
                          <StudentAccess />
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {!["Demo baker", "Aanya", "Meera", "Riya"].some((n) =>
              n.toLowerCase().includes(query.toLowerCase()),
            ) && <p>No students found.</p>}
          </div>
        </>
      )}
    </section>
  );
}
function StudentAccess() {
  const [has, setHas] = useState(true);
  const { toast } = useStore();
  return (
    <button
      className="btn outline"
      onClick={() => {
        setHas(!has);
        toast("Sample learner access updated for this session");
      }}
    >
      {has ? "Revoke access" : "Grant access"}
    </button>
  );
}
