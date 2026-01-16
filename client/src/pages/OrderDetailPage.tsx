import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderDetail } from '../apis/order.api';
import { ArrowLeft, MapPin, Package, Calendar, CreditCard, Loader, ShoppingBag } from 'lucide-react';
// import { format } from 'date-fns'; // Nếu chưa cài date-fns thì dùng new Date().toLocaleDateString()

// Định nghĩa kiểu dữ liệu (tùy theo backend trả về)
interface OrderDetail {
  id: number;
  status: string;
  totalPrice: number;
  fullName: string;
  phone: string;
  address: string;
  createdAt: string;
  paymentMethod?: string;
  items: {
    id: number;
    quantity: number;
    price: number;
    product: {
        id: number;
        name: string;
        images: string[];
    };
  }[];
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const data = await getOrderDetail(Number(id));
        setOrder(data);
      } catch (err) {
        setError('Không tìm thấy đơn hàng hoặc bạn không có quyền xem.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-blue-600" size={40}/></div>;
  if (error || !order) return <div className="text-center pt-20 text-red-500 font-bold">{error}</div>;

  // Helper function để map màu trạng thái
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header + Nút Back */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/orders" className="flex items-center text-gray-500 hover:text-blue-600 transition">
            <ArrowLeft size={18} className="mr-2"/> Quay lại lịch sử
          </Link>
          <span className="text-sm text-gray-400">Mã đơn: #{order.id}</span>
        </div>

        {/* Card Trạng Thái */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Chi tiết đơn hàng</h1>
              <p className="text-gray-500 flex items-center gap-2 text-sm">
                <Calendar size={16}/> Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wider ${getStatusColor(order.status)}`}>
              {order.status}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM (Chiếm 2 phần) */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b bg-gray-50 font-medium flex items-center gap-2">
                <Package size={18} /> Sản phẩm
              </div>
              <div className="divide-y">
                {order.items.map((item) => (
                  <div key={item.id} className="p-4 flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-md border flex-shrink-0">
                      <img 
                        src={item.product.images?.[0] || 'https://via.placeholder.com/150'} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Link to={`/products/${item.product.id || '#'}`} className="font-medium text-gray-900 hover:text-blue-600 line-clamp-2">
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">Số lượng: x{item.quantity}</p>
                    </div>
                    <div className="text-right font-bold text-blue-600">
                      {Number(item.price).toLocaleString('vi-VN')} ₫
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Tổng tiền */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
              <span className="font-medium text-gray-600">Tổng thanh toán</span>
              <span className="text-2xl font-bold text-blue-600">{Number(order.totalPrice).toLocaleString('vi-VN')} ₫</span>
            </div>
          </div>

          {/* CỘT PHẢI: THÔNG TIN GIAO HÀNG */}
          <div className="md:col-span-1 space-y-6">
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-blue-600"/> Địa chỉ nhận hàng
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p><span className="font-medium text-gray-900">Người nhận:</span> {order.fullName}</p>
                <p><span className="font-medium text-gray-900">SĐT:</span> {order.phone}</p>
                <p className="leading-relaxed border-t pt-2 mt-2">{order.address}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-blue-600"/> Thanh toán
              </h3>
              <p className="text-sm text-gray-600">
                Phương thức: <span className="font-medium text-gray-900">{order.paymentMethod || 'COD (Thanh toán khi nhận hàng)'}</span>
              </p>
            </div>

            {/* Nút Hủy đơn (Chỉ hiện khi Pending) */}
            {order.status === 'PENDING' && (
               <button 
                  onClick={() => alert("Chức năng hủy đang phát triển")}
                  className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition border border-red-200"
               >
                 Hủy đơn hàng
               </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}