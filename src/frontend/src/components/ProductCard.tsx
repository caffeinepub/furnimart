import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { Building2, Home } from "lucide-react";
import { ExternalBlob } from "../backend";
import type { Product } from "../hooks/useQueries";

interface ProductCardProps {
  product: Product;
  index: number;
  staticImage?: string;
}

function formatPrice(price: bigint): string {
  return `₹${Number(price).toLocaleString("en-IN")}`;
}

export default function ProductCard({
  product,
  index,
  staticImage,
}: ProductCardProps) {
  const imgUrl = staticImage || product.imageId.getDirectURL();

  return (
    <Link
      to="/products/$productId"
      params={{ productId: product.id }}
      data-ocid={`products.item.${index}`}
      className="group block"
    >
      <div className="bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={imgUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-display font-semibold text-foreground text-base leading-snug line-clamp-2">
              {product.name}
            </h3>
            <Badge
              variant="secondary"
              className="shrink-0 text-xs flex items-center gap-1"
            >
              {product.category === "home" ? (
                <>
                  <Home className="w-3 h-3" /> Home
                </>
              ) : (
                <>
                  <Building2 className="w-3 h-3" /> Office
                </>
              )}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg text-accent">
              {formatPrice(product.price)}
            </span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                product.inStock
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
