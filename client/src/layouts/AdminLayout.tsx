import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Home } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { useEffect } from 'react';

export default function AdminLayout() {
    const { user, logout } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    // Bảo vệ: Nếu không phải Admin thì cho về trang chủ
    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
        navigate('/');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Danh sách menu
    const menuItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/products', label: 'Sản phẩm', icon: Package },
        { path: '/admin/orders', label: 'Đơn hàng', icon: ShoppingCart },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
        
        {/* --- SIDEBAR (Bên trái) --- */}
        <aside className="w-64 bg-white border-r shadow-sm fixed h-full flex flex-col z-10">
            
            {/* Logo Admin */}
            <div className="h-16 flex items-center px-6 border-b">
            <span className="text-xl font-bold text-blue-600 flex items-center gap-2">
                🛡️ Admin Panel
            </span>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path); // Kiểm tra xem đang ở trang nào

                return (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition
                    ${isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                    <Icon size={20} />
                    {item.label}
                </Link>
                );
            })}
            </nav>

            {/* Footer Sidebar */}
            <div className="p-4 border-t space-y-2">
            {/* Về trang web bán hàng */}
            <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition">
                <Home size={20} /> Về trang chủ
            </Link>
            
            {/* Đăng xuất */}
            <button 
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium transition"
            >
                <LogOut size={20} /> Đăng xuất
            </button>
            </div>
        </aside>

        {/* --- MAIN CONTENT (Bên phải) --- */}
        <main className="flex-1 ml-64 p-8">
            {/* Outlet là nơi nội dung các trang con (Products, Orders...) sẽ hiển thị */}
            <Outlet />
        </main>

        </div>
    );
}