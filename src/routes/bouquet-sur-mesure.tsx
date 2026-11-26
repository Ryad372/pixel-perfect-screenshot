import { createFileRoute } from "@tanstack/react-router";

import { CustomBouquetPage } from "@/components/flower-shop";

export const Route = createFileRoute("/bouquet-sur-mesure")({
  head: () => ({
    meta: [
      { title: "Bouquet sur mesure | Flowers Rafiq" },
      { name: "description", content: "Imaginez un bouquet personnalisé avec Flowers Rafiq : occasion, couleurs, budget et date." },
      { property: "og:title", content: "Bouquet sur mesure | Flowers Rafiq" },
      { property: "og:description", content: "Partagez vos envies et imaginez une composition florale unique." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CustomBouquetPage,
});