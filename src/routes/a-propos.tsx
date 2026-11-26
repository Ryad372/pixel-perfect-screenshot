import { createFileRoute } from "@tanstack/react-router";

import { AboutPage } from "@/components/flower-shop";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "Notre histoire | Flowers Rafiq" },
      { name: "description", content: "Découvrez l’histoire et les valeurs du fleuriste Flowers Rafiq au Maroc." },
      { property: "og:title", content: "Notre histoire | Flowers Rafiq" },
      { property: "og:description", content: "Des bouquets frais, préparés à la main avec soin au Maroc." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});