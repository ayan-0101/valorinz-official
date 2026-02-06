import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import logoImage from "@/assets/logo.png";
import CartDrawer from "./CartDrawer";
import SearchModal from "./SearchModal";
import ProfileDropdown from "./ProfileDropdown";
import { useWishlistStore } from "@/stores/wishlistStore";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const wishlistCount = useWishlistStore((state) => state.items.length);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Collections", path: "/collections" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "FAQ", path: "/faq" },
  ];

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative bg-black"
            >
              <img
                src={logoImage}
                alt="VALORIN"
                className="h-14 w-36 lg:h-16 lg:w-36 invert"
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="link-underline text-sm font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:block p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Search size={20} />
            </button>
            <div className="hidden lg:block">
              <ProfileDropdown />
            </div>
            <Link
              to="/wishlist"
              className="relative p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <CartDrawer />
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.nav
          initial={false}
          animate={{
            height: isMenuOpen ? "auto" : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          className="lg:hidden overflow-hidden border-t border-border"
        >
          <div className="py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-lg transition-all uppercase tracking-wider text-sm"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </motion.nav>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};

export default Header;
