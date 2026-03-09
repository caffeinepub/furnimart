import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Home, Shield, Star, Truck } from "lucide-react";
import { motion } from "motion/react";
import { Category, ExternalBlob } from "../backend";
import ProductCard from "../components/ProductCard";
import { useListAllProducts } from "../hooks/useQueries";

const FEATURES = [
  {
    icon: <Truck className="w-5 h-5" />,
    title: "Free Delivery",
    desc: "On orders above ₹10,000",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "2-Year Warranty",
    desc: "On all furniture items",
  },
  {
    icon: <Star className="w-5 h-5" />,
    title: "Premium Quality",
    desc: "Handpicked craftsmen",
  },
];

const STATIC_PRODUCTS = [
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
      "Solid walnut dining table with 6 chairs. A masterpiece of craftsmanship for your dining room.",
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
];

export default function HomePage() {
  const { data: products, isLoading } = useListAllProducts();
  const displayProducts =
    products && products.length > 0 ? products.slice(0, 3) : STATIC_PRODUCTS;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative h-[520px] md:h-[620px]">
          <img
            src="/assets/generated/hero-furniture.dim_1200x600.jpg"
            alt="FurniMart Showroom"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
          <div className="relative h-full container mx-auto px-4 flex items-center">
            <motion.div
              className="max-w-xl text-primary-foreground"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <Badge className="mb-4 bg-accent text-accent-foreground border-none">
                Premium Furniture
              </Badge>
              <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-4">
                Quality Furniture for Home & Office
              </h1>
              <p className="text-lg opacity-85 mb-8 leading-relaxed">
                Discover our curated collection of handcrafted furniture that
                blends timeless elegance with modern comfort.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/products">
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                  >
                    Shop Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/products">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/50 text-white hover:bg-white/10 hover:text-white"
                  >
                    Browse Collections
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/15 rounded-lg flex items-center justify-center shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm">{f.title}</p>
                  <p className="text-xs opacity-75">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-2">
            Our Collection
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Featured Products
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Explore our bestsellers — from cosy home sofas to professional
            office setups.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-muted rounded-lg h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            data-ocid="products.list"
          >
            {displayProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <ProductCard product={product} index={i + 1} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/products">
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              View All Products <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Category Sections */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-foreground">
              Shop by Category
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/products" className="group block">
              <div className="relative h-64 rounded-xl overflow-hidden shadow-card">
                <img
                  src="/assets/generated/product-sofa.dim_600x450.jpg"
                  alt="Home Furniture"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-primary-foreground">
                  <div className="flex items-center gap-2 mb-1">
                    <Home className="w-5 h-5" />
                    <span className="text-sm font-medium opacity-80">
                      Home Collection
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-bold">
                    Home Furniture
                  </h3>
                  <p className="text-sm opacity-75 mt-1">
                    Sofas, Beds, Dining Sets & More
                  </p>
                </div>
              </div>
            </Link>
            <Link to="/products" className="group block">
              <div className="relative h-64 rounded-xl overflow-hidden shadow-card">
                <img
                  src="/assets/generated/product-office-desk.dim_600x450.jpg"
                  alt="Office Furniture"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-primary-foreground">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-5 h-5" />
                    <span className="text-sm font-medium opacity-80">
                      Office Collection
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-bold">
                    Office Furniture
                  </h3>
                  <p className="text-sm opacity-75 mt-1">
                    Desks, Chairs, Cabinets & More
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
