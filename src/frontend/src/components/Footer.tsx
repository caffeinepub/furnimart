import { ShoppingCart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="font-display text-xl font-bold">
                Buyweeklyshop
              </span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">
              Premium furniture for every space — home and office. Crafted for
              comfort, designed for life.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider opacity-60">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <a href="/" className="hover:opacity-100 transition-opacity">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="hover:opacity-100 transition-opacity"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="/admin"
                  className="hover:opacity-100 transition-opacity"
                >
                  Admin Panel
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider opacity-60">
              Contact
            </h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>📞 +92 300 1234567</li>
              <li>✉️ info@buyweeklyshop.pk</li>
              <li>📍 Lahore, Pakistan</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm opacity-60">
          <p>© {year} Buyweeklyshop. All rights reserved.</p>
          <p>
            Built with ❤️ using{" "}
            <a
              href={utmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-100"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
