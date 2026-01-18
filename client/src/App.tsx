import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
    {/* <Header/> */}
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>

        {/* --- KHU VỰC KHÁCH HÀNG (Header chung) --- */}
        <Route element={
          <div id="main-layout" className="flex flex-col min-h-screen">
             <Header/> 
             <div className="flex-grow"> 
                <Outlet/> 
             </div>
             <Footer/>
          </div>
          }>
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
        </Route>
        
        {/* <Route path="*" element={<div className="text-center p-10">
          404 - Trang không tồn tại!</div>} /> */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
        
    </BrowserRouter>
  );
}

export default App;