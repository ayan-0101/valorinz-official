import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Minus, Plus, Star, Truck, RefreshCw, Shield, ChevronDown, Loader2, ArrowLeft } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReviewSection from "@/components/ReviewSection";
import { useShopifyProduct } from "@/hooks/useShopifyProducts";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const Product = () => {
  const { handle } = useParams<{ handle: string }>();
  const { data: product, isLoading, error } = useShopifyProduct(handle || "");
  
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("description");
  
  const { addItem, isLoading: isAddingToCart } = useCartStore();

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    const variant = product.variants.edges[selectedVariantIndex]?.node;
    if (!variant) return;

    await addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
      selectedOptions: variant.selectedOptions || [],
      title: product.title,
      imageUrl: images[0] || null,
      handle: product.handle
    });

    toast.success("Added to cart!", {
      description: `${product.title} - ${variant.title}`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AnnouncementBar />
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <AnnouncementBar />
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/collections" className="btn-neon inline-flex items-center gap-2">
            <ArrowLeft size={18} />
            Back to Collections
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const selectedVariant = product.variants.edges[selectedVariantIndex]?.node;
  const price = selectedVariant ? parseFloat(selectedVariant.price.amount) : 0;
  const comparePrice = selectedVariant?.compareAtPrice 
    ? parseFloat(selectedVariant.compareAtPrice.amount) 
    : null;
  const images = product.images.edges.map(e => e.node.url);

  // Get unique options (Size, Color, etc.)
  const options = product.options || [];

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Header />
      <main className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <Link to="/collections" className="text-muted-foreground hover:text-primary text-sm flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Collections
            </Link>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Images */}
            <div className="space-y-4">
              <motion.div
                className="aspect-square bg-card rounded-2xl overflow-hidden card-glow"
                layoutId={`product-${product.id}`}
              >
                {images[selectedImage] ? (
                  <motion.img
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={images[selectedImage]}
                    alt={product.title}
                    className="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
              </motion.div>
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx
                          ? "border-primary"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <p className="text-primary text-sm font-medium mb-2">
                  {product.productType || "Apparel"}
                </p>
                <h1 className="font-display text-3xl lg:text-4xl font-bold mb-4">
                  {product.title}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < 4 ? "fill-primary text-primary" : "text-muted"}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground text-sm">
                    4.8 (Based on customer reviews)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-primary">
                    ${price.toFixed(2)}
                  </span>
                  {comparePrice && comparePrice > price && (
                    <span className="text-xl text-muted-foreground line-through">
                      ${comparePrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Variant Selector */}
              {options.map((option) => (
                <div key={option.name}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">{option.name}</span>
                    {option.name.toLowerCase() === 'size' && (
                      <button className="text-primary text-sm hover:underline">
                        Size Guide
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => {
                      // Find variant with this option value
                      const variantIndex = product.variants.edges.findIndex(v =>
                        v.node.selectedOptions.some(o => o.name === option.name && o.value === value)
                      );
                      const variant = product.variants.edges[variantIndex]?.node;
                      const isSelected = selectedVariant?.selectedOptions.some(
                        o => o.name === option.name && o.value === value
                      );
                      const isAvailable = variant?.availableForSale !== false;

                      return (
                        <button
                          key={value}
                          onClick={() => variantIndex >= 0 && setSelectedVariantIndex(variantIndex)}
                          disabled={!isAvailable}
                          className={`min-w-12 px-4 py-3 rounded-lg font-medium transition-all ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : isAvailable
                              ? "bg-muted text-foreground hover:border-primary border border-transparent"
                              : "bg-muted/50 text-muted-foreground line-through cursor-not-allowed"
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Quantity */}
              <div>
                <span className="font-medium mb-3 block">Quantity</span>
                <div className="flex items-center gap-4 bg-muted rounded-lg w-fit">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-3 hover:text-primary transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-3 hover:text-primary transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || !selectedVariant?.availableForSale}
                  className="flex-1 btn-neon py-4 text-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAddingToCart ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : selectedVariant?.availableForSale ? (
                    "Add to Cart"
                  ) : (
                    "Sold Out"
                  )}
                </button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-4 rounded-lg transition-all ${
                    isWishlisted
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-border">
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck size={20} className="text-primary" />
                  <span className="text-xs text-muted-foreground">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <RefreshCw size={20} className="text-primary" />
                  <span className="text-xs text-muted-foreground">30-Day Returns</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Shield size={20} className="text-primary" />
                  <span className="text-xs text-muted-foreground">Secure Checkout</span>
                </div>
              </div>

              {/* Accordions */}
              <div className="space-y-2">
                {[
                  { 
                    id: "description", 
                    title: "Description", 
                    content: product.description || "No description available."
                  },
                  {
                    id: "shipping",
                    title: "Shipping & Returns",
                    content:
                      "Free standard shipping on orders over $100. Express shipping available. Easy 30-day returns - no questions asked.",
                  },
                ].map((item) => (
                  <div key={item.id} className="border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() =>
                        setActiveAccordion(activeAccordion === item.id ? null : item.id)
                      }
                      className="w-full flex justify-between items-center p-4 hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-medium">{item.title}</span>
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${
                          activeAccordion === item.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {activeAccordion === item.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 text-muted-foreground text-sm whitespace-pre-line">
                            {item.content}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <ReviewSection />
      </main>

      {/* Sticky Add to Cart - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border lg:hidden z-40">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-display font-bold">${price.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">
              {selectedVariant?.title !== "Default Title" && selectedVariant?.title}
            </p>
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={isAddingToCart || !selectedVariant?.availableForSale}
            className="flex-1 btn-neon py-3 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isAddingToCart ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : selectedVariant?.availableForSale ? (
              "Add to Cart"
            ) : (
              "Sold Out"
            )}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Product;
