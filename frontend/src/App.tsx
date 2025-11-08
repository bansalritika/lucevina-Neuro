import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetails from "./pages/ProductDetails";

import AdminProtectedRoute from "./admins/adminProtectedRoute";
import AdminLayout from "./admins/AdminLayout";
import AdminLogin from "./admins/AdminLogin";
import Dashboard from "./admins/Dashboard";
import StatCard from "./admins/StatCard";
import Categories from "./admins/Categories";
import Products from "./admins/Products";
import ShopNow from "./pages/ShopNow";
import FindYourRoutine from "./pages/FindYourRoutine";
import AboutPage from "./pages/AboutPage";
import FindUs from "./pages/FindUs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/ourproducts/:categoryId" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/ourproducts" element={<ShopNow />} />
          <Route path="/routine" element={<FindYourRoutine />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/findus" element={<FindUs />} />
          <Route path="/cart" element={<CartPage />} />

          <Route path="/admin-login" element={<AdminLogin />} />

          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="statcard" element={<StatCard />} />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
            {/* <Route path="services" element={<Services />} />
            <Route path="messages" element={<AdminMessages />} /> */}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
