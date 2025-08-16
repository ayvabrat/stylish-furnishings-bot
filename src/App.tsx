
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CartProvider } from "./contexts/CartContext";
import { PromotionProvider } from "./contexts/PromotionContext";
import { AdminProvider } from "./contexts/AdminContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Catalog from "./pages/Catalog";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Delivery from "./pages/Delivery";
import PaymentInfo from "./pages/PaymentInfo";
import Warranty from "./pages/Warranty";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Offer from "./pages/Offer";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/Admin/Login";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminProducts from "./pages/Admin/Products";
import AdminAddProduct from "./pages/Admin/AddProduct";
import AdminEditProduct from "./pages/Admin/EditProduct";
import AdminSettings from "./pages/Admin/Settings";
import AdminPromotions from "./pages/Admin/Promotions";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <CartProvider>
            <PromotionProvider>
              <AdminProvider>
                <Toaster />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/product/:id" element={<Product />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/checkout-success" element={<CheckoutSuccess />} />
                    <Route path="/delivery" element={<Delivery />} />
                    <Route path="/payment-info" element={<PaymentInfo />} />
                    <Route path="/warranty" element={<Warranty />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/offer" element={<Offer />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={
                      <AdminProtectedRoute>
                        <AdminDashboard />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/admin/products" element={
                      <AdminProtectedRoute>
                        <AdminProducts />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/admin/products/add" element={
                      <AdminProtectedRoute>
                        <AdminAddProduct />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/admin/products/edit/:id" element={
                      <AdminProtectedRoute>
                        <AdminEditProduct />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/admin/settings" element={
                      <AdminProtectedRoute>
                        <AdminSettings />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/admin/promotions" element={
                      <AdminProtectedRoute>
                        <AdminPromotions />
                      </AdminProtectedRoute>
                    } />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </AdminProvider>
            </PromotionProvider>
          </CartProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
