export type ProductCategory = "Bouquets" | "Boîtes" | "Plantes" | "Cadeaux";

export interface FlowerProduct {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  image: string;
  description: string;
  topSeller?: boolean;
}

export const productCategories: ProductCategory[] = ["Bouquets", "Boîtes", "Plantes", "Cadeaux"];

export const flowerProducts: FlowerProduct[] = [
  {
    id: "rose-tendre",
    name: "Rose tendre",
    category: "Bouquets",
    price: 290,
    image: "/flowers/bouquet.jpg",
    description: "Un bouquet généreux de roses et de fleurs de saison, noué à la main.",
    topSeller: true,
  },
  {
    id: "jardin-secret",
    name: "Jardin secret",
    category: "Bouquets",
    price: 340,
    image: "/flowers/bouquet.jpg",
    description: "Un mélange délicat de fleurs fraîches aux nuances douces et naturelles.",
    topSeller: true,
  },
  {
    id: "eclat-du-jour",
    name: "Éclat du jour",
    category: "Bouquets",
    price: 250,
    image: "/flowers/bouquet.jpg",
    description: "Une composition lumineuse pour offrir un peu de soleil à ceux que l’on aime.",
  },
  {
    id: "amour-en-fleurs",
    name: "Amour en fleurs",
    category: "Bouquets",
    price: 390,
    image: "/flowers/bouquet.jpg",
    description: "Roses, pivoines et feuillages choisis pour les grandes déclarations.",
    topSeller: true,
  },
  {
    id: "boite-rose",
    name: "Boîte rose poudré",
    category: "Boîtes",
    price: 320,
    image: "/flowers/flower-box.jpg",
    description: "Des roses délicates dans un écrin élégant, prêt à offrir.",
    topSeller: true,
  },
  {
    id: "boite-elegance",
    name: "Écrin d’élégance",
    category: "Boîtes",
    price: 420,
    image: "/flowers/flower-box.jpg",
    description: "Une boîte florale généreuse aux tons crème, rose et bleu tendre.",
  },
  {
    id: "boite-romantique",
    name: "Boîte romantique",
    category: "Boîtes",
    price: 360,
    image: "/flowers/flower-box.jpg",
    description: "Une attention douce composée de roses fraîches et de petits boutons.",
  },
  {
    id: "orchidee-blanche",
    name: "Orchidée blanche",
    category: "Plantes",
    price: 280,
    image: "/flowers/plants.jpg",
    description: "Une orchidée raffinée, sélectionnée pour fleurir votre intérieur.",
  },
  {
    id: "monstera-atelier",
    name: "Monstera d’atelier",
    category: "Plantes",
    price: 310,
    image: "/flowers/plants.jpg",
    description: "Une plante graphique en pot, facile à aimer et belle en toute saison.",
  },
  {
    id: "feuillage-calme",
    name: "Feuillage calme",
    category: "Plantes",
    price: 220,
    image: "/flowers/plants.jpg",
    description: "Un feuillage généreux dans un pot artisanal aux lignes simples.",
  },
  {
    id: "douce-attention",
    name: "Douce attention",
    category: "Cadeaux",
    price: 370,
    image: "/flowers/gifts.jpg",
    description: "Un bouquet tendre accompagné d’une petite sélection gourmande.",
    topSeller: true,
  },
  {
    id: "merci-fleuri",
    name: "Merci fleuri",
    category: "Cadeaux",
    price: 330,
    image: "/flowers/gifts.jpg",
    description: "Une attention fleurie et généreuse pour dire merci avec le cœur.",
  },
];

export const customerReviews = [
  { name: "Salma", quote: "Un bouquet magnifique, encore plus beau que sur les photos." },
  { name: "Yasmine", quote: "Une équipe à l’écoute et une livraison tout en douceur." },
  { name: "Nadia", quote: "Des fleurs fraîches et un emballage vraiment soigné." },
];

export const formatPrice = (amount: number) => `${amount.toLocaleString("fr-FR")} DH`;