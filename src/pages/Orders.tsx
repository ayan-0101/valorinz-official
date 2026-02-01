import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Loader2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { storefrontApiRequest, SHOPIFY_STORE_PERMANENT_DOMAIN } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ShopifyOrder {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    edges: Array<{
      node: {
        title: string;
        quantity: number;
        variant: {
          image: {
            url: string;
          } | null;
        } | null;
      };
    }>;
  };
  statusUrl: string;
}

const CUSTOMER_ORDERS_QUERY = `
  query GetCustomerOrders($customerAccessToken: String!, $first: Int!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: $first) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    image {
                      url
                    }
                  }
                }
              }
            }
            statusUrl
          }
        }
      }
    }
  }
`;

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<ShopifyOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) return;
      
      setLoading(true);
      setError(null);

      try {
        // Note: Shopify Storefront API requires customer access token for orders
        // Since we're using email-based lookup, we'll show a message about order tracking
        // In production, you'd integrate with Shopify Customer Accounts API
        setOrders([]);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Unable to fetch orders at this time.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PAID":
      case "FULFILLED":
        return "bg-green-500/10 text-green-500";
      case "PENDING":
      case "IN_PROGRESS":
        return "bg-yellow-500/10 text-yellow-500";
      case "REFUNDED":
      case "CANCELLED":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-2">Order History</h1>
            <p className="text-muted-foreground mb-8">
              Track and manage your orders
            </p>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">{error}</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 bg-muted/30 rounded-lg">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">No orders yet</h2>
                <p className="text-muted-foreground mb-6">
                  When you place an order, it will appear here. You can also track your order using the confirmation email you receive after purchase.
                </p>
                <div className="space-y-4">
                  <Button onClick={() => navigate("/collections")}>
                    Start Shopping
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Have an existing order?{" "}
                    <a
                      href={`https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/account`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Track on Shopify <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-lg p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.processedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(order.financialStatus)}>
                          {order.financialStatus}
                        </Badge>
                        {order.fulfillmentStatus && (
                          <Badge className={getStatusColor(order.fulfillmentStatus)}>
                            {order.fulfillmentStatus}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      {order.lineItems.edges.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                          {item.node.variant?.image?.url && (
                            <img
                              src={item.node.variant.image.url}
                              alt={item.node.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {item.node.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.node.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <p className="font-semibold text-foreground">
                        Total: {order.totalPrice.currencyCode} {parseFloat(order.totalPrice.amount).toFixed(2)}
                      </p>
                      <a
                        href={order.statusUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm inline-flex items-center gap-1"
                      >
                        View Details <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
