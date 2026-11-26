import { createFileRoute } from "@tanstack/react-router";

import { CartPage } from "@/components/flower-shop";

export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [
      { title: "Votre panier | Flowers Rafiq" },
      { name: "description", content: "Retrouvez votre sélection Flowers Rafiq et préparez votre demande de livraison." },
      { property: "og:title", content: "Votre panier | Flowers Rafiq" },
      { property: "og:description", content: "Votre sélection de fleurs fraîches et de cadeaux chez Flowers Rafiq." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});