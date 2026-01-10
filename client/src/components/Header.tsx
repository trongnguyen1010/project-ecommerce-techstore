import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// Import thêm các icon cần thiết cho menu
import { ShoppingCart, Store, User, LogOut, Package, Shield, Settings, ChevronDown } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';
import { useAuthStore } from '../stores/useAuthStore';

export default function Header() {
    // Lấy danh sách items để đếm số lượng
    const items = useCartStore((state) => state.items);
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    // Lấy user và logout từ store
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    // State để quản lý đóng/mở menu
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
      setIsMenuOpen(false); // Đóng menu
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
            
            {/* 1. GIỎ HÀNG (Đưa lên trước theo ý bạn) */}
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition">
              <ShoppingCart size={24} className="text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* 2. KHU VỰC USER (Nằm sau giỏ hàng) */}
            {user ? (
              <div className="flex items-center gap-4 relative">
                
                {/* Link Admin */}
                {user.role === 'ADMIN' && (
                  <Link to="/admin/dashboard" className="hidden md:block text-red-600 font-bold text-sm relative p-2 hover:bg-gray-200 rounded-lg transition">
                    <span className="flex items-center gap-1">Trang Admin</span>
                  </Link>
                )}

                {/* BUTTON KÍCH HOẠT MENU */}
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 hover:bg-gray-100 py-1 px-2 rounded-lg transition outline-none"
                >
                  {/* Giữ nguyên chữ Hi, Name */}
                  <span className="text-sm font-medium text-gray-700 hidden md:block">
                    Hi, {user.fullName}
                  </span>
                  
                  {/* Icon Avatar tròn */}
                  <div className="w-9 h-9 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center border border-gray-200">
                    <User size={20} />
                  </div>
                  
                  {/* Mũi tên nhỏ chỉ xuống */}
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {/* MENU DROPDOWN (Hiện khi isMenuOpen = true) */}
                {isMenuOpen && (
                  <>
                    {/* Lớp màng vô hình để click ra ngoài thì đóng menu */}
                    <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>

                    {/* Nội dung Menu */}
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                      
                      {/* Header nhỏ trong menu (Mobile only) */}
                      <div className="px-4 py-2 border-b mb-1 md:hidden">
                        <p className="text-sm font-bold text-gray-800 truncate">{user.fullName}</p>
                      </div>

                      <Link 
                        to="/profile" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                      >
                        <Settings size={18} /> Hồ sơ cá nhân
                      </Link>

                      <Link 
                        to="/orders" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                      >
                        <Package size={18} /> Đơn hàng của tôi
                      </Link>

                      <div className="border-t mt-1 pt-1">
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition text-left"
                        >
                          <LogOut size={18} /> Đăng xuất
                        </button>
                      </div>
                    </div>
                  </>
                )}

              </div>
            ) : (
              // Chưa đăng nhập
              <Link to="/login" 
                state={{ from: location }}
                className="text-sm font-bold text-gray-600 hover:text-blue-600 flex items-center gap-1"
              >
                <User size={20} />
                Đăng nhập
              </Link>
            )}

          </div>
        </div>
      </header>
    );
}