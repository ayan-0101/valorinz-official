import { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Youtube, Mail, Loader2 } from "lucide-react";
import logoImage from "@/assets/logo.png";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";

const EMAILJS_SERVICE_ID = "service_u604rvn";
const EMAILJS_TEMPLATE_ID = "template_hkmbf1l";
const EMAILJS_PUBLIC_KEY = "yIjYbCC8V7Z0mbkLt";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: "VALORINz official",
          subject: "New Newsletter Subscription",
          from_email: email,
          message: `New subscriber: ${email}\n\nThis user wants to receive exclusive drops and early access updates.`,
        },
        EMAILJS_PUBLIC_KEY
      );
      toast.success("Subscribed successfully!", {
        description: "You'll receive our exclusive drops and early access.",
      });
      setEmail("");
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="h-14 w-14 rounded-full bg-black flex items-center justify-center">
              <img src={logoImage} alt="VALORIN" className="h-6 invert" />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Bold streetwear inspired by anime culture, movie quotes, and
              aesthetic typography. Express your story through fashion.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-all"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-all"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-all"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {["New Arrivals", "Best Sellers", "Collections", "Sale"].map(
                (link) => (
                  <li key={link}>
                    <Link
                      to="/collections"
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-foreground">
              Support
            </h4>
            <ul className="space-y-2">
              {[
                { name: "FAQ", path: "/faq" },
                { name: "Shipping Info", path: "/shipping" },
                { name: "Returns", path: "/returns" },
                { name: "Contact Us", path: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-foreground">
              Stay Updated
            </h4>
            <p className="text-muted-foreground text-sm mb-4">
              Subscribe for exclusive drops and early access.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2026 VALORIN. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="text-muted-foreground hover:text-primary text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-muted-foreground hover:text-primary text-sm transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
