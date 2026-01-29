import { motion } from "framer-motion";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const Wishlist = () => {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  const handleAddToCart = async (item: typeof items[0]) => {
    const product = item.product;
    const firstVariant = product.node.variants.edges[0]?.node;
    
    if (!firstVariant) {
      toast.error("Product unavailable");
      return;
    }

    await addToCart({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions,
      title: product.node.title,
      imageUrl: product.node.images.edges[0]?.node.url || null,
      handle: product.node.handle
    });

    toast.success("Added to cart!");
  };

  const handleRemove = (productId: string) => {
    removeItem(productId);
    toast.success("Removed from wishlist");
  };

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Header />

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
              <span className="text-muted-foreground">({items.length} items)</span>
            </div>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearWishlist}
                className="text-muted-foreground hover:text-destructive"
              >
                Clear All
              </Button>
            )}
          </div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-muted-foreground mb-6">
                Save items you love by clicking the heart icon
              </p>
              <Link to="/collections">
                <Button>Browse Collections</Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item, index) => {
                const product = item.product.node;
                const image = product.images.edges[0]?.node;
                const price = product.priceRange.minVariantPrice;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-card rounded-xl overflow-hidden border border-border"
                  >
                    <Link to={`/product/${product.handle}`} className="block">
                      <div className="aspect-square bg-muted">
                        {image ? (
                          <img
                            src={image.url}
                            alt={image.altText || product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            No image
                          </div>
                        )}
                      </div>
                    </Link>

                    <button
                      onClick={() => handleRemove(product.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="p-4">
                      <Link to={`/product/${product.handle}`}>
                        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {product.title}
                        </h3>
                      </Link>
                      <p className="text-primary font-semibold mt-2">
                        ${parseFloat(price.amount).toFixed(2)} {price.currencyCode}
                      </p>

                      <Button
                        onClick={() => handleAddToCart(item)}
                        className="w-full mt-3"
                        size="sm"
                      >
                        <ShoppingBag size={16} className="mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
