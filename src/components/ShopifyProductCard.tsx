import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { type ShopifyProduct } from "@/lib/shopify.tsx";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { toast } from "sonner";

interface ShopifyProductCardProps {
  product: ShopifyProduct;
}

const ShopifyProductCard = ({ product }: ShopifyProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem, isLoading } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.node.id);

  const { node } = product;
  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const comparePrice = node.compareAtPriceRange?.minVariantPrice?.amount
    ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount)
    : null;
  const image = node.images.edges[0]?.node.url;
  const firstVariant = node.variants.edges[0]?.node;
  
  const isNew = node.tags.includes('new') || node.tags.includes('New');
  const isSale = comparePrice && comparePrice > price;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!firstVariant) {
      toast.error("No variant available");
      return;
    }

    await addItem({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || [],
      title: node.title,
      imageUrl: image || null,
      handle: node.handle
    });

    toast.success("Added to cart!", {
      description: node.title,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-glow relative overflow-hidden">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {isNew && (
            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
              NEW
            </span>
          )}
          {isSale && (
            <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full">
              SALE
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isWishlisted) {
              removeFromWishlist(product.node.id);
              toast.success("Removed from wishlist");
            } else {
              addToWishlist(product);
              toast.success("Added to wishlist!");
            }
          }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all ${
            isWishlisted
              ? "bg-accent text-accent-foreground"
              : "bg-background/80 text-foreground hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {/* Image */}
        <Link to={`/product/${node.handle}`} className="block product-image-zoom">
          <div className="aspect-[3/4] bg-muted">
            {image ? (
              <img
                src={image}
                alt={node.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
          </div>
        </Link>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          className="absolute bottom-4 left-4 right-4 flex gap-2"
        >
          <button 
            onClick={handleAddToCart}
            disabled={isLoading || !firstVariant?.availableForSale}
            className="flex-1 btn-neon py-2 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <ShoppingBag size={16} />
                {firstVariant?.availableForSale ? "Add to Cart" : "Sold Out"}
              </>
            )}
          </button>
          <Link
            to={`/product/${node.handle}`}
            className="p-2 bg-background/80 text-foreground rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <Eye size={18} />
          </Link>
        </motion.div>
      </div>

      {/* Info */}
      <div className="mt-4 space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          {node.productType || "Apparel"}
        </p>
        <Link to={`/product/${node.handle}`}>
          <h3 className="font-display font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
            {node.title}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-primary font-bold">
            ${price.toFixed(2)}
          </span>
          {isSale && comparePrice && (
            <span className="text-muted-foreground line-through text-sm">
              ${comparePrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ShopifyProductCard;
