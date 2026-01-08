import { useCartStore } from '../../stores/useCartStore';
import { Link } from 'react-router-dom';

export default function OrderSummary() {
  const totalPrice = useCartStore((state) => state.totalPrice());
  const items = useCartStore((state) => state.items);

  if (items.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border h-fit sticky top-24">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Tổng đơn hàng</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Tạm tính</span>
          <span>{totalPrice.toLocaleString('vi-VN')} ₫</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Phí vận chuyển</span>
          <span className="text-green-600">Miễn phí</span>
        </div>
        <div className="border-t pt-3 flex justify-between font-bold text-lg text-blue-600">
          <span>Tổng cộng</span>
          <span>{totalPrice.toLocaleString('vi-VN')} ₫</span>
        </div>
      </div>

      {/* <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-blue-500/30">
        Tiến hành thanh toán
      </button> */}

      <Link 
        to="/checkout" 
        className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-lg"
      >
        Tiến hành thanh toán
      </Link>
    </div>
  );
}