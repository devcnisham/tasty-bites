export type Reel = {
  id: string;
  title: string;
  cover: string;
  video?: string;
  instagramUrl?: string;
  demo: boolean;
};
export const demoReels: Reel[] = [
  {
    id: "demo-finish",
    title: "The finishing touches.",
    cover: "/images/stock/film-poster.jpg",
    video: "/video/cake-decorating.mp4",
    demo: true,
  },
  {
    id: "demo-hearts",
    title: "A little made-with-love.",
    cover: "/images/stock/heart-macarons.jpg",
    video: "/video/cake-decorating.mp4",
    demo: true,
  },
  {
    id: "demo-frosting",
    title: "The sweetest little swirl.",
    cover: "/images/stock/cupcakes.jpg",
    video: "/video/cake-decorating.mp4",
    demo: true,
  },
  {
    id: "demo-pastels",
    title: "A pastel kind of day.",
    cover: "/images/stock/pastel-macarons.jpg",
    video: "/video/cake-decorating.mp4",
    demo: true,
  },
];
