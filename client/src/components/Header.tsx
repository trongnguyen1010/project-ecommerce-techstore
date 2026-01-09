import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Store, User, LogOut, Package } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';
import { useAuthStore } from '../stores/useAuthStore';

export default function Header() {
  // Lấy danh sách items để đếm số lượng
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  //Lấy user và logout từ store
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const location = useLocation(); // Lấy vị trí hiện tại

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <Store size={28} />
          TechStore
        </Link>

        <div className="flex items-center gap-6">
          {/* Menu User: Đã đăng nhập vs Chưa đăng nhập */}
          {user ? (
            <div className="flex items-center gap-4">
              {/* NẾU LÀ ADMIN THÌ HIỆN LINK VÀO DASHBOARD */}
              {user.role === 'ADMIN' && (
                <Link to="/admin/dashboard" className="text-red-600 font-bold relative p-2 hover:bg-gray-200 rounded-full transition">
                  Trang quản trị
                </Link>
              )}
              <span className="text-sm font-medium text-gray-700 hidden md:block">
                Hi, {user.fullName}
              </span>
              {/* Nút vào Lịch sử đơn hàng */}
              <Link 
              to="/orders" 
              className="text-gray-500 hover:text-blue-600 transition" 
              title="Đơn hàng của tôi"
              >
                <Package size={20} />
              </Link>
              <button 
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-500 transition" 
              title="Đăng xuất"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" 
            state={{ from: location }} // Lưu vết trang hiện tại
            className="text-sm font-bold text-gray-600 hover:text-blue-600 flex items-center gap-1">
              <User size={20} />
              Đăng nhập
            </Link>
          )}

          {/* Giỏ hàng */}
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition">
              <ShoppingCart size={24} className="text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
      </div>
    </header>
  );
}