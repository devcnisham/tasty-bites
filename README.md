# Tasty Bite Baking Studio

A mobile-first interactive demo built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, Lucide and Recharts. All accounts, purchases, uploads and payments are browser-only simulations.

## Run in Cursor

Open `D:\Desktop\tasty-bites`. Node 22+ recommended.

```sh
npm install
npm run dev
```

Visit http://localhost:3000. Validate with `npm run lint` and `npm run build`. Production: `npm run start` after building. No API keys or environment variables required.

## Explore

- `/`: main landing page, blush palette, bows, floating bakes, featured courses, instructor, testimonials, FAQ and newsletter demo.
- `/courses`, `/courses/[slug]`: search, filters, sorting, syllabus, sample reviews and free previews.
- `/cart`, `/checkout`, `/receipt/[id]`: discounts, illustrative GST, mock payment methods and printable receipts.
- `/dashboard`, `/learn/[slug]/[lessonId]`: progress, certificates, player, notes, recipe scaling and sample Q&A.
- `/admin`: charts, editable courses and lessons, phase reordering, simulated uploads, coupon management and access controls.
- `/login`, `/signup`, `/about`, `/contact` and four policy pages.

The **Demo** chip switches visitor, learner and admin roles without credentials. A learner starts with Eggless Cakes Masterclass and two completed lessons. Use made-up form details; passwords are not saved. The admin role is a presentation feature, not a security boundary.

## Logo, animation and assets

The supplied logo is preserved at `public/brand/logo-original.jpeg`. `logo-white.png` is the edited white version; the small hat and horizontal lines below BAKING STUDIO are removed. Its black raster background is composited using CSS screen blending on dark brand surfaces. It is not a transparent production vector.

`components/baking-mark.tsx` animates a large plate, spoon and fork with no loading copy. This intro runs only on the first landing-page visit per browser tab, recorded in `sessionStorage.tb_intro_seen_v3`. A close button skips it, and reduced-motion visitors skip it automatically. There are no per-page loading overlays. Separately, thirty small pastel macarons fall briefly whenever the landing page is freshly opened or refreshed; normal client navigation does not repeat the rain.

The landing page includes a pinned scroll-linked cookie sequence inspired by the supplied motion reference. A transparent stock cookie floats, tilts and scales through pastel backgrounds. Five reversible SVG bite masks progressively eat it as you scroll, with small falling crumbs. Reduced-motion visitors receive a static section. The global announcement and top progress bar were removed at the user’s request.

Stock photos from Pexels appear in the hero, course cards and staggered inspiration gallery. Gallery cards have restrained pointer tilt, light tracking and zoom; clicking opens a keyboard-accessible lightbox. See `MEDIA_CREDITS.md` for sources. User-supplied cake photos are not used. The studio’s actual white logo appears in the header and in the studio panels on Home and About. All visible instructor references use Tasty Bite rather than the brief’s original placeholder name.

The Moon Cake workshop has a freshly generated poster with the supplied class details and WhatsApp enquiry link. Its carousel also includes the working WELCOME10 demo offer. The original screenshot is no longer displayed.

The landing page shows four demo reel cards with static cover previews and no play icons or autoplay. Clicking opens a 9:16 portrait player. Admin → Reels saves, reorders and removes reels in this browser; real Instagram links open externally rather than loading tracking embeds. The four demos share one short stock film for now. A separate landscape baking-film feature lives only on the Meet Tasty Bite/About page. Instagram links use `@tasty_bite_baking_studio`.

Instructor story, recipes, stats and reviews remain illustrative. Studio contact details beyond the supplied poster’s workshop contact still require confirmation.

Add a sample video at `public/demo/lesson.mp4`; otherwise the custom player simulates real-time playback. Controls include seek, speed, volume, sample captions, fullscreen, Space play/pause, arrows seek, M mute and F fullscreen. Automatic position saves every ten seconds with Preferences consent. Lessons complete at 90% or via the completion button. Autoplay-next has a cancelable countdown. Recipe download opens browser print / Save as PDF.

## Payments and mock behavior

`WELCOME10` gives 10% off; `BAKE500` gives up to ₹500 off, capped at the subtotal. Only one code applies. Illustrative GST is 18% of the discounted subtotal, rounded to whole rupees. Confirm real tax treatment before launch. Coupons applied in the bag carry to checkout.

Use fake UPI details such as `demo@upi`. A checkbox lets presenters reliably demonstrate failure and retry. Never enter real financial details. No money is transferred. Custom admin coupons demonstrate management only; checkout accepts the two built-in codes. Upload files stay on the device, and only names/progress are simulated. Contact, newsletter, mock Google sign-in and Q&A submission contact no service. WhatsApp awaits a verified studio number. Sample student access toggles last for the session; the demo baker’s access persists.

## Consent and storage

`tb_demo` localStorage holds mock roles, cart, purchases, courses, notes, explicit completion records and orders. Theme and automatic playback positions are stored only with Preferences consent. `tb_consent` is a first-party JSON cookie mirrored in localStorage, with version, timestamp and optional flags, expiring after six months. Missing, expired or outdated consent prompts again. Optional categories start off.

Preferences controls the `tb_offer` dismissal cookie (30 days). Footer Cookie settings reopens the accessible modal; Withdraw consent disables optional categories and clears preference records/cookies. Necessary learning records remain. `tb_intro_seen_v3` is essential per-tab presentation state. Alt+D opens the debug panel showing sent/blocked analytics and marketing demonstrations. Events remain in memory; no external trackers, pixels or analytics requests load. Admin coupons use `tb_admin_coupons` localStorage.

Clear this origin’s browser data to reset. Browser state is not shared between devices. All policy wording must be reviewed for India’s DPDP Act and any other target regions before launch, including final storage classification and retention.

## Project structure and real integration

`app/` holds the layout, fonts, responsive styles and catch-all router entry. `components/` holds storefront, state, consent, learning, admin and reusable visual components. `data/courses.ts` holds typed mock data. `public/brand/` holds local brand assets.

For a real launch: replace local state with authenticated server APIs and database records; enforce admin authorization server-side; validate all pricing and coupons server-side; create Razorpay orders and verify signed webhooks before unlocking access; use signed video playback from a protected provider; and connect validated forms to an email service. The watermark and demo role switch are not content protection.

Deploy through Vercel’s Next.js preset or Netlify’s supported Next.js runtime using `npm run build`. Hosting has not been deployed by this local workflow. Verified studio photography, real course content, business/contact details and production services are still pending.

Prototype limits: unknown routes show the client’s illustrated fallback rather than a server 404 status; charts and reviews are sample data; simulated volume changes have no audio; captions and ingredients are examples; PDF output uses browser printing.
