import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "@/components/layout/ScrollToTop";
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
import ShopNow from "./pages/ShopNow";
import FindYourRoutine from "./pages/FindYourRoutine";
import AboutPage from "./pages/AboutPage";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import FindUs from "./pages/FindUs";
import CheckoutPage from "./pages/CheckoutPage";

import AdminProtectedRoute from "./admins/adminProtectedRoute";
import AdminLayout from "./admins/AdminLayout";
import AdminLogin from "./admins/AdminLogin";
import Dashboard from "./admins/Dashboard";
import StatCard from "./admins/StatCard";
import Customers from "./admins/Customers";
import Categories from "./admins/Categories";
import Products from "./admins/Products";
import AdminBlogList from "./admins/BlogList";
import BlogForm from "./admins/BlogForm";
import OrderManage from "./admins/OrderManage";
// import Messages from "./admins/Messages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      <ScrollToTop />
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
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/findus" element={<FindUs />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />

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
            <Route path="customers" element={<Customers />} />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
            <Route path="blogs" element={<AdminBlogList />} />
            <Route path="blogs/new" element={<BlogForm />} />
            <Route path="blogs/edit/:id" element={<BlogForm />} />
            {/* <Route path="messages" element={<Messages />} /> */}
            <Route path="orders" element={<OrderManage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
