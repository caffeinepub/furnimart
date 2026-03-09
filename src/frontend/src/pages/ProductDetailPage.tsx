import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Home,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Category, ExternalBlob } from "../backend";
import type { Product } from "../hooks/useQueries";
import { useGetProduct } from "../hooks/useQueries";

const PRODUCT_FEATURES = [
  "Free delivery on orders above ₹10,000",
  "2-year manufacturer warranty",
  "Professional installation available",
  "Easy 7-day returns",
];

const STATIC_PRODUCTS: Record<string, Product> = {
  p1: {
    id: "p1",
    name: "Royal Comfort 3-Seater Sofa",
    description:
      "Luxurious cream fabric sofa with solid walnut legs. Designed for ultimate comfort and elegance. The high-density foam cushions provide superior support while the premium fabric is easy to clean. Available in custom colours upon request.",
    price: BigInt(45000),
    category: Category.home,
    inStock: true,
    createdAt: BigInt(0),
    imageId: ExternalBlob.fromURL(
      "/assets/generated/product-sofa.dim_600x450.jpg",
    ),
  },
  p2: {
    id: "p2",
    name: "Walnut Dining Set (6-Seater)",
    description:
      "Solid walnut dining table with 6 matching chairs. A masterpiece of craftsmanship for your dining room. The table features a smooth lacquered finish and sturdy mortise-and-tenon joinery. Chairs have padded seats for comfortable long meals.",
    price: BigInt(89000),
    category: Category.home,
    inStock: true,
    createdAt: BigInt(0),
    imageId: ExternalBlob.fromURL(
      "/assets/generated/product-dining-table.dim_600x450.jpg",
    ),
  },
  p3: {
    id: "p3",
    name: "Executive Ergonomic Chair",
    description:
      "Premium mesh & leather office chair with lumbar support and full adjustability. Engineered for all-day comfort with adjustable armrests, seat height, and recline. Breathable mesh back keeps you cool during long work sessions.",
    price: BigInt(28000),
    category: Category.office,
    inStock: true,
    createdAt: BigInt(0),
    imageId: ExternalBlob.fromURL(
      "/assets/generated/product-office-chair.dim_600x450.jpg",
    ),
  },
  p4: {
    id: "p4",
    name: "Executive Office Desk",
    description:
      "Solid wood executive desk with cable management system, built-in drawers and walnut finish. Spacious work surface with a cable grommet, three storage drawers and a lockable filing cabinet.",
    price: BigInt(55000),
    category: Category.office,
    inStock: true,
    createdAt: BigInt(0),
    imageId: ExternalBlob.fromURL(
      "/assets/generated/product-office-desk.dim_600x450.jpg",
    ),
  },
  p5: {
    id: "p5",
    name: "King Size Bed Frame",
    description:
      "Elegant walnut king-size bed with upholstered headboard. Solid wood slat base provides excellent mattress support. The padded headboard adds a touch of luxury to your master bedroom.",
    price: BigInt(72000),
    category: Category.home,
    inStock: true,
    createdAt: BigInt(0),
    imageId: ExternalBlob.fromURL(
      "/assets/generated/product-bed-frame.dim_600x450.jpg",
    ),
  },
  p6: {
    id: "p6",
    name: "Modular Bookshelf Unit",
    description:
      "Multi-purpose walnut bookshelf with open display shelves and closed cabinet doors. Each module can be rearranged to fit your space. Ideal for living rooms, studies, and home offices.",
    price: BigInt(38000),
    category: Category.home,
    inStock: false,
    createdAt: BigInt(0),
    imageId: ExternalBlob.fromURL(
      "/assets/generated/product-bookshelf.dim_600x450.jpg",
    ),
  },
};

function formatPrice(price: bigint): string {
  return `₹${Number(price).toLocaleString("en-IN")}`;
}

export default function ProductDetailPage() {
  const { productId } = useParams({ from: "/products/$productId" });
  const { data: backendProduct, isLoading } = useGetProduct(productId);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const product = backendProduct || STATIC_PRODUCTS[productId];

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Enquiry submitted! We'll contact you soon.");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="aspect-[4/3] rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="font-display text-2xl font-bold mb-3">
          Product not found
        </h2>
        <Link to="/products">
          <Button variant="outline">Back to Products</Button>
        </Link>
      </div>
    );
  }

  const imgUrl = product.imageId.getDirectURL();

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="rounded-xl overflow-hidden shadow-card bg-muted aspect-[4/3]">
          <img
            src={imgUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="flex items-center gap-1">
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
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                product.inStock
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.inStock ? "✓ In Stock" : "Out of Stock"}
            </span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {product.name}
          </h1>
          <p className="text-3xl font-bold text-accent mb-6">
            {formatPrice(product.price)}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-3">
            <Dialog open={enquiryOpen} onOpenChange={setEnquiryOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  data-ocid="product.enquire.button"
                >
                  <MessageCircle className="mr-2 w-4 h-4" /> Enquire Now
                </Button>
              </DialogTrigger>
              <DialogContent data-ocid="product.enquiry.dialog">
                <DialogHeader>
                  <DialogTitle className="font-display">
                    {submitted
                      ? "Enquiry Sent!"
                      : `Enquire about ${product.name}`}
                  </DialogTitle>
                </DialogHeader>

                {submitted ? (
                  <div className="py-8 text-center">
                    <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
                    <p className="text-lg font-semibold mb-2">
                      Thank you for your interest!
                    </p>
                    <p className="text-muted-foreground text-sm">
                      We've received your enquiry and will get back to you
                      within 24 hours.
                    </p>
                    <Button
                      className="mt-6"
                      onClick={() => {
                        setEnquiryOpen(false);
                        setSubmitted(false);
                        setEnquiryForm({ name: "", phone: "", message: "" });
                      }}
                    >
                      Close
                    </Button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleEnquirySubmit}
                    className="space-y-4 mt-2"
                  >
                    <div className="space-y-1.5">
                      <Label htmlFor="enq-name">Your Name</Label>
                      <Input
                        id="enq-name"
                        placeholder="Ali Hassan"
                        value={enquiryForm.name}
                        onChange={(e) =>
                          setEnquiryForm((p) => ({
                            ...p,
                            name: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="enq-phone">Phone Number</Label>
                      <Input
                        id="enq-phone"
                        placeholder="+92 300 1234567"
                        value={enquiryForm.phone}
                        onChange={(e) =>
                          setEnquiryForm((p) => ({
                            ...p,
                            phone: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="enq-message">Message</Label>
                      <Textarea
                        id="enq-message"
                        placeholder="I'm interested in this product..."
                        value={enquiryForm.message}
                        onChange={(e) =>
                          setEnquiryForm((p) => ({
                            ...p,
                            message: e.target.value,
                          }))
                        }
                        rows={3}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                      data-ocid="product.enquiry.submit_button"
                    >
                      Send Enquiry
                    </Button>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-8 pt-8 border-t border-border grid grid-cols-2 gap-3">
            {PRODUCT_FEATURES.map((feat) => (
              <div
                key={feat}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                {feat}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
