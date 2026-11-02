"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { StartupLoader, CourseSkeletons, DashboardSkeleton } from "./loading";
import { usePathname, useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  Menu,
  Moon,
  Play,
  Search,
  ShoppingBag,
  Star,
  Sun,
  Trash2,
  X,
  ChefHat,
  BookOpen,
  ShieldCheck,
  Sparkles,
  Award,
  Users,
} from "lucide-react";
import Instagram from "./instagram-icon";
import { Course, faqs, testimonials } from "@/data/courses";
import { Provider, useStore, money, allLessons } from "./store";
import { Bake, Heading, Modal, Reveal } from "./ui";
import ConsentUI, { cookieRows } from "./consent";
import Player from "./player";
import Admin from "./admin";
import BakingStory from "./baking-story";
import StudioFilm from "./studio-film";
import Reels from "./reels";
import Offers from "./offers";
import { WelcomeMacarons } from "./macaron-rain";
import HeroArtwork, { HeroTitle } from "./hero-art";
import Portfolio, { PhotoGallery, CourseVisual } from "./portfolio";
export default function Studio() {
  return (
    <Provider>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </Provider>
  );
}
function App() {
  const path = usePathname();
  const router = useRouter();
  const { s, set, toast, notice, ready, event, setConsentOpen } = useStore();
  const [menu, setMenu] = useState(false),
    [cartOpen, setCartOpen] = useState(false),
    [roleOpen, setRoleOpen] = useState(false),
    [burst, setBurst] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    setMenu(false);
    event(`page_view ${path}`);
    event("demo_campaign", "marketing");
  }, [path, event]);
  const add = (c: Course) => {
    if (s.owned.includes(c.id)) {
      router.push(`/learn/${c.id}/${allLessons(c)[0].id}`);
      return;
    }
    set((x) => ({
      ...x,
      cart: x.cart.includes(c.id) ? x.cart : [...x.cart, c.id],
    }));
    toast(`${c.title} added to your bag`);
    setCartOpen(true);
  };
  const closeCart = useCallback(() => setCartOpen(false), []);
  const closeRole = useCallback(() => setRoleOpen(false), []);
  let content: React.ReactNode;
  const parts = path.split("/").filter(Boolean);
  const course = s.courses.find((c) => c.id === parts[1]);
  if (path === "/")
    content = (
      <Home
        add={add}
        celebrate={() => {
          setBurst(true);
          setTimeout(() => setBurst(false), 1400);
        }}
      />
    );
  else if (path === "/courses") content = <Catalog add={add} />;
  else if (parts[0] === "courses" && course)
    content = <Detail c={course} add={add} />;
  else if (parts[0] === "learn" && course)
    content = ready ? (
      <Player key={parts[2]} course={course} lessonId={parts[2]} />
    ) : (
      <div className="section skeleton" />
    );
  else if (path === "/dashboard") content = <Dashboard />;
  else if (path === "/cart")
    content = (
      <>
        <Heading eyebrow="Your next chapter" title="The baking bag" />
        <Cart />
      </>
    );
  else if (path === "/checkout")
    content = (
      <Checkout
        celebrate={() => {
          setBurst(true);
          setTimeout(() => setBurst(false), 1600);
        }}
      />
    );
  else if (parts[0] === "receipt") content = <Receipt id={parts[1]} />;
  else if (path === "/login" || path === "/signup")
    content = <Auth signup={path === "/signup"} />;
  else if (path === "/admin") content = <Admin />;
  else if (path === "/about") content = <About />;
  else if (path === "/contact") content = <Contact />;
  else if (
    ["/privacy", "/terms", "/refund-policy", "/cookie-policy"].includes(path)
  )
    content = <Policy path={path} />;
  else
    content = (
      <div className="empty">
        <Bake kind="cookie" />
        <h1>Oops. A little overbaked.</h1>
        <p>That page wandered out of the kitchen.</p>
        <Link className="btn" href="/">
          Back home
        </Link>
      </div>
    );
  return (
    <>
      <StartupLoader />
      <WelcomeMacarons />
      <header>
        <div className="header-inner">
          <Link
            className="brand"
            href="/"
            aria-label="Tasty Bite Baking Studio home"
          >
            <img
              className="brand-logo"
              src="/brand/logo-white.png"
              alt=""
              aria-hidden="true"
            />
            <span>
              TASTY BITE<small>BAKING STUDIO</small>
            </span>
          </Link>
          <nav
            className={menu ? "nav open" : "nav"}
            aria-label="Main navigation"
          >
            {[
              ["/", "Home"],
              ["/courses", "Our courses"],
              ["/about", "Meet Tasty Bite"],
              ["/contact", "Say hello"],
            ].map(([url, label]) => (
              <Link
                className={path === url ? "active" : ""}
                key={url}
                href={url}
              >
                {label}
              </Link>
            ))}
            <Link className="mobile-only" href="/dashboard">
              My learning
            </Link>
          </nav>
          <div className="header-actions">
            <a
              className="icon-btn instagram-header"
              href="https://www.instagram.com/tasty_bite_baking_studio/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Tasty Bite Baking Studio on Instagram"
            >
              <Instagram size={18} />
            </a>
            <button className="demo-chip" onClick={() => setRoleOpen(true)}>
              Demo · {s.role}
              <span>⌄</span>
            </button>
            <button
              className="icon-btn"
              aria-label="Toggle colour theme"
              onClick={() =>
                set((x) => ({
                  ...x,
                  theme: x.theme === "dark" ? "light" : "dark",
                }))
              }
            >
              {s.theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <button
              className="icon-btn bag-button"
              aria-label={`Open bag, ${s.cart.length} courses`}
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag size={20} />
              {s.cart.length > 0 && (
                <span className="bag-count">{s.cart.length}</span>
              )}
            </button>
            <Link
              href={s.role === "visitor" ? "/login" : "/dashboard"}
              className="header-login"
            >
              {s.role === "visitor" ? "Start learning" : "My learning"}
              <ArrowUpRight size={17} />
            </Link>
            <button
              className="icon-btn mobile-only"
              aria-label="Toggle navigation"
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <main id="main">
        <AnimatePresence mode="wait">
          <motion.div
            key={path}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {content}
          </motion.div>
        </AnimatePresence>
      </main>
      <footer>
        <div className="footer-top">
          <div>
            <Link className="footer-wordmark" href="/">
              Tasty Bite<span>Baking Studio</span>
            </Link>
            <p>
              Made with patience, a pinch of curiosity,
              <br />
              and a whole lot of heart.
            </p>
            <a
              className="instagram-footer"
              href="https://www.instagram.com/tasty_bite_baking_studio/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={18} />
              <span>@tasty_bite_baking_studio</span>
            </a>
          </div>
          <div>
            <strong>Find your way</strong>
            <Link href="/courses">Our courses</Link>
            <Link href="/about">Our story</Link>
            <Link href="/contact">Say hello</Link>
            <Link href="/dashboard">My learning</Link>
          </div>
          <div>
            <strong>The small print</strong>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms of use</Link>
            <Link href="/refund-policy">Refund policy</Link>
            <Link href="/cookie-policy">Cookie policy</Link>
            <button className="text-btn" onClick={() => setConsentOpen(true)}>
              Cookie settings
            </button>
          </div>
          <div className="footer-note">
            <Heart size={28} />
            <p>
              From Tasty Bite’s kitchen
              <br />
              to yours.
            </p>
            <small>India · Online, everywhere</small>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Tasty Bite Baking Studio</span>
          <Link href="/admin">Studio admin ↗</Link>
        </div>
      </footer>
      <ConsentUI />
      {notice && (
        <motion.div
          role="status"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="toast"
        >
          <Check size={19} />
          {notice.text}
          {notice.undo && <button onClick={notice.undo}>Undo</button>}
        </motion.div>
      )}
      {cartOpen && (
        <Modal title="Your baking bag" close={closeCart}>
          <Cart close={closeCart} />
        </Modal>
      )}
      {roleOpen && (
        <Modal title="Take a look around" close={closeRole}>
          <p>This is a browser-only demo. Choose a role to explore.</p>
          {(["visitor", "learner", "admin"] as const).map((role) => (
            <button
              className="role-option"
              key={role}
              onClick={() => {
                set((x) => ({ ...x, role }));
                setRoleOpen(false);
                router.push(
                  role === "admin"
                    ? "/admin"
                    : role === "learner"
                      ? "/dashboard"
                      : "/",
                );
                toast(`Switched to demo ${role}`);
              }}
            >
              <span className="capitalize">{role}</span>
              <ArrowRight size={18} />
            </button>
          ))}
        </Modal>
      )}
      {burst && !reduced && (
        <div className="confetti" aria-hidden="true">
          {Array.from({ length: 45 }, (_, i) => (
            <i
              key={i}
              style={{
                left: `${(i * 37) % 100}%`,
                background: ["#cf6378", "#e9b853", "#a4b187"][i % 3],
                animationDelay: `${(i % 8) * 0.04}s`,
                transform: `rotate(${i * 17}deg)`,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
function CourseCard({ c, add }: { c: Course; add: (c: Course) => void }) {
  const { s } = useStore();
  return (
    <Reveal className="course-card" layout interactive>
      <Link
        href={`/courses/${c.id}`}
        className="course-art"
        style={{ background: c.color }}
      >
        <span className="course-badge">{c.category}</span>
        <CourseVisual c={c} />
        <span className="art-arrow">
          <ArrowUpRight />
        </span>
      </Link>
      <div className="course-info">
        <div className="row between small">
          <span className="rating">
            <Star size={14} fill="currentColor" />
            {c.rating} <span>({c.students})</span>
          </span>
          <span>{allLessons(c).length} lessons · At your pace</span>
        </div>
        <Link href={`/courses/${c.id}`}>
          <h3>{c.title}</h3>
        </Link>
        <p>{c.description}</p>
        <div className="row between course-bottom">
          <strong>{money(c.price)}</strong>
          <button className="text-btn" onClick={() => add(c)}>
            {s.owned.includes(c.id)
              ? "Continue learning"
              : s.cart.includes(c.id)
                ? "In your bag"
                : "Start baking"}{" "}
            <ArrowUpRight size={17} />
          </button>
        </div>
      </div>
    </Reveal>
  );
}
function Home({
  add,
  celebrate,
}: {
  add: (c: Course) => void;
  celebrate: () => void;
}) {
  const { s, set, toast } = useStore();
  const [idx, setIdx] = useState(0),
    [review, setReview] = useState(0);
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <Reveal>
            <HeroTitle />
            <p>
              From your first fluffy sponge to your signature bake.
              <br className="desktop-only" /> Learn with Tasty Bite, one
              delicious little step at a time.
            </p>
            <div className="row wrap hero-buttons">
              <Link className="btn" href="/courses" onClick={celebrate}>
                Find your first bake <ArrowUpRight size={19} />
              </Link>
              <Link
                className="play-link"
                href={`/learn/eggless-cakes/eggless-cakes-0-0`}
              >
                <span>
                  <Play size={16} fill="currentColor" />
                </span>
                Peek inside a class
              </Link>
            </div>
            <div className="social-proof">
              <div className="avatars">
                <i>A</i>
                <i>M</i>
                <i>R</i>
                <i>K</i>
              </div>
              <div>
                <div className="stars">★★★★★</div>
                <small>A growing kitchen of happy bakers</small>
              </div>
            </div>
          </Reveal>
        </div>
        <HeroArtwork />
      </section>
      <div className="values-strip">
        <span>
          <BookOpen size={20} />
          Bite-sized lessons
        </span>
        <span>
          <Heart size={20} />
          Made for home kitchens
        </span>
        <span>
          <Clock size={20} />
          Your pace, your place
        </span>
        <span>
          <ChefHat size={20} />
          Taught with a little love
        </span>
      </div>
      <BakingStory />
      <Offers />
      <Portfolio />
      <Reels />
      <section className="section">
        <Reveal className="section-title row between">
          <div>
            <span className="eyebrow">A RECIPE FOR SOMETHING NEW</span>
            <h2>What will you bake next?</h2>
          </div>
          <div className="row">
            <button
              className="circle-btn"
              aria-label="Previous courses"
              onClick={() => setIdx((idx + 3) % 4)}
            >
              <ChevronLeft />
            </button>
            <button
              className="circle-btn"
              aria-label="Next courses"
              onClick={() => setIdx((idx + 1) % 4)}
            >
              <ChevronRight />
            </button>
            <Link className="text-btn desktop-only" href="/courses">
              All courses <ArrowUpRight size={18} />
            </Link>
          </div>
        </Reveal>
        <div className="course-grid">
          {s.courses
            .filter((c) => c.status === "published")
            .slice(idx, idx + 3)
            .map((c) => (
              <CourseCard key={c.id} c={c} add={add} />
            ))}
        </div>
      </section>
      <section className="how section">
        <Reveal className="section-title centered">
          <span className="eyebrow">NO PERFECT KITCHEN REQUIRED</span>
          <h2>
            Just you, your oven,
            <br />
            and a little curiosity.
          </h2>
        </Reveal>
        <div className="three-grid">
          {[
            [
              Search,
              "01",
              "Find your flavour",
              "Pick a course that makes you want to put your apron on.",
            ],
            [
              Play,
              "02",
              "Make a little time",
              "Watch clear, thoughtful lessons, whenever life allows.",
            ],
            [
              Sparkles,
              "03",
              "Bake something yours",
              "Follow along, experiment, and enjoy every delicious little win.",
            ],
          ].map(([Icon, n, title, body]) => {
            const I = Icon as typeof Search;
            return (
              <Reveal key={String(n)} className="how-card">
                <div className="row between">
                  <I size={30} />
                  <span>{String(n)}</span>
                </div>
                <h3>{String(title)}</h3>
                <p>{String(body)}</p>
              </Reveal>
            );
          })}
        </div>
      </section>
      <section className="section instructor">
        <Reveal className="instructor-art studio-logo-panel">
          <img
            className="studio-logo-image"
            src="/brand/logo-white.png"
            alt="Tasty Bite Baking Studio"
            width={350}
            height={350}
          />
        </Reveal>
        <Reveal>
          <span className="eyebrow">THE HEART BEHIND THE OVEN</span>
          <h2>
            Welcome to Tasty Bite.
            <br />
            <em>Let’s make something lovely.</em>
          </h2>
          <p>
            We believe baking is a little bit of science, a little bit of art,
            and a whole lot of heart. And you don’t need a fancy kitchen to get
            started.
          </p>
          <p>
            These classes bring the warmth of our studio into your home, with
            the small tips and patient explanations that make all the
            difference.
          </p>
          <Link className="btn outline" href="/about">
            A little more about the studio <ArrowUpRight size={18} />
          </Link>
          <small className="block muted">
            Demo introduction · Final studio story to follow
          </small>
        </Reveal>
      </section>
      <section className="testimonial section centered">
        <span className="eyebrow">HAPPY OVENS, HAPPIER PEOPLE</span>
        <h2>A little love from the kitchen.</h2>
        <div className="stars">★★★★★</div>
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={review}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            “{testimonials[review][2]}”
          </motion.blockquote>
        </AnimatePresence>
        <strong>{testimonials[review][0]}</strong>
        <p>{testimonials[review][1]} · Sample learner story</p>
        <div className="row justify-center">
          <button
            className="circle-btn"
            aria-label="Previous testimonial"
            onClick={() => setReview((review + 11) % 12)}
          >
            <ChevronLeft />
          </button>
          <button
            className="circle-btn"
            aria-label="Next testimonial"
            onClick={() => setReview((review + 1) % 12)}
          >
            <ChevronRight />
          </button>
        </div>
      </section>
      <section className="section faq">
        <div>
          <span className="eyebrow">A FEW THINGS YOU MIGHT WONDER</span>
          <h2>
            Before you
            <br />
            preheat the oven.
          </h2>
          <p>
            Still have a question?
            <br />
            <Link className="text-btn" href="/contact">
              We’re happy to help ↗
            </Link>
          </p>
        </div>
        <div>
          {faqs.map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span>+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="newsletter section">
        <div>
          <span className="eyebrow">A LITTLE SOMETHING SWEET</span>
          <h2>
            Good things, fresh
            <br />
            from our kitchen.
          </h2>
          <p>Recipes, baking notes and first dibs on new classes.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast("You’re on the demo list! No email was sent.");
            e.currentTarget.reset();
          }}
        >
          <label htmlFor="newsletter">Your email address</label>
          <div className="row">
            <input
              required
              type="email"
              id="newsletter"
              placeholder="you@something.lovely"
            />
            <button className="circle-btn" aria-label="Join newsletter">
              <ArrowRight />
            </button>
          </div>
          <small>No spam. Just the occasional sweet thing.</small>
        </form>
      </section>
      {s.welcome && s.consent?.preferences && (
        <div className="welcome-offer">
          <button
            className="icon-btn"
            aria-label="Dismiss welcome offer"
            onClick={() => {
              document.cookie =
                "tb_offer=dismissed; Max-Age=2592000; Path=/; SameSite=Lax";
              set((x) => ({ ...x, welcome: false }));
            }}
          >
            <X size={16} />
          </button>
          <strong>Your first bake, a little sweeter.</strong>
          <p>Use WELCOME10 for 10% off your demo order.</p>
        </div>
      )}
    </>
  );
}
function Catalog({ add }: { add: (c: Course) => void }) {
  const { s, ready } = useStore();
  const [cat, setCat] = useState("All bakes"),
    [q, setQ] = useState(""),
    [sort, setSort] = useState("popular");
  const list = s.courses
    .filter(
      (c) =>
        c.status === "published" &&
        (cat === "All bakes" || cat === c.category) &&
        `${c.title} ${c.description}`.toLowerCase().includes(q.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "price"
        ? a.price - b.price
        : sort === "newest"
          ? b.id.localeCompare(a.id)
          : b.students - a.students,
    );
  return (
    <section className="section">
      <Heading
        eyebrow="YOUR KITCHEN. YOUR NEXT CHAPTER."
        title="A little class. A lot of possibility."
        description="Thoughtful lessons, tried-and-loved recipes, and a seat at Tasty Bite’s kitchen table."
      />
      <div className="catalog-toolbar">
        <div className="chips">
          {[
            "All bakes",
            "Cakes",
            "Cookies",
            "Macarons",
            "Breads",
            "Frosting",
          ].map((c) => (
            <button
              key={c}
              className={cat === c ? "chip selected" : "chip"}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="row wrap">
          <label className="search">
            <Search size={18} />
            <input
              aria-label="Search courses"
              placeholder="Find your next bake"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
          <select
            aria-label="Sort courses"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="popular">Most loved</option>
            <option value="newest">Newest</option>
            <option value="price">Price: low to high</option>
          </select>
        </div>
      </div>
      <p className="muted small">{list.length} lovely ways to get started</p>
      {!ready ? (
        <div role="status" aria-label="Loading courses" aria-busy="true">
          <CourseSkeletons />
        </div>
      ) : (
        <motion.div layout className="course-grid">
          {list.map((c) => (
            <CourseCard key={c.id} c={c} add={add} />
          ))}
        </motion.div>
      )}
      {!list.length && (
        <div className="empty">
          <Search />
          <h3>No bakes found just yet.</h3>
          <button
            className="btn outline"
            onClick={() => {
              setQ("");
              setCat("All bakes");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
function Detail({ c, add }: { c: Course; add: (c: Course) => void }) {
  const { s } = useStore();
  return (
    <section className="section">
      <Link href="/courses" className="text-btn">
        ← All courses
      </Link>
      <div className="detail-grid">
        <div>
          <span className="eyebrow">{c.category} · BEGINNER FRIENDLY</span>
          <h1>{c.title}</h1>
          <p className="lead">{c.description}</p>
          <div className="row wrap small">
            <span className="rating">
              <Star size={16} fill="currentColor" /> {c.rating} · Sample reviews
            </span>
            <span>
              <Users size={16} /> {c.students} demo learners
            </span>
          </div>
          <div className="detail-art" style={{ background: c.color }}>
            <CourseVisual c={c} />
            <Link
              className="btn"
              href={`/learn/${c.id}/${allLessons(c)[0].id}`}
            >
              <Play size={16} />
              Watch a free lesson
            </Link>
          </div>
          <h2>A little confidence in every lesson.</h2>
          <div className="two-grid benefits">
            {[
              "Understand your ingredients",
              "Master core baking techniques",
              "Troubleshoot with confidence",
              "Create beautiful finishing touches",
              "Adapt flavours to your taste",
              "Price and store your bakes",
            ].map((t) => (
              <span key={t}>
                <Check size={18} />
                {t}
              </span>
            ))}
          </div>
          <h2>Inside the course</h2>
          <p>
            4 thoughtful phases. {allLessons(c).length} bite-sized lessons. Your
            own pace.
          </p>
          {c.phases.map((p, i) => (
            <details className="syllabus" key={i} open={i === 0}>
              <summary>
                <span>
                  <small>PHASE 0{i + 1}</small>
                  <strong>{p.title}</strong>
                </span>
                <ChevronRight size={20} />
              </summary>
              <div>
                {p.lessons.map((l) => (
                  <Link
                    className="lesson-row"
                    key={l.id}
                    href={`/learn/${c.id}/${l.id}`}
                  >
                    <Play size={16} />
                    <span>{l.title}</span>
                    <small>
                      {Math.round(l.duration / 60)} min{" "}
                      {l.preview
                        ? "· FREE PREVIEW"
                        : s.owned.includes(c.id)
                          ? ""
                          : "· Locked"}
                    </small>
                  </Link>
                ))}
              </div>
            </details>
          ))}
          <h2>Meet your baking friend.</h2>
          <div className="panel row">
            <div className="avatar-large">O</div>
            <div>
              <h3>Tasty Bite</h3>
              <p>
                Your instructor at Tasty Bite Baking Studio. Patient guidance,
                practical tips, and plenty of encouragement.
              </p>
              <Link href="/about" className="text-btn">
                Meet Tasty Bite ↗
              </Link>
            </div>
          </div>
          <h2>Notes from the kitchen</h2>
          <div className="review-summary">
            <strong>
              4.9<span>★★★★★</span>
            </strong>
            <div>
              {[5, 4, 3, 2, 1].map((n, i) => (
                <div key={n} className="row">
                  <small>{n} ★</small>
                  <progress max={100} value={[90, 8, 2, 0, 0][i]} />
                </div>
              ))}
            </div>
          </div>
          {testimonials.slice(0, 10).map(([name, city, text]) => (
            <div className="review" key={name}>
              <div className="row between">
                <strong>
                  {name} · {city}
                </strong>
                <span className="stars">★★★★★</span>
              </div>
              <p>{text}</p>
              <small className="muted">Illustrative demo review</small>
            </div>
          ))}
        </div>
        <aside className="purchase-card">
          <span className="eyebrow">YOUR NEXT DELICIOUS STEP</span>
          <h2>{money(c.price)}</h2>
          <p>One course. So much to create.</p>
          <button className="btn full" onClick={() => add(c)}>
            {s.owned.includes(c.id) ? "Continue learning" : "Add to baking bag"}
            <ArrowUpRight size={18} />
          </button>
          <Link
            href="/checkout"
            className="text-btn"
            onClick={() => {
              if (!s.owned.includes(c.id)) add(c);
            }}
          >
            Go to checkout →
          </Link>
          <ul>
            <li>
              <Play size={17} />
              {allLessons(c).length} step-by-step lessons
            </li>
            <li>
              <BookOpen size={17} />
              Recipe sheets & ingredient lists
            </li>
            <li>
              <Clock size={17} />
              Learn whenever you like
            </li>
            <li>
              <Award size={17} />
              Demo completion certificate
            </li>
            <li>
              <ShieldCheck size={17} />
              Mock checkout · no real charge
            </li>
          </ul>
          <p className="small muted">
            Try WELCOME10 in your bag for 10% off. Illustrative pricing; GST
            shown at checkout.
          </p>
        </aside>
      </div>
      <div className="section-title">
        <h2>A little more to love.</h2>
      </div>
      <div className="course-grid">
        {s.courses
          .filter((x) => x.id !== c.id && x.status === "published")
          .slice(0, 3)
          .map((x) => (
            <CourseCard key={x.id} c={x} add={add} />
          ))}
      </div>
    </section>
  );
}
function useTotals() {
  const { s } = useStore();
  const [code, setCode] = useState(""),
    [applied, setApplied] = useState(""),
    [error, setError] = useState("");
  useEffect(() => {
    const incoming = new URLSearchParams(location.search).get("coupon");
    if (incoming && ["WELCOME10", "BAKE500"].includes(incoming)) {
      setCode(incoming);
      setApplied(incoming);
    }
  }, []);
  const items = s.courses.filter(
    (c) => s.cart.includes(c.id) && !s.owned.includes(c.id),
  );
  const subtotal = items.reduce((n, c) => n + c.price, 0);
  const discount =
    applied === "WELCOME10"
      ? Math.round(subtotal * 0.1)
      : applied === "BAKE500"
        ? Math.min(500, subtotal)
        : 0;
  const gst = Math.round((subtotal - discount) * 0.18);
  return {
    items,
    code,
    setCode,
    applied,
    error,
    subtotal,
    discount,
    gst,
    total: subtotal - discount + gst,
    apply: () => {
      const v = code.trim().toUpperCase();
      if (["WELCOME10", "BAKE500"].includes(v)) {
        setApplied(v);
        setError("");
      } else {
        setApplied("");
        setError("Try WELCOME10 or BAKE500.");
      }
    },
  };
}
function Cart({ close }: { close?: () => void }) {
  const { set, toast } = useStore();
  const t = useTotals();
  return (
    <div className="cart-content">
      {!t.items.length ? (
        <div className="empty">
          <ShoppingBag size={42} />
          <h3>A little room for something lovely.</h3>
          <p>Your bag is waiting for its first course.</p>
          <Link className="btn" href="/courses" onClick={close}>
            Explore courses
          </Link>
        </div>
      ) : (
        <>
          {t.items.map((c) => (
            <div key={c.id} className="cart-item">
              <div style={{ background: c.color }}>
                <CourseVisual c={c} />
              </div>
              <Link href={`/courses/${c.id}`} onClick={close}>
                {c.title}
                <strong>{money(c.price)}</strong>
              </Link>
              <button
                className="icon-btn"
                aria-label={`Remove ${c.title}`}
                onClick={() => {
                  set((x) => ({
                    ...x,
                    cart: x.cart.filter((id) => id !== c.id),
                  }));
                  toast("Course removed", () =>
                    set((x) => ({
                      ...x,
                      cart: [...new Set([...x.cart, c.id])],
                    })),
                  );
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <div className="row coupon">
            <input
              aria-label="Coupon code"
              placeholder="A little discount?"
              value={t.code}
              onChange={(e) => t.setCode(e.target.value)}
            />
            <button className="btn outline" onClick={t.apply}>
              Apply
            </button>
          </div>
          {t.error && (
            <p role="alert" className="error shake">
              {t.error}
            </p>
          )}
          {t.applied && (
            <p className="success">
              {t.applied} applied. A sweet little saving.
            </p>
          )}
          <Totals t={t} />
          <Link
            className="btn full"
            href={`/checkout${t.applied ? `?coupon=${t.applied}` : ""}`}
            onClick={close}
          >
            Let’s start baking <ArrowRight size={18} />
          </Link>
          <p className="small muted centered">
            Demo checkout only. No real payment will be taken.
          </p>
        </>
      )}
    </div>
  );
}
function Totals({ t }: { t: ReturnType<typeof useTotals> }) {
  return (
    <div className="totals">
      <div>
        <span>Courses</span>
        <span>{money(t.subtotal)}</span>
      </div>
      <div>
        <span>Discount</span>
        <span>−{money(t.discount)}</span>
      </div>
      <div>
        <span>GST (illustrative 18%)</span>
        <span>{money(t.gst)}</span>
      </div>
      <div className="total">
        <strong>Total</strong>
        <strong>{money(t.total)}</strong>
      </div>
    </div>
  );
}
function Checkout({ celebrate }: { celebrate: () => void }) {
  const { set, toast, event } = useStore();
  const router = useRouter();
  const t = useTotals();
  const [step, setStep] = useState(0),
    [method, setMethod] = useState("UPI"),
    [pay, setPay] = useState(false),
    [processing, setProcessing] = useState(false),
    [fail, setFail] = useState(false),
    [failed, setFailed] = useState(false);
  const close = useCallback(() => {
    if (!processing) setPay(false);
  }, [processing]);
  async function purchase(e: React.FormEvent) {
    e.preventDefault();
    setProcessing(true);
    setFailed(false);
    await new Promise((r) => setTimeout(r, 1600));
    if (fail) {
      setProcessing(false);
      setFailed(true);
      setFail(false);
      event("payment_failed");
      return;
    }
    const id = `TB${Date.now().toString().slice(-8)}`;
    set((x) => ({
      ...x,
      role: "learner",
      owned: [...new Set([...x.owned, ...t.items.map((c) => c.id)])],
      cart: [],
      orders: [
        {
          id,
          items: t.items.map((c) => c.id),
          total: t.total,
          date: new Date().toISOString(),
        },
        ...x.orders,
      ],
    }));
    setProcessing(false);
    setPay(false);
    setStep(2);
    celebrate();
    event("purchase_success");
    toast("You’re in! Your courses are ready.");
    router.push(`/receipt/${id}`);
  }
  return (
    <section className="section narrow">
      <Heading
        eyebrow="SOMETHING LOVELY IS ABOUT TO BEGIN"
        title="Your seat at the kitchen table."
      />
      <div className="stepper">
        {["Your details", "Mock payment", "You’re in"].map((label, i) => (
          <span key={label} className={step >= i ? "current" : ""}>
            <i>{i + 1}</i>
            {label}
          </span>
        ))}
      </div>
      {!t.items.length ? (
        <div className="empty">
          <p>Your bag is empty. Find something you’d love to bake.</p>
          <Link className="btn" href="/courses">
            Explore courses
          </Link>
        </div>
      ) : (
        <div className="two-grid">
          <div className="panel">
            {step === 0 ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep(1);
                }}
              >
                <h2>A little about you</h2>
                <label>
                  Your name
                  <input
                    required
                    name="name"
                    autoComplete="name"
                    placeholder="Your lovely name"
                  />
                </label>
                <label>
                  Email address
                  <input
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                </label>
                <label>
                  Phone number
                  <input
                    required
                    type="tel"
                    pattern="[+0-9 ()-]{10,16}"
                    title="Enter a valid phone number"
                    autoComplete="tel"
                    placeholder="+91"
                  />
                </label>
                <label className="check-label">
                  <input type="checkbox" required />I understand this is a demo
                  with no real payment.
                </label>
                <button className="btn full">
                  Continue to payment <ArrowRight size={18} />
                </button>
              </form>
            ) : (
              <>
                <h2>A safe little practice run.</h2>
                <p>
                  UPI, cards, netbanking or wallets — explore the checkout
                  without spending anything.
                </p>
                <button className="btn full" onClick={() => setPay(true)}>
                  Open mock payment
                </button>
                <button className="text-btn" onClick={() => setStep(0)}>
                  ← Edit details
                </button>
              </>
            )}
          </div>
          <div className="panel">
            <h3>Your baking bag</h3>
            {t.items.map((c) => (
              <div className="row between" key={c.id}>
                <p>{c.title}</p>
                <strong>{money(c.price)}</strong>
              </div>
            ))}
            <div className="row coupon">
              <input
                aria-label="Checkout coupon"
                value={t.code}
                onChange={(e) => t.setCode(e.target.value)}
                placeholder="WELCOME10 or BAKE500"
              />
              <button className="btn outline" onClick={t.apply}>
                Apply
              </button>
            </div>
            {t.error && (
              <p role="alert" className="error">
                {t.error}
              </p>
            )}
            {t.applied && <p className="success">{t.applied} applied</p>}
            <Totals t={t} />
          </div>
        </div>
      )}
      {pay && (
        <Modal title="Tasty Bite · Mock payment" close={close}>
          <p className="muted">
            Demo only · Do not enter real payment details.
          </p>
          <strong className="payment-amount">{money(t.total)}</strong>
          <div className="chips">
            {["UPI", "Cards", "Netbanking", "Wallets"].map((m) => (
              <button
                key={m}
                className={`chip ${m === method ? "selected" : ""}`}
                onClick={() => setMethod(m)}
                disabled={processing}
              >
                {m}
              </button>
            ))}
          </div>
          <form onSubmit={purchase}>
            {method === "UPI" ? (
              <label>
                Demo UPI ID
                <input
                  required
                  pattern="[^\s@]+@[^\s@]+"
                  placeholder="demo@upi"
                />
              </label>
            ) : method === "Cards" ? (
              <>
                <label>
                  Demo card number
                  <input
                    required
                    placeholder="4242 4242 4242 4242"
                    pattern="[0-9 ]{19}"
                    maxLength={19}
                    onChange={(e) => {
                      e.target.value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 16)
                        .replace(/(.{4})/g, "$1 ")
                        .trim();
                    }}
                  />
                </label>
                <div className="two-grid">
                  <label>
                    Expiry
                    <input
                      required
                      placeholder="12/29"
                      pattern="(0[1-9]|1[0-2])/[0-9]{2}"
                    />
                  </label>
                  <label>
                    Demo CVV
                    <input
                      required
                      placeholder="123"
                      pattern="[0-9]{3}"
                      maxLength={3}
                    />
                  </label>
                </div>
              </>
            ) : (
              <label>
                {method === "Wallets" ? "Wallet" : "Bank"}
                <select required defaultValue="">
                  <option value="" disabled>
                    Select a demo provider
                  </option>
                  {(method === "Wallets"
                    ? ["PhonePe", "Paytm", "Amazon Pay"]
                    : ["SBI", "HDFC Bank", "ICICI Bank", "Axis Bank"]
                  ).map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
            )}
            <label className="check-label">
              <input
                type="checkbox"
                checked={fail}
                onChange={(e) => setFail(e.target.checked)}
                disabled={processing}
              />
              Demonstrate a failed payment first
            </label>
            {failed && (
              <p role="alert" className="error">
                That demo payment didn’t go through. Your bag is safe. Try
                again.
              </p>
            )}
            <button className="btn full" disabled={processing}>
              {processing ? (
                <>
                  <span className="spinner" />
                  Processing demo payment…
                </>
              ) : failed ? (
                "Try payment again"
              ) : (
                `Simulate payment · ${money(t.total)}`
              )}
            </button>
          </form>
        </Modal>
      )}
    </section>
  );
}
function Receipt({ id }: { id: string }) {
  const { s } = useStore();
  const o = s.orders.find((x) => x.id === id);
  return (
    <section className="section narrow">
      <div className="receipt panel">
        <div className="success-icon">
          <Check />
        </div>
        <span className="eyebrow">APRON ON. POSSIBILITIES OPEN.</span>
        <h1>You’re in the kitchen!</h1>
        <p>Your demo courses are unlocked. Let’s make something lovely.</p>
        {o ? (
          <>
            <p>
              Receipt {o.id} · {new Date(o.date).toLocaleDateString("en-IN")}
            </p>
            {o.items.map((i) => (
              <p key={i}>{s.courses.find((c) => c.id === i)?.title}</p>
            ))}
            <h2>{money(o.total)}</h2>
            <p>Mock payment · No funds transferred</p>
          </>
        ) : (
          <p>Receipt unavailable in this browser.</p>
        )}
        <div className="row wrap justify-center">
          <Link className="btn" href="/dashboard">
            Go to my courses <ArrowRight size={18} />
          </Link>
          <button className="btn outline" onClick={() => window.print()}>
            Print receipt
          </button>
        </div>
      </div>
    </section>
  );
}
function Dashboard() {
  const { s, ready } = useStore();
  const owned = s.courses.filter((c) => s.owned.includes(c.id));
  const [cert, setCert] = useState<Course | null>(null);
  const close = useCallback(() => setCert(null), []);
  return (
    <section className="section">
      <Heading
        eyebrow="YOUR LITTLE CORNER OF THE KITCHEN"
        title="Welcome back, baker."
        description="Pick up where you left off. Something lovely is waiting."
      />
      {!ready ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className="three-grid stat-grid">
            <div className="panel">
              <BookOpen />
              <strong>{owned.length}</strong>
              <span>Courses in your kitchen</span>
            </div>
            <div className="panel">
              <Check />
              <strong>
                {Object.values(s.progress).filter(Boolean).length}
              </strong>
              <span>Little lessons learned</span>
            </div>
            <div className="panel">
              <Award />
              <strong>
                {
                  owned.filter((c) =>
                    allLessons(c).every((l) => s.progress[l.id]),
                  ).length
                }
              </strong>
              <span>Certificates earned</span>
            </div>
          </div>
          <h2>Keep a good thing going.</h2>
          <div className="course-grid">
            {owned.map((c) => {
              const list = allLessons(c),
                n = list.filter((l) => s.progress[l.id]).length;
              const next = list.find((l) => !s.progress[l.id]) || list[0];
              return (
                <div className="course-card" key={c.id}>
                  <div className="course-art" style={{ background: c.color }}>
                    <CourseVisual c={c} />
                    <span
                      className="progress-ring"
                      style={{
                        background: `conic-gradient(var(--primary) ${(n / list.length) * 360}deg, #fff 0)`,
                      }}
                    >
                      <b>{Math.round((n / list.length) * 100)}%</b>
                    </span>
                  </div>
                  <div className="course-info">
                    <h3>{c.title}</h3>
                    <p>
                      {n} of {list.length} lessons completed
                    </p>
                    <Link
                      className="btn full"
                      href={`/learn/${c.id}/${next.id}`}
                    >
                      Continue learning <Play size={16} />
                    </Link>
                    <button
                      className="text-btn"
                      disabled={n !== list.length}
                      onClick={() => setCert(c)}
                    >
                      {n === list.length
                        ? "View certificate"
                        : "Certificate · Keep baking to unlock"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <h2>Recent activity</h2>
          <div className="panel">
            {Object.keys(s.progress)
              .filter((id) => s.progress[id])
              .slice(-5)
              .reverse()
              .map((id) => (
                <p key={id}>
                  ✓{" "}
                  {s.courses.flatMap(allLessons).find((l) => l.id === id)
                    ?.title || "Lesson completed"}
                </p>
              ))}
            {!Object.values(s.progress).some(Boolean) && (
              <p>Your first lesson is waiting.</p>
            )}
          </div>
          <h2>Your orders</h2>
          <div className="panel">
            {s.orders.length ? (
              s.orders.map((o) => (
                <div className="row between" key={o.id}>
                  <span>
                    {o.id} · {new Date(o.date).toLocaleDateString("en-IN")}
                  </span>
                  <Link className="text-btn" href={`/receipt/${o.id}`}>
                    {money(o.total)} · Receipt ↗
                  </Link>
                </div>
              ))
            ) : (
              <p>
                No orders yet. Your seeded demo course is already available
                above.
              </p>
            )}
          </div>
        </>
      )}
      {cert && (
        <Modal title="A delicious achievement" close={close}>
          <div className="certificate">
            <Award size={54} />
            <span className="eyebrow">TASTY BITE BAKING STUDIO</span>
            <h2>Certificate of completion</h2>
            <p>Presented to our demo baker for completing</p>
            <h3>{cert.title}</h3>
            <p>With a little patience and a whole lot of heart.</p>
            <strong>Tasty Bite</strong>
            <p>Demo certificate · {new Date().toLocaleDateString("en-IN")}</p>
          </div>
          <button className="btn" onClick={() => window.print()}>
            Print certificate
          </button>
        </Modal>
      )}
    </section>
  );
}
function Auth({ signup }: { signup: boolean }) {
  const { set, toast } = useStore();
  const router = useRouter();
  const [pass, setPass] = useState(""),
    [busy, setBusy] = useState(false);
  const strength = [
    pass.length >= 8,
    /[A-Z]/.test(pass),
    /[0-9]/.test(pass),
    /[^A-Za-z0-9]/.test(pass),
  ].filter(Boolean).length;
  const login = async () => {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 650));
    set((x) => ({ ...x, role: "learner" }));
    toast("Welcome to your demo kitchen");
    router.push("/dashboard");
  };
  return (
    <section className="auth-layout">
      <div className="auth-art">
        <Bake kind="cupcake" />
        <h2>
          A little time
          <br />
          for something you love.
        </h2>
      </div>
      <div className="auth-form">
        <span className="eyebrow">PULL UP A CHAIR</span>
        <h1>
          {signup ? "Your baking story starts here." : "Hello again, baker."}
        </h1>
        <p>Browser-only demo · Use made-up details.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void login();
          }}
        >
          {signup && (
            <label>
              Your name
              <input required autoComplete="name" />
            </label>
          )}
          <label>
            Email address
            <input
              required
              type="email"
              autoComplete="email"
              placeholder="baker@example.com"
            />
          </label>
          <label>
            Password
            <input
              required
              type="password"
              minLength={8}
              autoComplete={signup ? "new-password" : "current-password"}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="At least 8 characters"
            />
          </label>
          {signup && (
            <div>
              <progress value={strength} max={4} />
              <small>
                Password strength:{" "}
                {
                  [
                    "Add a password",
                    "Needs a little work",
                    "Getting stronger",
                    "Good",
                    "Strong",
                  ][strength]
                }
              </small>
            </div>
          )}
          <button disabled={busy} className="btn full">
            {busy
              ? "Opening your kitchen…"
              : signup
                ? "Create demo account"
                : "Sign in to demo"}
          </button>
        </form>
        <button
          className="btn outline full"
          disabled={busy}
          onClick={() => void login()}
        >
          Continue with Google · mock
        </button>
        <button className="text-btn" onClick={() => void login()}>
          One-click demo learner →
        </button>
        <p>
          {signup ? "Already have an account?" : "New to the kitchen?"}{" "}
          <Link className="text-btn" href={signup ? "/login" : "/signup"}>
            {signup ? "Sign in" : "Come on in"}
          </Link>
        </p>
        <small className="muted">No passwords are stored or sent.</small>
      </div>
    </section>
  );
}
function About() {
  return (
    <section className="section">
      <Heading
        eyebrow="A STUDIO BUILT WITH HEART"
        title="Every lovely bake starts somewhere."
        description="For Tasty Bite, it starts with sharing the joy of making something with your own two hands."
      />
      <div className="instructor">
        <div className="instructor-art studio-logo-panel">
          <img
            className="studio-logo-image"
            src="/brand/logo-white.png"
            alt="Tasty Bite Baking Studio"
            width={350}
            height={350}
          />
        </div>
        <div>
          <h2>From our kitchen to yours.</h2>
          <p className="lead">
            A welcoming space to get curious, make mistakes, and discover what
            you can create.
          </p>
          <p>
            We’re bringing the spirit of Tasty Bite Baking Studio online:
            patient guidance, thoughtful recipes, and the small details that
            turn uncertainty into confidence.
          </p>
        </div>
      </div>
      <div className="three-grid timeline">
        {[
          [
            "01",
            "A love for baking",
            "It starts with the simple joy of making something to share.",
          ],
          [
            "02",
            "A place to learn",
            "The studio becomes a kitchen for curiosity and community.",
          ],
          [
            "03",
            "A wider kitchen",
            "Online lessons bring that same warmth into your home.",
          ],
        ].map(([n, t, b]) => (
          <Reveal key={n} className="panel">
            <span className="eyebrow">{n}</span>
            <h3>{t}</h3>
            <p>{b}</p>
          </Reveal>
        ))}
      </div>
      <StudioFilm embedded />
      <div id="studio-gallery">
        <PhotoGallery />
      </div>
    </section>
  );
}
function Contact() {
  const { toast } = useStore();
  return (
    <section className="section">
      <Heading
        eyebrow="LET’S TALK BAKING"
        title="A question? A little hello?"
        description="There’s always room for a conversation in our kitchen."
      />
      <div className="two-grid">
        <form
          className="panel"
          onSubmit={(e) => {
            e.preventDefault();
            toast("Your demo message is ready. Nothing was sent.");
            e.currentTarget.reset();
          }}
        >
          <label>
            Your name
            <input required autoComplete="name" />
          </label>
          <label>
            Email address
            <input type="email" required autoComplete="email" />
          </label>
          <label>
            What’s on your mind?
            <textarea required rows={5} minLength={10} />
          </label>
          <button className="btn">
            Send a little hello <ArrowUpRight size={18} />
          </button>
          <p className="small muted">Demo form · No message is sent.</p>
        </form>
        <div className="contact-note">
          <a
            className="instagram-contact"
            href="https://www.instagram.com/tasty_bite_baking_studio/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram size={22} />
            <span>
              Follow the studio
              <br />
              <strong>@tasty_bite_baking_studio</strong>
            </span>
            <ArrowUpRight size={19} />
          </a>
          <ChefHat size={48} />
          <h2>
            Come as you are.
            <br />
            Leave a little inspired.
          </h2>
          <p>Tasty Bite Baking Studio · India</p>
          <p>
            Studio address, email, opening hours and WhatsApp contact will be
            added when confirmed.
          </p>
          <button
            className="btn outline"
            onClick={() =>
              toast(
                "WhatsApp will be connected after the studio number is provided.",
              )
            }
          >
            Chat on WhatsApp ↗
          </button>
        </div>
      </div>
    </section>
  );
}
function Policy({ path }: { path: string }) {
  const { setConsentOpen } = useStore();
  const title =
    path === "/privacy"
      ? "Privacy policy"
      : path === "/terms"
        ? "Terms of use"
        : path === "/refund-policy"
          ? "Refund policy"
          : "Cookie policy";
  return (
    <section className="section narrow policy">
      <Heading eyebrow="THE SMALL PRINT" title={title} />
      <div className="panel">
        <p>
          <strong>Demo placeholder — not final legal terms.</strong>
        </p>
        <p>
          This prototype stores information in your browser. It has no real
          account service, payment processor, external analytics, marketing
          pixels or email delivery.
        </p>
        {path === "/cookie-policy" ? (
          <>
            <h2>Storage in this demo</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    {["Name", "Category", "Purpose", "Duration", "Party"].map(
                      (h) => (
                        <th key={h}>{h}</th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {cookieRows.map((r) => (
                    <tr key={r[0]}>
                      {r.map((v) => (
                        <td key={v}>{v}</td>
                      ))}
                      <td>First party</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Analytics and marketing entries are in-memory demonstrations
              rather than stored cookies. Optional choices start off, and can be
              withdrawn at any time.
            </p>
            <button className="btn" onClick={() => setConsentOpen(true)}>
              Cookie settings
            </button>
          </>
        ) : (
          <>
            <h2>
              {path === "/refund-policy"
                ? "Purchases and cancellations"
                : path === "/privacy"
                  ? "Your information"
                  : "Using the studio"}
            </h2>
            <p>
              {path === "/refund-policy"
                ? "Demo payments do not transfer money. No real refund can be requested through this prototype. Final eligibility, timelines and support details must be confirmed before sales begin."
                : path === "/privacy"
                  ? "Demo account roles, cart, purchases, lesson notes and explicit completion records stay in this browser. Optional theme and automatic resume preferences are saved only with preference consent. Clear site data to reset your demo."
                  : "Course content, prices, access terms, certificates and reviews are illustrative. Real purchase and learning terms will be supplied before launch."}
            </p>
            <h2>Before launch</h2>
            <p>
              The owner must supply verified business and contact details,
              actual course access and refund terms, and have all policy wording
              reviewed for India’s DPDP Act and any other target regions.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
