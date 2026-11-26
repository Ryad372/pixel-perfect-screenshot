import { createFileRoute } from "@tanstack/react-router";

// The home route ships no og:image, so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flowers Rafiq | Des fleurs qui parlent pour vous" },
      { name: "description", content: "Bouquets frais, boîtes fleuries, plantes et cadeaux composés à la main au Maroc." },
      { property: "og:title", content: "Flowers Rafiq | Des fleurs qui parlent pour vous" },
      { property: "og:description", content: "Des bouquets frais et des cadeaux fleuris, composés à la main et livrés chez vous." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <HomePage />;
}

import { HomePage } from "@/components/flower-shop";
