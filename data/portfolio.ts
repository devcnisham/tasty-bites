export type StudioPhoto = {
  src: string;
  title: string;
  category: string;
  alt: string;
  position: string;
  width: number;
  height: number;
  source: string;
  credit: string;
};
export const photos: Record<string, StudioPhoto> = {
  cake: {
    src: "/images/stock/pink-cake.jpg",
    title: "A little romance.",
    category: "CELEBRATION CAKES",
    alt: "A pale pink birthday cake with delicate piped buttercream on a pastel blue table",
    position: "50% 65%",
    width: 1200,
    height: 2132,
    source:
      "https://www.pexels.com/photo/elegant-pink-birthday-cake-with-white-icing-29192489/",
    credit: "Zeynep Ladin Üstündağ / Pexels",
  },
  hearts: {
    src: "/images/stock/heart-macarons.jpg",
    title: "A little sweetness.",
    category: "PRETTY LITTLE DETAILS",
    alt: "Heart-shaped pink macarons in a bowl surrounded by roses and decorated cookies",
    position: "50% 55%",
    width: 1000,
    height: 1500,
    source: "https://www.pexels.com/photo/heart-baked-cookies-3553702/",
    credit: "Jill Wellington / Pexels",
  },
  macarons: {
    src: "/images/stock/pastel-macarons.jpg",
    title: "A little obsession.",
    category: "PASTEL PATISSERIE",
    alt: "A carefully balanced stack of pastel French macarons against a pink backdrop",
    position: "50% 50%",
    width: 1100,
    height: 1650,
    source: "https://www.pexels.com/photo/colored-french-macaroons-15779768/",
    credit: "Pexels",
  },
  cookies: {
    src: "/images/stock/cookies.jpg",
    title: "The perfect little cookie.",
    category: "COOKIES",
    alt: "Homemade chocolate chip cookies arranged on a plate",
    position: "50% 50%",
    width: 1100,
    height: 733,
    source:
      "https://www.pexels.com/photo/plate-of-chocolate-chip-cookies-1626668/",
    credit: "Pexels",
  },
  cupcakes: {
    src: "/images/stock/cupcakes.jpg",
    title: "A swirl of something sweet.",
    category: "CUPCAKES & FROSTING",
    alt: "Pink frosted cupcakes topped with heart-shaped sprinkles",
    position: "50% 50%",
    width: 1100,
    height: 734,
    source:
      "https://www.pexels.com/photo/close-up-photo-of-pink-cupcakes-7180583/",
    credit: "Pexels",
  },
  bread: {
    src: "/images/stock/bread.jpg",
    title: "A slow, lovely morning.",
    category: "BREADS",
    alt: "A freshly baked loaf of bread on a wooden board in natural light",
    position: "50% 55%",
    width: 1100,
    height: 1544,
    source:
      "https://www.pexels.com/photo/loaf-of-bread-on-a-wooden-board-11739599/",
    credit: "Pexels",
  },
};
export const portfolio = [photos.cake, photos.hearts, photos.macarons];
export const coursePhotos: Record<string, StudioPhoto> = {
  "eggless-cakes": photos.cake,
  "classic-cookies": photos.cookies,
  macarons: photos.macarons,
  buttercream: photos.cupcakes,
  "soft-breads": photos.bread,
  cupcakes: photos.cupcakes,
};
