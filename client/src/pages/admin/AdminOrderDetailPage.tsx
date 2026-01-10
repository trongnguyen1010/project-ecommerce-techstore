import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Truck, User, MapPin, Phone, Package } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { getOrderById, updateOrder } from '../../apis/admin.api';
import toast from 'react-hot-toast';

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const { token, user } = useAuthStore();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // State form chỉnh sửa thông tin giao hàng
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    status: '',
  });

  useEffect(() => {
    if (!token || user?.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    const fetchOrder = async () => {
      try {
        const data = await getOrderById(token, Number(id));
        setOrder(data);
        // Đổ dữ liệu vào form
        setFormData({
          fullName: data.fullName,
          phone: data.phone,
          address: data.address,
          status: data.status,
        });
      } catch (error) {
        toast.error('Không tìm thấy đơn hàng');
        navigate('/admin/orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (window.confirm('Bạn có chắc muốn cập nhật thông tin đơn hàng này?')) {
      await toast.promise(
        updateOrder(token!, Number(id), formData),
        {
          loading: 'Đang lưu thay đổi...',
          success: 'Cập nhật thành công!',
          error: 'Lỗi cập nhật',
        }
      );
      // Refresh lại dữ liệu để đảm bảo đồng bộ
      const data = await getOrderById(token!, Number(id));
      setOrder(data);
    }
  };

  if (loading) return <div className="p-8 text-center">Đang tải chi tiết đơn hàng...</div>;
  if (!order) return null;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/orders" className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft size={24} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              Đơn hàng #{order.id}
            </h1>
            <p className="text-sm text-gray-500">
              Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}
            </p>
          </div>
        </div>
        
        <span className={`px-4 py-2 rounded-full font-bold text-sm border
            ${order.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
              order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
              order.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200' :
              'bg-green-50 text-green-700 border-green-200'}`}>
            {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="text-blue-600" /> Sản phẩm trong đơn
            </h2>
            <div className="divide-y">
              {order.items.map((item: any) => (
                <div key={item.id} className="py-4 flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded border overflow-hidden flex-shrink-0">
                    {item.product.images?.[0] ? (
                      <img src={item.product.images[0]} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-gray-400">No img</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                    <p className="text-sm text-gray-500">Đơn giá: {Number(item.price).toLocaleString()} ₫</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">x{item.quantity}</p>
                    <p className="font-bold text-blue-600">
                      {(Number(item.price) * item.quantity).toLocaleString()} ₫
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mt-4 flex justify-between items-center">
              <span className="font-medium text-gray-600">Tổng tiền thanh toán</span>
              <span className="text-2xl font-bold text-blue-600">
                {Number(order.totalAmount).toLocaleString('vi-VN')} ₫
              </span>
            </div>
          </div>

          {/* Thông tin tài khoản đặt hàng (Read only) */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
             <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="text-blue-600" /> Tài khoản đặt hàng
            </h2>
            {order.user ? (
               <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Họ tên Account</p>
                    <p className="font-medium">{order.user.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium">{order.user.email}</p>
                  </div>
               </div>
            ) : (
                <p className="text-gray-500 italic">Khách vãng lai (Không có tài khoản)</p>
            )}
          </div>
        </div>

        {/* CỘT PHẢI: FORM CHỈNH SỬA THÔNG TIN */}
        <div className="lg:col-span-1">
          <form onSubmit={handleUpdate} className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Truck className="text-blue-600" /> Thông tin giao hàng
            </h2>
            
            <div className="space-y-4">
              {/* Trạng thái */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái đơn</label>
                <select 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="PENDING">Đang xử lý (PENDING)</option>
                  <option value="SHIPPED">Đang giao (SHIPPED)</option>
                  <option value="COMPLETED">Hoàn tất (COMPLETED)</option>
                  <option value="CANCELLED">Đã hủy (CANCELLED)</option>
                </select>
              </div>

              {/* Tên người nhận */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Người nhận</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="text" 
                    required
                    className="w-full pl-9 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="text" 
                    required
                    className="w-full pl-9 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              {/* Địa chỉ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ giao hàng</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                  <textarea 
                    rows={4}
                    required
                    className="w-full pl-9 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="pt-2">
                <button 
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition"
                >
                    <Save size={18} /> Lưu thay đổi
                </button>
              </div>

            </div>
          </form>
        </div>

      </div>
    </div>
  );
}