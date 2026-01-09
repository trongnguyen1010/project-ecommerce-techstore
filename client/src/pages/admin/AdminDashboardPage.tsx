import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, ShoppingBag, Users, Package, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { getDashboardStats } from '../../apis/admin.api'; // Nhớ import hàm vừa tạo

export default function AdminDashboardPage() {
    const { token, user } = useAuthStore();
    const navigate = useNavigate();
    
    const [stats, setStats] = useState({
        revenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0,
        recentOrders: [] as any[]
    });

    useEffect(() => {
        if (!token || user?.role !== 'ADMIN') {
        navigate('/');
        return;
        }

        const loadStats = async () => {
        try {
            const data = await getDashboardStats(token);
            setStats(data);
        } catch (error) {
            console.error(error);
        }
        };

        loadStats();
    }, [token]);

    // Component thẻ thống kê nhỏ
    const StatCard = ({ title, value, icon: Icon, color }: any) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between">
        <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color} text-white`}>
            <Icon size={24} />
        </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto">
            
            <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
            <TrendingUp className="text-blue-600" /> Dashboard Tổng quan
            </h1>

            {/* 1. Các thẻ số liệu */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
                title="Tổng doanh thu" 
                value={`${Number(stats.revenue).toLocaleString('vi-VN')} ₫`} 
                icon={DollarSign} 
                color="bg-green-500" 
            />
            <StatCard 
                title="Đơn hàng" 
                value={stats.totalOrders} 
                icon={ShoppingBag} 
                color="bg-blue-500" 
            />
            <StatCard 
                title="Khách hàng" 
                value={stats.totalUsers} 
                icon={Users} 
                color="bg-orange-500" 
            />
            <StatCard 
                title="Sản phẩm" 
                value={stats.totalProducts} 
                icon={Package} 
                color="bg-purple-500" 
            />
            </div>

            {/* 2. Bảng đơn hàng mới nhất */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Đơn hàng mới nhất</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                        <tr>
                        <th className="p-3">Mã đơn</th>
                        <th className="p-3">Khách hàng</th>
                        <th className="p-3">Tổng tiền</th>
                        <th className="p-3">Trạng thái</th>
                        <th className="p-3">Ngày đặt</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {stats.recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                            <td className="p-3 font-bold text-blue-600">#{order.id}</td>
                            <td className="p-3">{order.fullName || order.user?.fullName || 'Khách vãng lai'}</td>
                            <td className="p-3 font-medium">{Number(order.totalAmount).toLocaleString()} ₫</td>
                            <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs font-bold 
                                ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                                order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                {order.status}
                            </span>
                            </td>
                            <td className="p-3 text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}