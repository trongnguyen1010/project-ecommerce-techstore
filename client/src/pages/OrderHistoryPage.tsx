import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Calendar, ChevronRight, ShoppingBag, ExternalLink } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { getMyOrders } from '../apis/order.api';

// Định nghĩa kiểu dữ liệu cho Đơn hàng (để hiển thị cho dễ)
interface Order {
    id: number;
    createdAt: string;
    status: string;
    totalAmount: string;
    items: {
        id: number;
        quantity: number;
        price: string;
        product: {
        name: string;
        images: string[];
        };
    }[];
}

export default function OrderHistoryPage() {
    const { token, user } = useAuthStore();
    const navigate = useNavigate();
    
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Nếu chưa đăng nhập > về trang login
        if (!token) {
        navigate('/login');
        return;
        }

        // Gọi API lấy đơn hàng
        const fetchOrders = async () => {
        try {
            const data = await getMyOrders(token);
            setOrders(data);
        } catch (error) {
            console.error('Lỗi tải đơn hàng:', error);
        } finally {
            setLoading(false);
        }
        };

        fetchOrders();
    }, [token, navigate]);

    if (loading) return <div className="p-10 text-center">Đang tải lịch sử đơn hàng...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
            
            {/* Tiêu đề */}
            <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <Package className="text-blue-600" size={32} />
            Lịch sử đơn hàng
            </h1>

            {orders.length === 0 ? (
            // Giao diện khi chưa mua gì
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-6">Bạn chưa có đơn hàng nào.</p>
                <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                Mua sắm ngay
                </Link>
            </div>
            ) : (
            // Danh sách đơn hàng
            <div className="space-y-6">
                {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition">
                    
                    {/* Header đơn hàng: Ngày + Trạng thái + Tổng tiền */}
                    <div className="bg-gray-50 p-4 border-b flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-white p-2 rounded-lg border text-center min-w-[60px]">
                        <span className="block text-xs text-gray-500">Đơn hàng</span>
                        <span className="block font-bold text-blue-600 text-lg">#{order.id}</span>
                        </div>
                        <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <Calendar size={14} />
                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold 
                            ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                            order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' : 
                            'bg-green-100 text-green-700'}`}>
                            {order.status === 'PENDING' ? 'Đang xử lý' : order.status}
                        </span>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-sm text-gray-500">Tổng tiền</p>
                        <p className="text-xl font-bold text-gray-800">
                        {Number(order.totalAmount).toLocaleString('vi-VN')} ₫
                        </p>
                    </div>
                    </div>

                    {/* Body đơn hàng: Danh sách sản phẩm */}
                    <div className="p-4">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 py-3 border-b last:border-0">
                        <div className="w-16 h-16 bg-gray-100 rounded border overflow-hidden flex-shrink-0">
                            {item.product.images?.[0] ? (
                            <img src={item.product.images[0]} className="w-full h-full object-cover" />
                            ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No img</div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-800 line-clamp-1">{item.product.name}</h4>
                            <p className="text-sm text-gray-500">x{item.quantity}</p>
                        </div>
                        <span className="font-medium text-gray-600 text-sm">
                            {Number(item.price).toLocaleString('vi-VN')} ₫
                        </span>
                        </div>
                    ))}
                    </div>

                    {/* Footer đơn hàng: Nút hành động (nếu cần) */}
                    <div className="p-4 border-t bg-gray-50 flex justify-end">
                        <Link 
                            to={`/orders/${order.id}`} 
                            className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-4 py-2 rounded-lg transition"
                        >
                            Xem chi tiết đơn hàng <ExternalLink size={16} />
                        </Link>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>
        </div>
    );
}