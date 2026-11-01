export type Lesson = {
  id: string;
  title: string;
  duration: number;
  preview: boolean;
};
export type Phase = { title: string; lessons: Lesson[] };
export type Course = {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  color: string;
  kind: string;
  rating: number;
  students: number;
  status: "published" | "draft";
  phases: Phase[];
};
const seeds = [
  [
    "eggless-cakes",
    "Eggless Cakes Masterclass",
    "Cakes",
    "Soft sponges, beautiful layers, and that first unforgettable slice.",
    2499,
    "#f5c8c1",
    "cake",
  ],
  [
    "classic-cookies",
    "Classic Cookies from Scratch",
    "Cookies",
    "Crisp edges, soft centres. Your everyday cookie ritual starts here.",
    1299,
    "#ead5b4",
    "cookie",
  ],
  [
    "macarons",
    "Macarons Made Easy",
    "Macarons",
    "A little patience, a little precision, and perfectly pretty macarons.",
    2999,
    "#c9d7bb",
    "macaron",
  ],
  [
    "buttercream",
    "Buttercream & Cake Decoration",
    "Frosting",
    "Turn simple cakes into something worth celebrating.",
    1999,
    "#efd0dc",
    "cupcake",
  ],
  [
    "soft-breads",
    "Soft Breads & Buns",
    "Breads",
    "Slow mornings, warm ovens, and a kitchen that smells like home.",
    1799,
    "#edcea5",
    "bread",
  ],
  [
    "cupcakes",
    "Cupcakes for Beginners",
    "Cakes",
    "Small bakes, big smiles. Make your first batch with confidence.",
    999,
    "#e9dfb9",
    "cupcake",
  ],
] as const;
const phaseTitles = [
  "The foundations",
  "Into the kitchen",
  "Finishing touches",
  "Bake it your own",
];
const lessonTitles = [
  [
    "Welcome to your baking journey",
    "Ingredients & how they work",
    "Tools, weighing & preparation",
  ],
  [
    "Mixing the perfect base",
    "Temperature, timing & technique",
    "Your first bake, step by step",
  ],
  [
    "Textures & troubleshooting",
    "Fillings, flavours & finishing",
    "Plating & storing your bakes",
  ],
  [
    "Creative flavour combinations",
    "Pricing your homemade bakes",
    "Your final bake & next steps",
  ],
];
export const courses: Course[] = seeds.map((s, i) => ({
  id: s[0],
  title: s[1],
  category: s[2],
  description: s[3],
  price: s[4],
  color: s[5],
  kind: s[6],
  rating: 4.9,
  students: 240 + i * 87,
  status: "published",
  phases: phaseTitles.map((title, p) => ({
    title,
    lessons: lessonTitles[p].map((t, l) => ({
      id: `${s[0]}-${p}-${l}`,
      title: t,
      duration: 360 + p * 120 + l * 90,
      preview: p === 0 && l === 0,
    })),
  })),
}));
export const faqs = [
  [
    "I’ve never baked before. Is this for me?",
    "Absolutely. Every course starts with the basics, with clear steps and plenty of troubleshooting along the way.",
  ],
  [
    "Are the recipes eggless?",
    "The Eggless Cakes Masterclass is entirely eggless. Each course lists its ingredients so you can choose what suits you.",
  ],
  [
    "How long can I access my course?",
    "The demo gives you ongoing access in this browser. Final access terms will be confirmed before launch.",
  ],
  [
    "Can I learn on my phone?",
    "Yes! Lessons, recipes and your progress work beautifully on phones, tablets and computers.",
  ],
  [
    "Do I need professional equipment?",
    "Start with a home oven, a kitchen scale, and a few basic tools. Tasty Bite explains any specialist tools before you need them.",
  ],
  [
    "Can I download the recipes?",
    "Yes. Every lesson has a recipe area and a printable recipe you can save as a PDF.",
  ],
  [
    "Will I receive a certificate?",
    "Complete all the lessons to unlock your demo completion certificate.",
  ],
  [
    "Can I ask questions?",
    "Explore the sample Q&A beneath each lesson. Live instructor support is planned for the real platform.",
  ],
];
export const testimonials = [
  [
    "Aanya",
    "Pune",
    "I finally understood why my sponges kept sinking. The small details made all the difference.",
  ],
  [
    "Meera",
    "Mumbai",
    "The pace is lovely. I could pause, bake along, and come back the next evening.",
  ],
  [
    "Riya",
    "Bengaluru",
    "My first batch of macarons had feet! I was so proud I sent a photo to everyone.",
  ],
  [
    "Kavya",
    "Delhi",
    "The ingredient explanations gave me confidence to try my own flavours.",
  ],
  [
    "Neha",
    "Jaipur",
    "A calm, clear introduction to baking. My weekend ritual now.",
  ],
  [
    "Priya",
    "Chennai",
    "The recipe checklist is such a useful touch when your hands are covered in flour.",
  ],
  [
    "Isha",
    "Hyderabad",
    "I made the birthday cake myself this year. That felt wonderful.",
  ],
  [
    "Sara",
    "Kochi",
    "Simple tools and thoughtful techniques. Nothing felt out of reach.",
  ],
  [
    "Anjali",
    "Indore",
    "The bread lessons helped me understand dough instead of just following a timer.",
  ],
  [
    "Diya",
    "Surat",
    "I loved learning how to fix buttercream when it goes wrong.",
  ],
  ["Tara", "Goa", "Short lessons fit perfectly into a busy week."],
  [
    "Pooja",
    "Lucknow",
    "The cookies disappeared before they had even cooled. A very good sign.",
  ],
];
