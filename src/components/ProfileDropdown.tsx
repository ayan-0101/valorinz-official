import { User, Heart, Package, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWishlistStore } from "@/stores/wishlistStore";
import { SHOPIFY_STORE_PERMANENT_DOMAIN } from "@/lib/shopify";

const ProfileDropdown = () => {
  const wishlistCount = useWishlistStore((state) => state.items.length);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
          <User size={20} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/wishlist" className="flex items-center gap-2 cursor-pointer">
            <Heart size={16} />
            <span>Wishlist</span>
            {wishlistCount > 0 && (
              <span className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a 
            href={`https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/account`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Package size={16} />
            <span>Track Order</span>
            <ExternalLink size={12} className="ml-auto text-muted-foreground" />
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
