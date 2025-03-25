
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { PromotionProvider } from "@/contexts/PromotionContext";
import { AnimatePresence } from "framer-motion";

// Pages
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import About from "./pages/About";
import Delivery from "./pages/Delivery";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminProducts from "./pages/Admin/Products";
import AdminPromotions from "./pages/Admin/Promotions";
import AdminSettings from "./pages/Admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <CartProvider>
        <PromotionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner position="top-right" />
            <BrowserRouter>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/catalog/:categorySlug" element={<Catalog />} />
                  <Route path="/product/:productId" element={<Product />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/checkout/success" element={<CheckoutSuccess />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/delivery" element={<Delivery />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/promotions" element={<AdminPromotions />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                  
                  {/* Catch-all route for 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
            </BrowserRouter>
          </TooltipProvider>
        </PromotionProvider>
      </CartProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
