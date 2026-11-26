import { createFileRoute } from "@tanstack/react-router";

import { ContactPage } from "@/components/flower-shop";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | Flowers Rafiq" },
      { name: "description", content: "Contactez Flowers Rafiq pour vos bouquets, cadeaux fleuris et demandes sur mesure." },
      { property: "og:title", content: "Contact | Flowers Rafiq" },
      { property: "og:description", content: "Une question ou une envie particulière ? Écrivez à Flowers Rafiq." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});