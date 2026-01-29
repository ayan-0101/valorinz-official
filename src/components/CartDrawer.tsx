import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Minus, Plus, Trash2, ExternalLink, Loader2, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

const CartDrawer = () => {
  const { 
    items, 
    isLoading, 
    isSyncing, 
    isOpen, 
    setIsOpen, 
    updateQuantity, 
    removeItem, 
    getCheckoutUrl, 
    syncCart,
    totalItems,
    totalPrice 
  } = useCartStore();

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
      setIsOpen(false);
    }
  };

  const itemCount = totalItems();
  const total = totalPrice();

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-muted-foreground hover:text-primary transition-colors"
      >
        <ShoppingBag size={20} />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded-full font-bold">
            {itemCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-display text-xl font-bold">Your Cart</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground">
                    Add items to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.variantId}
                      className="flex gap-4 p-3 bg-card rounded-xl border border-border"
                    >
                      {/* Image */}
                      <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-1">
                          {item.selectedOptions.map(opt => opt.value).join(' / ')}
                        </p>
                        <p className="text-primary font-bold text-sm">
                          {item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            disabled={isLoading}
                            className="p-1 bg-muted hover:bg-primary hover:text-primary-foreground rounded transition-colors disabled:opacity-50"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            disabled={isLoading}
                            className="p-1 bg-muted hover:bg-primary hover:text-primary-foreground rounded transition-colors disabled:opacity-50"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            disabled={isLoading}
                            className="p-1 ml-auto text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-border space-y-4 bg-card">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-display text-xl font-bold text-primary">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping and taxes calculated at checkout
                </p>
                <button
                  onClick={handleCheckout}
                  disabled={isLoading || isSyncing}
                  className="w-full btn-neon py-4 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <ExternalLink size={18} />
                      Checkout with Shopify
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartDrawer;
