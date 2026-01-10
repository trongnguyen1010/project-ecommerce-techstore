import { Trash2, Minus, Plus } from 'lucide-react';
import { type CartItem as CartItemType, useCartStore } from '../../stores/useCartStore';

// upadate kiểu cho props
interface Props {
  item: {
    id: number;       // Đây là CartItem ID (để xóa/sửa)
    productId: number;// Đây là Product ID (để dẫn link)
    name: string;
    price: number;
    images: string[];
    quantity: number;
  };
}

export default function CartItem({ item }: Props) {
  const { addToCart, decreaseQuantity, removeFromCart } = useCartStore();

  return (
    <div className="flex items-center gap-4 py-4 border-b last:border-0">
        {/* Ảnh sản phẩm */}
        <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border">
            {item.images && item.images.length > 0 ? (
            <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
            ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No img</div>
            )}
        </div>

      {/* Thông tin & Bộ điều khiển */}
      <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h3 className="font-semibold text-gray-800">{item.name}</h3>
            <p className="text-blue-600 font-bold text-sm">
                {Number(item.price).toLocaleString('vi-VN')} ₫
            </p>
        </div>

        {/* Bộ điều khiển số lượng */}
        <div className="flex items-center gap-3">
            <div className="flex items-center border rounded-lg">
                <button 
                // Gọi decreaseQuantity với item.id (CartItem ID)
                onClick={() => decreaseQuantity(item.id)}
                className="p-2 hover:bg-gray-100 text-gray-600 transition"
                >
                <Minus size={16} />
                </button>
                <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                <button 
                // onClick={() => addToCart(item)} // addToCart để tăng số lượng
                onClick={() => addToCart({ id: item.productId, name: item.name, price: item.price, images: item.images })}
                className="p-2 hover:bg-gray-100 text-gray-600 transition"
                >
                <Plus size={16} />
                </button>
            </div>

          {/* Nút Xóa */}
            <button 
            // Xóa theo item.id (CartItem ID)
            onClick={() => removeFromCart(item.id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
            title="Xóa sản phẩm"
            >
                <Trash2 size={18} />
            </button>
        </div>
      </div>
    </div>
  );
}