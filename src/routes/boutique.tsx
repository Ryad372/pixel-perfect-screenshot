import { createFileRoute } from "@tanstack/react-router";

import { BoutiquePage } from "@/components/flower-shop";

export const Route = createFileRoute("/boutique")({
  head: () => ({
    meta: [
      { title: "Boutique de fleurs fraîches | Flowers Rafiq" },
      { name: "description", content: "Découvrez bouquets, boîtes fleuries, plantes et cadeaux Flowers Rafiq au Maroc." },
      { property: "og:title", content: "Boutique de fleurs fraîches | Flowers Rafiq" },
      { property: "og:description", content: "Des bouquets composés à la main, des plantes et des cadeaux fleuris." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BoutiquePage,
});