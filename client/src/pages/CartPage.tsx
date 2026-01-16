import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';
import CartItem from '../components/cart/CartItem';
import OrderSummary from '../components/cart/OrderSummary';

export default function CartPage() {
  const items = useCartStore((state) => state.items);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <ShoppingBag className="text-blue-600" /> 
          Giỏ hàng của bạn
        </h1>

        {items.length === 0 ? (
          // Giao diện khi giỏ hàng trống
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center ">
            {/* <div className="mb-4 text-gray-300">
               <ShoppingBag size={64} className="mx-auto" />
            </div> */}
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-7359557-6024626.png" alt="Empty" className="w-48 mb-4 opacity-50"/>
            <p className="text-gray-500 text-lg mb-6">Giỏ hàng đang trống trơn...</p>
            <Link to="/" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
              <ArrowLeft size={20} className="mr-2" /> Quay lại mua sắm
            </Link>
          </div>
        ) : (
          // Giao diện khi có hàng (Chia layout 2 cột)
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cột Trái: Danh sách sản phẩm */}
            <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow-sm border">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
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