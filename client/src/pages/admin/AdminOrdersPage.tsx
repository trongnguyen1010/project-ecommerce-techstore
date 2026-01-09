import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { getAllOrders, updateOrderStatus } from '../../apis/admin.api';
import { Package, Check, Truck, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
    const { token, user } = useAuthStore();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<any[]>([]);

    // Kiểm tra quyền Admin
    useEffect(() => {
        if (!token || user?.role !== 'ADMIN') {
        // alert('Bạn không có quyền truy cập trang này!');
        toast.error('Bạn không có quyền truy cập trang này!');
        navigate('/');
        return;
        }
        loadOrders();
    }, [token, user]);

    const loadOrders = async () => {
        try {
        if (token) {
            const data = await getAllOrders(token);
            setOrders(data);
        }
        } catch (error) {
        console.error(error);
        toast.error('Lỗi tải danh sách đơn hàng!');
        }
    };

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        if (!token) return;
        if (confirm(`Bạn muốn chuyển đơn #${orderId} sang trạng thái ${newStatus}?`)) {
            await toast.promise(
                updateOrderStatus(token, orderId, newStatus),
                {
                    loading: 'Đang cập nhật trạng thái...',
                    success: 'Cập nhật thành công! 🎉',
                    error: 'Có lỗi xảy ra, vui lòng thử lại.',
                }
            );
            await updateOrderStatus(token, orderId, newStatus);
            loadOrders(); // Tải lại danh sách
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
            <Package className="text-blue-600" /> Quản lý đơn hàng (Admin)
            </h1>

            <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                <tr>
                    <th className="p-4 font-semibold text-gray-600">ID</th>
                    <th className="p-4 font-semibold text-gray-600">Khách hàng</th>
                    <th className="p-4 font-semibold text-gray-600">Tổng tiền</th>
                    <th className="p-4 font-semibold text-gray-600">Trạng thái</th>
                    <th className="p-4 font-semibold text-gray-600 text-right">Hành động</th>
                </tr>
                </thead>
                <tbody className="divide-y">
                {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-blue-600">#{order.id}</td>
                    <td className="p-4">
                        <div className="font-medium">{order.fullName}</div>
                        <div className="text-sm text-gray-500">{order.phone}</div>
                    </td>
                    <td className="p-4 font-bold">{Number(order.totalAmount).toLocaleString()} ₫</td>
                    <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold 
                        ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                            order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :      'bg-green-100 text-green-700'}`}>
                        {order.status}
                        </span>
                    </td>
                    <td className="p-4 flex justify-end gap-2">
                        {order.status === 'PENDING' && (
                        <button 
                            onClick={() => handleStatusChange(order.id, 'SHIPPED')}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-sm flex items-center gap-1 transition"
                        >
                            <Truck size={14} /> Giao hàng
                        </button>
                        )}
                        {order.status === 'SHIPPED' && (
                        <button 
                            onClick={() => handleStatusChange(order.id, 'COMPLETED')}
                            className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-sm flex items-center gap-1 transition"
                        >
                            <Check size={14} /> Hoàn tất
                        </button>
                        )}
                        {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
                        <button 
                        onClick={() => handleStatusChange(order.id, 'CANCELLED')}
                        className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded text-sm flex items-center gap-1 transition"
                        >
                        <X size={14} /> Hủy
                        </button>
                        )}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
    );
}