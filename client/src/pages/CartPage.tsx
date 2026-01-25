import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';
import CartItem from '../components/cart/CartItem';
import OrderSummary from '../components/cart/OrderSummary';
import { AnimatePresence, motion } from 'framer-motion';

export default function CartPage() {
  const items = useCartStore((state) => state.items);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 text-gray-900">
          <ShoppingBag className="text-blue-600" />
          Giỏ hàng của bạn
        </h1>

        {items.length === 0 ? (
          // Giao diện khi giỏ hàng trống
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-[60vh] flex flex-col items-center justify-center text-center b"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-100 blur-2xl rounded-full opacity-50"></div>
              <ShoppingBag size={80} className="relative text-blue-200" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng đang trống</h2>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
              Có vẻ bạn chưa chọn được món nào. Hãy dạo một vòng cửa hàng để tìm sản phẩm ưng ý nhé!
            </p>
            <Link to="/" className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition shadow-lg hover:shadow-xl hover:-translate-y-1">
              <ArrowLeft size={20} className="mr-2" /> Quay lại mua sắm
            </Link>
          </motion.div>
        ) : (
          // Giao diện khi có hàng (Chia layout 2 cột)
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cột Trái: Danh sách sản phẩm */}
            <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </AnimatePresence>
            </div>

            {/* Cột Phải: Tổng tiền */}
            <div className="lg:col-span-4">
              <OrderSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}