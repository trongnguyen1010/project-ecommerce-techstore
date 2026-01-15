import { useQuery } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProduct } from '../apis/product.api';
import { Loader, ArrowLeft, Check, Package, ShoppingBag,
   Truck, Minus, Plus, Star, ShieldCheck } from 'lucide-react'; 
import { useCartStore } from '../stores/useCartStore';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook chuyển trang
  const addToCart = useCartStore((state) => state.addToCart);

  // State mới: Ảnh đang chọn & Số lượng mua
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Gọi API lấy detail
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(Number(id)),
    enabled: !!id,
  });

  // Khi product tải xong, set ảnh đầu tiên làm ảnh chính
  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      setActiveImage(product.images[0]);
    }
  }, [product]);
  
  // Xử lý Thêm vào giỏ (kèm số lượng)
  const handleAddToCart = () => {
    if (product) {
         addToCart(product, quantity);
      // Reset số lượng về 1 sau khi thêm (tuỳ chọn)
      setQuantity(1);
    }
  };

  // Xử lý Mua Ngay
  const handleBuyNow = () => {
    if (product) {
      // addToCart(product); // Thêm vào giỏ
      handleAddToCart();
      navigate('/cart');
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader className="animate-spin text-blue-600" size={40} />
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-red-500 bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">Sản phẩm không tồn tại!</h2>
      <Link to="/" className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">Về trang chủ</Link>
    </div>
  );

  // return (
  //   <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  //     <div className="max-w-5xl mx-auto">
  //       {/* Nút quay lại */}
  //       <Link to="/" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6 transition">
  //         <ArrowLeft size={20} className="mr-2" /> Quay lại danh sách
  //       </Link>

  //       <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
  //         <div className="grid grid-cols-1 md:grid-cols-2">
            
  //           {/* CỘT TRÁI: ẢNH SẢN PHẨM */}
  //           <div className="p-8 bg-gray-100 flex items-center justify-center">
  //             <div className="w-full h-[400px] bg-white rounded-xl flex items-center justify-center p-4">
  //               {product.images && product.images.length > 0 ? (
  //                 <img 
  //                   src={product.images[0]} 
  //                   alt={product.name} 
  //                   className="w-full h-full object-contain hover:scale-105 transition duration-500" 
  //                 />
  //               ) : (
  //                 <span className="text-gray-400">Không có ảnh</span>
  //               )}
  //             </div>
  //           </div>

  //           {/* CỘT PHẢI: THÔNG TIN */}
  //           <div className="p-8 md:p-12 flex flex-col justify-center">
  //             <div className="mb-4">
  //               <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold tracking-wide uppercase">
  //                 {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
  //               </span>
  //             </div>
              
  //             <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
  //               {product.name}
  //             </h1>

  //             <p className="text-3xl font-bold text-blue-600 mb-6">
  //               {Number(product.price).toLocaleString('vi-VN')} ₫
  //             </p>

  //             <div className="prose text-gray-500 mb-8">
  //               <p>{product.description || "Chưa có mô tả cho sản phẩm này."}</p>
  //             </div>

  //             {/* Thông tin thêm */}
  //             <div className="flex items-center gap-6 mb-8 text-sm text-gray-600 border-y py-4">
  //               <div className="flex items-center gap-2">
  //                 <Check className="text-green-500" size={18} /> Bảo hành chính hãng
  //               </div>
  //               <div className="flex items-center gap-2">
  //                 <Package className="text-blue-500" size={18} /> Kho: {product.stock}
  //               </div>
  //             </div>

  //             {/* KHU VỰC NÚT BẤM (ĐÃ CẬP NHẬT) */}
  //             <div className="flex flex-col sm:flex-row gap-4 w-full">
  //               {/* Nút Thêm vào giỏ */}
  //               <button 
  //                 disabled={product.stock === 0}
  //                 onClick={handleAddToCart}
  //                 className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 border border-blue-200"
  //               >
  //                 <ShoppingBag size={20} />
  //                 Thêm vào giỏ
  //               </button>

  //               {/* Nút Mua Ngay */}
  //               <button 
  //                 disabled={product.stock === 0}
  //                 onClick={handleBuyNow}
  //                 className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-blue-500/30"
  //               >
  //                 Mua ngay
  //               </button>
  //             </div>

  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb Navigation (Thay cho nút back đơn điệu) */}
        <nav className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600 transition">Trang chủ</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
            
            {/* --- CỘT TRÁI: GALLERY ẢNH --- */}
            <div className="p-6 md:p-8 bg-gray-50/50 flex flex-col gap-4">
              {/* Ảnh chính to */}
              <div className="aspect-square bg-white rounded-xl border flex items-center justify-center p-6 relative group overflow-hidden">
                <img 
                  src={activeImage || product.images?.[0]} 
                  alt={product.name} 
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" 
                />
                {product.stock === 0 && (
                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                     <span className="text-white font-bold text-2xl border-2 border-white px-6 py-2 -rotate-12">HẾT HÀNG</span>
                   </div>
                )}
              </div>

              {/* List ảnh nhỏ (Thumbnail) */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {product.images.map((img, index) => (
                    <button 
                      key={index}
                      onClick={() => setActiveImage(img)}
                      className={`w-20 h-20 flex-shrink-0 bg-white rounded-lg border-2 overflow-hidden p-1 transition-all
                        ${activeImage === img ? 'border-blue-600 opacity-100' : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-300'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* --- CỘT PHẢI: THÔNG TIN CHI TIẾT --- */}
            <div className="p-6 md:p-10 flex flex-col">
              <div className="mb-2">
                <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">
                   CHÍNH HÃNG
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Rating giả lập (Tạo độ uy tín) */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                </div>
                <span className="text-sm text-gray-500 border-l pl-2 ml-2">Đã bán 120+</span>
              </div>

              <div className="flex items-end gap-4 mb-8">
                 <p className="text-4xl font-bold text-blue-600">
                    {Number(product.price).toLocaleString('vi-VN')} <span className="text-2xl">₫</span>
                 </p>
                 {/* Giá gốc giả định (tăng 20%) để kích thích mua */}
                 <p className="text-lg text-gray-400 line-through mb-1">
                    {(Number(product.price) * 1.2).toLocaleString('vi-VN')} ₫
                 </p>
              </div>

              {/* Mô tả ngắn gọn */}
              <div className="prose text-gray-600 mb-8 line-clamp-3">
                <p>{product.description || "Sản phẩm công nghệ cao cấp, bảo hành chính hãng."}</p>
              </div>

              <div className="border-t border-b border-gray-100 py-6 mb-8 space-y-6">
                 {/* Bộ chọn số lượng */}
                 <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Số lượng:</span>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                          <button 
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            disabled={quantity <= 1 || product.stock === 0}
                            className="p-2 hover:bg-gray-100 disabled:opacity-30 transition"
                          ><Minus size={16}/></button>
                          
                          <span className="w-10 text-center font-bold text-gray-900">{quantity}</span>
                          
                          <button 
                            onClick={() => setQuantity(q => q + 1)}
                            disabled={quantity >= product.stock || product.stock === 0}
                            className="p-2 hover:bg-gray-100 disabled:opacity-30 transition"
                          ><Plus size={16}/></button>
                        </div>
                        <span className="text-sm text-gray-500">
                          {product.stock} sản phẩm có sẵn
                        </span>
                    </div>
                 </div>
              </div>

              {/* KHU VỰC NÚT BẤM */}
              <div className="flex flex-col sm:flex-row gap-4 w-full mb-8">
                <button 
                  disabled={product.stock === 0}
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 border border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={20} />
                  Thêm vào giỏ
                </button>

                <button 
                  disabled={product.stock === 0}
                  onClick={handleBuyNow}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mua ngay
                </button>
              </div>

              {/* Chính sách (Icon Trust) */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-blue-600" size={20} />
                  <span>Bảo hành 12 tháng</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="text-blue-600" size={20} />
                  <span>Miễn phí vận chuyển</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span>100% Chính hãng</span>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="text-blue-600" size={20} />
                  <span>Đổi trả trong 7 ngày</span>
                </div>
              </div>

            </div>
          </div>
        </motion.div>

        {/* PHẦN MÔ TẢ CHI TIẾT DƯỚI CÙNG */}
        <div className="mt-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-xl font-bold mb-4 border-l-4 border-blue-600 pl-3">Mô tả sản phẩm</h3>
           <div className="prose max-w-none text-gray-600 whitespace-pre-line">
              {product.description || "Đang cập nhật nội dung chi tiết..."}
           </div>
        </div>
      </div>
    </div>
  );

}