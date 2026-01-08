import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  orderId: number | null;
}

export default function OrderSuccessModal({ isOpen, orderId }: Props) {
  if (!isOpen) return null;

  return (
    // Lớp phủ mờ đen (Overlay)
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
      
      {/* Hộp thoại chính */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center relative animate-slide-up">
        
        {/* Icon thành công */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-600 w-10 h-10" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">Đặt hàng thành công!</h2>
        <p className="text-gray-500 mb-6">
          Cảm ơn bạn đã mua hàng. Mã đơn hàng của bạn là: <br/>
          <span className="text-blue-600 font-bold text-lg">#{orderId}</span>
        </p>

        {/* Khu vực nút bấm */}
        <div className="space-y-3">
          {/* Nút Xem đơn hàng (Tính năng này tí nữa mình làm sau Auth) */}
          <Link 
            to={`/order-tracking/${orderId}`} // Tạm thời để link này
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition"
          >
            Xem chi tiết đơn hàng
          </Link>

          {/* Nút Về trang chủ */}
          <Link 
            to="/" 
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
          >
            <ShoppingBag size={18} />
            Tiếp tục mua sắm
          </Link>
        </div>

      </div>
    </div>
  );
}