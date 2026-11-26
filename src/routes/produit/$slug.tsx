import { createFileRoute } from "@tanstack/react-router";

import { ProductPage } from "@/components/flower-shop";
import { flowerProducts } from "@/lib/flower-shop-data";

export const Route = createFileRoute("/produit/$slug")({
  head: ({ params }) => {
    const product = flowerProducts.find((item) => item.id === params.slug);
    const title = product ? `${product.name} | Flowers Rafiq` : "Fiche produit | Flowers Rafiq";
    const description = product?.description ?? "Découvrez les créations florales Flowers Rafiq.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductRoute,
});

function ProductRoute() {
  const { slug } = Route.useParams();
  return <ProductPage slug={slug} />;
}