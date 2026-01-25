import { useCartStore } from '../../stores/useCartStore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function OrderSummary() {
  const totalPrice = useCartStore((state) => state.totalPrice());
  const items = useCartStore((state) => state.items);

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24"
    >
      <h2 className="text-lg font-bold mb-4 text-gray-800">Tổng đơn hàng</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Tạm tính</span>
          <span>{totalPrice.toLocaleString('vi-VN')} ₫</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Phí vận chuyển</span>
          <span className="text-green-600 font-medium">Miễn phí</span>
        </div>
        <div className="border-t pt-3 flex justify-between font-bold text-lg text-blue-600">
          <span>Tổng cộng</span>
          <span>{totalPrice.toLocaleString('vi-VN')} ₫</span>
        </div>
      </div>

      <Link
        to="/checkout"
        className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]"
      >
        Tiến hành thanh toán
      </Link>
    </motion.div>
  );
}