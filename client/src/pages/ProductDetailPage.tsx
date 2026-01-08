import { useQuery } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import { getProduct } from '../apis/product.api';
import { Loader, ArrowLeft, Check, Package, ShoppingBag } from 'lucide-react'; // Thêm ShoppingBag
import { useCartStore } from '../stores/useCartStore';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook chuyển trang
  const addToCart = useCartStore((state) => state.addToCart);

  // Gọi API lấy thông tin chi tiết
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(Number(id)),
    enabled: !!id,
  });

  // Xử lý Thêm vào giỏ (Ở lại trang hiện tại)
  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      alert(`Đã thêm ${product.name} vào giỏ!`);
    }
  };

  // Xử lý Mua Ngay
  const handleBuyNow = () => {
    if (product) {
      addToCart(product); // 1. Thêm vào giỏ
      navigate('/cart');
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader className="animate-spin text-blue-600" size={40} />
    </div>
  );

  if (error || !product) return (
    <div className="text-center mt-20 text-red-500">
      <h2 className="text-2xl font-bold">Không tìm thấy sản phẩm!</h2>
      <Link to="/" className="text-blue-500 underline mt-4 block">Về trang chủ</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Nút quay lại */}
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6 transition">
          <ArrowLeft size={20} className="mr-2" /> Quay lại danh sách
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* CỘT TRÁI: ẢNH SẢN PHẨM */}
            <div className="p-8 bg-gray-100 flex items-center justify-center">
              <div className="w-full h-[400px] bg-white rounded-xl flex items-center justify-center p-4">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-contain hover:scale-105 transition duration-500" 
                  />
                ) : (
                  <span className="text-gray-400">Không có ảnh</span>
                )}
              </div>
            </div>

            {/* CỘT PHẢI: THÔNG TIN */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold tracking-wide uppercase">
                  {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <p className="text-3xl font-bold text-blue-600 mb-6">
                {Number(product.price).toLocaleString('vi-VN')} ₫
              </p>

              <div className="prose text-gray-500 mb-8">
                <p>{product.description || "Chưa có mô tả cho sản phẩm này."}</p>
              </div>

              {/* Thông tin thêm */}
              <div className="flex items-center gap-6 mb-8 text-sm text-gray-600 border-y py-4">
                <div className="flex items-center gap-2">
                  <Check className="text-green-500" size={18} /> Bảo hành chính hãng
                </div>
                <div className="flex items-center gap-2">
                  <Package className="text-blue-500" size={18} /> Kho: {product.stock}
                </div>
              </div>

              {/* KHU VỰC NÚT BẤM (ĐÃ CẬP NHẬT) */}
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                {/* Nút Thêm vào giỏ */}
                <button 
                  disabled={product.stock === 0}
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 border border-blue-200"
                >
                  <ShoppingBag size={20} />
                  Thêm vào giỏ
                </button>

                {/* Nút Mua Ngay */}
                <button 
                  disabled={product.stock === 0}
                  onClick={handleBuyNow}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-blue-500/30"
                >
                  Mua ngay
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}