import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    DollarSign, ShoppingBag, Users, Package, 
    TrendingUp, TrendingDown, Calendar, ArrowUpRight 
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { getDashboardStats } from '../../apis/admin.api'; 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, type TooltipProps } from 'recharts';

// --- DATA GIẢ LẬP CHO BIỂU ĐỒ (Sau này backend trả về thì thay sau) ---
const MOCK_CHART_DATA = [
  { name: 'T1', doanhThu: 4000000 },
  { name: 'T2', doanhThu: 3000000 },
  { name: 'T3', doanhThu: 2000000 },
  { name: 'T4', doanhThu: 2780000 },
  { name: 'T5', doanhThu: 1890000 },
  { name: 'T6', doanhThu: 2390000 },
  { name: 'T7', doanhThu: 3490000 },
];

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

    // Hàm dịch trạng thái sang tiếng Việt và chọn màu
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'PENDING': return { text: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700' };
            // case 'SHIPPING': 
            case 'SHIPPED': return { text: 'Đang giao', color: 'bg-blue-100 text-blue-700' };
            case 'COMPLETED': return { text: 'Hoàn thành', color: 'bg-green-100 text-green-700' };
            case 'CANCELLED': return { text: 'Đã hủy', color: 'bg-red-100 text-red-700' };
            default: return { text: status, color: 'bg-gray-100 text-gray-700' };
        }
    };

    // Component Thẻ thống kê (Nâng cấp)
    const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition duration-200">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${color} text-white shadow-lg shadow-opacity-20`}>
                    <Icon size={24} />
                </div>
                {/* Giả lập số % tăng trưởng */}
                <div className={`flex items-center gap-1 text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {Math.abs(trend)}%
                </div>
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
            </div>
        </div>
    );

    // Custom Tooltip cho biểu đồ tiền tệ
    const CustomTooltip = ({ active, payload, label }: any ) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border rounded shadow-lg text-sm">
                    <p className="font-bold mb-1">Tháng {label}</p>
                    <p className="text-blue-600">
                        {payload[0].value?.toLocaleString()} ₫
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header + Bộ lọc thời gian giả lập */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Tổng quan</h1>
                    <p className="text-gray-500 mt-1">Chào mừng quay trở lại, {user?.fullName}</p>
                </div>
                
                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border shadow-sm">
                    <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded">Hôm nay</button>
                    <button className="px-3 py-1 text-sm font-medium bg-blue-50 text-blue-600 rounded shadow-sm">Tháng này</button>
                    <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded">Năm nay</button>
                    <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
                    <button className="p-1 text-gray-500 hover:text-blue-600"><Calendar size={18}/></button>
                </div>
            </div>

            {/* 1. Các thẻ số liệu (Stats Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Tổng doanh thu" 
                    value={`${Number(stats.revenue).toLocaleString('vi-VN')} ₫`} 
                    icon={DollarSign} 
                    color="bg-gradient-to-r from-green-500 to-emerald-600" 
                    trend={12.5}
                />
                <StatCard 
                    title="Đơn hàng mới" 
                    value={stats.totalOrders} 
                    icon={ShoppingBag} 
                    color="bg-gradient-to-r from-blue-500 to-indigo-600" 
                    trend={8.2}
                />
                <StatCard 
                    title="Khách hàng" 
                    value={stats.totalUsers} 
                    icon={Users} 
                    color="bg-gradient-to-r from-orange-400 to-red-500" 
                    trend={-2.4}
                />
                <StatCard 
                    title="Sản phẩm" 
                    value={stats.totalProducts} 
                    icon={Package} 
                    color="bg-gradient-to-r from-purple-500 to-pink-600" 
                    trend={5.0}
                />
            </div>

            {/* 2. Layout chia 2 cột: Biểu đồ (70%) & Cái gì đó khác (30%) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* CỘT TRÁI: BIỂU ĐỒ */}
                
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-800">Biểu đồ doanh thu</h2>
                        <span className="text-sm text-gray-400">7 tháng gần nhất</span>
                    </div>
                    
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={MOCK_CHART_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF'}} dy={10} />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#9CA3AF'}} 
                                    tickFormatter={(value) => `${value / 1000000}M`}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{fill: '#F3F4F6'}} />
                                <Bar dataKey="doanhThu" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* CỘT PHẢI: HOẠT ĐỘNG GẦN ĐÂY HOẶC QUẢNG CÁO */}
                <div className="bg-white p-6 rounded-xl shadow-sm border flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Trạng thái hệ thống</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-600">Server Status</span>
                                <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Online
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-600">Phiên bản</span>
                                <span className="text-xs font-bold text-gray-700">v1.0.2</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white">
                        <h3 className="font-bold text-lg mb-1">Mẹo quản lý</h3>
                        <p className="text-blue-100 text-sm mb-3">Kiểm tra đơn hàng chờ xử lý mỗi sáng để giao hàng nhanh hơn.</p>
                        <button className="text-xs bg-white text-blue-600 px-3 py-1.5 rounded font-bold shadow hover:bg-gray-100 transition">
                            Xem đơn hàng
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. Bảng đơn hàng mới nhất */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">Đơn hàng vừa đặt</h2>
                    <button 
                        onClick={() => navigate('/admin/orders')}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Xem tất cả <ArrowUpRight size={16} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                        <tr>
                            <th className="p-4">Mã đơn</th>
                            <th className="p-4">Khách hàng</th>
                            <th className="p-4">Tổng tiền</th>
                            <th className="p-4">Trạng thái</th>
                            <th className="p-4 text-right">Ngày đặt</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {stats.recentOrders.length > 0 ? (
                            stats.recentOrders.map((order) => {
                                const statusInfo = getStatusStyle(order.status);
                                return (
                                <tr key={order.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 font-bold text-gray-700">#{order.id}</td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-800">{order.fullName || 'Khách vãng lai'}</div>
                                        <div className="text-xs text-gray-400">{order.user?.email}</div>
                                    </td>
                                    <td className="p-4 font-bold text-gray-800">{Number(order.totalAmount).toLocaleString()} ₫</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusInfo.color}`}>
                                            {statusInfo.text}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500 text-right">
                                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                    </td>
                                </tr>
                            )})
                        ) : (
                            <tr><td colSpan={5} className="p-6 text-center text-gray-500">Chưa có đơn hàng nào</td></tr>
                        )}
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}