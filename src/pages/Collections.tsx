import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, SlidersHorizontal, X, PackageOpen } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopifyProductCard from "@/components/ShopifyProductCard";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { useShopifyCollections } from "@/hooks/useShopifyCollections";

const Collections = () => {
  const [searchParams] = useSearchParams();
  const collectionHandle = searchParams.get("collection");
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string>("All");

  const { data: collections } = useShopifyCollections(20);
  
  // Build query based on selected collection
  const collectionQuery = selectedCollection !== "All" ? `tag:${selectedCollection}` : undefined;
  const { data: products, isLoading, error } = useShopifyProducts(50, collectionQuery);

  // Sync URL param with state
  useEffect(() => {
    if (collectionHandle) {
      setSelectedCollection(collectionHandle);
    }
  }, [collectionHandle]);

  // Filter products based on price range and stock
  const filteredProducts = products?.filter((product) => {
    const price = parseFloat(product.node.priceRange.minVariantPrice.amount);
    const priceMatch = price >= priceRange[0] && price <= priceRange[1];
    const stockMatch = !showInStockOnly || product.node.variants.edges.some(v => v.node.availableForSale);
    return priceMatch && stockMatch;
  }) || [];

  // Get collection titles for filter
  const collectionTitles = ["All", ...(collections?.map(c => c.node.handle) || [])];

  const displayProducts = filteredProducts;

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl lg:text-5xl font-bold mb-4">
              All <span className="text-gradient">Collections</span>
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Explore our complete range of anime-inspired streetwear
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-destructive">Failed to load products. Please try again.</p>
            </div>
          ) : products && products.length > 0 ? (
            <div className="flex gap-8">
              {/* Filters - Desktop */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24 space-y-8">
                  {collectionTitles.length > 1 && (
                    <div>
                      <h3 className="font-display font-semibold mb-4">Collections</h3>
                      <div className="space-y-2">
                        {collectionTitles.map((handle) => {
                          const collection = collections?.find(c => c.node.handle === handle);
                          const displayName = handle === "All" ? "All" : (collection?.node.title || handle);
                          return (
                            <button
                              key={handle}
                              onClick={() => setSelectedCollection(handle)}
                              className={`block w-full text-left px-4 py-2 rounded-lg transition-all ${
                                selectedCollection === handle
                                  ? "bg-primary text-primary-foreground"
                                  : "text-muted-foreground hover:bg-muted"
                              }`}
                            >
                              {displayName}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-display font-semibold mb-4">
                      Price Range: ${priceRange[0]} - ${priceRange[1]}
                    </h3>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={500}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="stock"
                        checked={showInStockOnly}
                        onCheckedChange={(checked) => setShowInStockOnly(checked as boolean)}
                      />
                      <label htmlFor="stock" className="text-sm cursor-pointer">
                        In Stock Only
                      </label>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Products Grid */}
              <div className="flex-1">
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden mb-6 flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">
                    {displayProducts.length} Products
                  </span>
                  <button
                    onClick={() => setIsFilterOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg"
                  >
                    <SlidersHorizontal size={18} />
                    Filters
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {displayProducts.map((product) => (
                    <ShopifyProductCard key={product.node.id} product={product} />
                  ))}
                </div>

                {displayProducts.length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-muted-foreground">No products match your filters.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <PackageOpen className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
              <h2 className="font-display text-2xl font-bold mb-4">No Products Found</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Your store doesn't have any products yet. Tell me what products you'd like to add - 
                describe the item, set a price, and I'll create it in Shopify for you!
              </p>
              <p className="text-sm text-muted-foreground">
                Example: "Add an Anime Spirit Hoodie for $89.99 with sizes S, M, L, XL"
              </p>
            </div>
          )}
        </div>

        {/* Mobile Filter Modal */}
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm lg:hidden"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-display text-xl font-bold">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="font-display font-semibold mb-4">
                    Price: ${priceRange[0]} - ${priceRange[1]}
                  </h3>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={500}
                    step={10}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="stock-mobile"
                    checked={showInStockOnly}
                    onCheckedChange={(checked) => setShowInStockOnly(checked as boolean)}
                  />
                  <label htmlFor="stock-mobile" className="text-sm cursor-pointer">
                    In Stock Only
                  </label>
                </div>

                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full btn-neon"
                >
                  Apply Filters ({displayProducts.length} Products)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Collections;
