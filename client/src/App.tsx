import { useLocation, Routes, Route, Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import Header from './components/Header';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';

// Import Admin Pages & Layout
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminLayout from './layouts/AdminLayout';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import ScrollToTop from './components/ScrollToTop';
import OrderDetailPage from './pages/OrderDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import BackToTopButton from './components/BackToTopButton';
import AdminBannersPage from './pages/admin/AdminBannersPage';

// Wrapper component for Main Layout with Animation
const MainLayoutWrapper = () => {
  const location = useLocation();
  return (
    <div id="main-layout" className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-grow flex flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <>
      <ScrollToTop /> {/* reset scroll khi chuyển trang */}
      <Toaster position="top-center" reverseOrder={false} />
      <BackToTopButton />

      <Routes>
        {/* --- KHU VỰC KHÁCH HÀNG (Header chung) --- */}
        <Route element={<MainLayoutWrapper />}>
          <Route path="/" element={<HomePage />} />
          {/* Đường dẫn chi tiết (dấu :id nghĩa là id thay đổi động) */}
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* --- KHU VỰC ADMIN (Dùng AdminLayout riêng) --- */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Mặc định vào /admin thì nhảy tới Dashboard */}
          <Route index element={<AdminDashboardPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/:id" element={<AdminOrderDetailPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/new" element={<AdminProductFormPage />} />
          <Route path="products/edit/:id" element={<AdminProductFormPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="banners" element={<AdminBannersPage />} />
        </Route>

        {/* <Route path="*" element={<div className="text-center p-10">
          404 - Trang không tồn tại!</div>} /> */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;