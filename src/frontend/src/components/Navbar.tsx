import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { LogIn, LogOut, Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Navbar() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navLinks = [
    { to: "/", label: "Home", ocid: "nav.home.link" },
    { to: "/products", label: "Products", ocid: "nav.products.link" },
    { to: "/admin", label: "Admin", ocid: "nav.admin.link" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-xs">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-primary-foreground" />
          </div>
          <span
            className="font-display text-xl font-bold text-foreground tracking-tight"
            data-ocid="nav.brand.link"
          >
            Buyweeklyshop
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-ocid={link.ocid}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
              activeProps={{ className: "text-foreground bg-muted" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAuth}
            disabled={isLoggingIn}
            data-ocid={
              isAuthenticated ? "auth.logout.button" : "auth.login.button"
            }
            className="hidden md:flex items-center gap-2"
          >
            {isAuthenticated ? (
              <>
                <LogOut className="w-4 h-4" /> Logout
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />{" "}
                {isLoggingIn ? "Logging in..." : "Login"}
              </>
            )}
          </Button>

          <button
            type="button"
            className="md:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-ocid={link.ocid}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={handleAuth}
            disabled={isLoggingIn}
            data-ocid={
              isAuthenticated ? "auth.logout.button" : "auth.login.button"
            }
            className="mt-2"
          >
            {isAuthenticated
              ? "Logout"
              : isLoggingIn
                ? "Logging in..."
                : "Login"}
          </Button>
        </div>
      )}
    </header>
  );
}
