import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import Header from './components/Header';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        {/* Đường dẫn trang chủ */}
        <Route path="/" element={<HomePage />} />
          
        {/* Đường dẫn chi tiết (dấu :id nghĩa là id thay đổi động) */}
        <Route path="/product/:id" element={<ProductDetailPage />} />
          
        {/* giỏ hàng */}
        <Route path="/cart" element={<CartPage />} />

        <Route path="/checkout" element={<CheckoutPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;