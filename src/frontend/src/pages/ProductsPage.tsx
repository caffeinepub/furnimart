import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackageSearch, Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Category, ExternalBlob } from "../backend";
import ProductCard from "../components/ProductCard";
import { useListAllProducts } from "../hooks/useQueries";
import type { Product } from "../hooks/useQueries";

const STATIC_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Royal Comfort 3-Seater Sofa",
    description:
      "Luxurious cream fabric sofa with solid walnut legs. Perfect centrepiece for your living room.",
    price: BigInt(45000),
    category: Category.home,
    inStock: true,
    createdAt: BigInt(0),
    imageId: ExternalBlob.fromURL(
      "/assets/generated/product-sofa.dim_600x450.jpg",
    ),
  },
  {
    id: "p2",
    name: "Walnut Dining Set (6-Seater)",
    description:
      "Solid walnut dining table with 6 matching chairs. A masterpiece of craftsmanship.",
    price: BigInt(89000),
    category: Category.home,
    inStock: true,
    createdAt: BigInt(0),
    imageId: ExternalBlob.fromURL(
      "/assets/generated/product-dining-table.dim_600x450.jpg",
    ),
  },
  {
    id: "p3",
    name: "Executive Ergonomic Chair",
    description:
      "Premium mesh & leather office chair with lumbar support and full adjustability.",
    price: BigInt(28000),
    category: Category.office,
    inStock: true,
    createdAt: BigInt(0),
    imageId: ExternalBlob.fromURL(
      "/assets/generated/product-office-chair.dim_600x450.jpg",
    ),
  },
  {
    id: "p4",
    name: "Executive Office Desk",
    description:
      "Solid wood executive desk with cable management, built-in drawers, walnut finish.",
    price: BigInt(55000),
    category: Category.office,
    inStock: true,
    createdAt: BigInt(0),
    imageId: ExternalBlob.fromURL(
      "/assets/generated/product-office-desk.dim_600x450.jpg",
    ),
  },
  {
    id: "p5",
    name: "King Size Bed Frame",
    description:
      "Elegant walnut king-size bed with upholstered headboard. Timeless design for your master bedroom.",
    price: BigInt(72000),
    category: Category.home,
    inStock: true,
    createdAt: BigInt(0),
    imageId: ExternalBlob.fromURL(
      "/assets/generated/product-bed-frame.dim_600x450.jpg",
    ),
  },
  {
    id: "p6",
    name: "Modular Bookshelf Unit",
    description:
      "Multi-purpose walnut bookshelf with open shelves and cabinet doors. Perfect for any room.",
    price: BigInt(38000),
    category: Category.home,
    inStock: false,
    createdAt: BigInt(0),
    imageId: ExternalBlob.fromURL(
      "/assets/generated/product-bookshelf.dim_600x450.jpg",
    ),
  },
];

export default function ProductsPage() {
  const { data: backendProducts, isLoading } = useListAllProducts();
  const [category, setCategory] = useState<"all" | "home" | "office">("all");
  const [search, setSearch] = useState("");

  const products =
    backendProducts && backendProducts.length > 0
      ? backendProducts
      : STATIC_PRODUCTS;

  const filtered = products.filter((p) => {
    const matchCat = category === "all" || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-1">
          All Products
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          Our Furniture Collection
        </h1>
        <p className="text-muted-foreground">
          Browse our full range of home and office furniture.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Tabs
          value={category}
          onValueChange={(v) => setCategory(v as "all" | "home" | "office")}
        >
          <TabsList>
            <TabsTrigger value="all" data-ocid="products.category_all.tab">
              All
            </TabsTrigger>
            <TabsTrigger value="home" data-ocid="products.category_home.tab">
              Home
            </TabsTrigger>
            <TabsTrigger
              value="office"
              data-ocid="products.category_office.tab"
            >
              Office
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-ocid="products.search_input"
          />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-56 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div data-ocid="products.empty_state" className="py-24 text-center">
          <PackageSearch className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-display text-xl font-semibold mb-2">
            No products found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter.
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="products.list"
        >
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <ProductCard product={product} index={i + 1} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
