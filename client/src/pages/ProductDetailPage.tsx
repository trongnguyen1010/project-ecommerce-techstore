import { useQuery } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProduct } from '../apis/product.api';
import { Loader, ArrowLeft, Check, Package, ShoppingBag,
   Truck, Minus, Plus, Star, ShieldCheck, 
   ChevronLeft,
   ChevronRight} from 'lucide-react'; 
import { useCartStore } from '../stores/useCartStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

// Helper component cho nút cuộn thumbnail
const SliderButton = ({ onClick, direction, disabled }: { onClick: () => void, direction: 'left' | 'right', disabled: boolean }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition disabled:opacity-30 disabled:cursor-not-allowed
        ${direction === 'left' ? 'absolute left-0 z-10' : 'absolute right-0 z-10'}
      `}
    >
      {direction === 'left' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
    </button>
  );

export default function ProductDetailPage() {
  
  const { id } = useParams();
  const navigate = useNavigate(); // Hook chuyển trang
  const addToCart = useCartStore((state) => state.addToCart);

  // State mới: Ảnh đang chọn & Số lượng mua
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Ref để điều khiển cuộn thumbnail
  const scrollRef = useRef<HTMLDivElement>(null);

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

  // --- LOGIC CHUYỂN ẢNH CHÍNH (NEXT / PREV) ---
  const handleNextImage = () => {
    if (!product?.images) return;
    const currentIndex = product.images.indexOf(activeImage);
    const nextIndex = (currentIndex + 1) % product.images.length; // Loop về đầu nếu hết
    setActiveImage(product.images[nextIndex]);
  };

  const handlePrevImage = () => {
    if (!product?.images) return;
    const currentIndex = product.images.indexOf(activeImage);
    const prevIndex = currentIndex === 0 ? product.images.length - 1 : currentIndex - 1; // Loop về cuối nếu ở đầu
    setActiveImage(product.images[prevIndex]);
  };

  // --- LOGIC CUỘN THUMBNAIL ---
  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 150; // Khoảng cách cuộn mỗi lần bấm
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
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

  const hasMultipleImages = product.images && product.images.length > 1;

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
            
            {/* CỘT TRÁI: GALLERY ẢNH (update nut bam) */}
            <div className="p-6 md:p-8 bg-gray-50/50 flex flex-col gap-4">
              {/* Ảnh chính to */}
              <div className="aspect-square bg-white rounded-xl border flex items-center justify-center p-6 relative group overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeImage} // Key thay đổi để kích hoạt animation
                    src={activeImage || product.images?.[0]} 
                    alt={product.name}
                    
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    
                    className="w-full h-full object-contain mix-blend-multiply" 
                  />
                </AnimatePresence>


                {/* Nút Next/Prev trên ảnh chính (Chỉ hiện khi hover và có nhiều ảnh) */}
                {hasMultipleImages && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                {product.stock === 0 && (
                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                     <span className="text-white font-bold text-2xl border-2 border-white px-6 py-2 -rotate-12">HẾT HÀNG</span>
                   </div>
                )}
              </div>

              {/* List ảnh nhỏ (Thumbnail) */}
               {hasMultipleImages && (
                <div className="relative flex items-center px-8"> {/* Padding 2 bên để chừa chỗ cho nút */}
                  
                  {/* Nút lùi */}
                  <button 
                    onClick={() => scrollThumbnails('left')}
                    className="absolute left-0 z-10 p-1.5 rounded-full bg-white border shadow-sm hover:bg-gray-50 text-gray-600 transition"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {/* Container chứa ảnh (Ẩn scrollbar) */}
                  <div 
                    ref={scrollRef}
                    className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth w-full px-1"
                  >
                    {product.images.map((img, index) => (
                      <button 
                        key={index}
                        onClick={() => setActiveImage(img)}
                        className={`w-20 h-20 flex-shrink-0 bg-white rounded-lg border-2 overflow-hidden p-1 transition-all relative
                          ${activeImage === img ? 'border-blue-600 opacity-100 ring-2 ring-blue-100' : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-300'}
                        `}
                      >
                        <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                      </button>
                    ))}
                  </div>

                  {/* Nút tiến */}
                  <button 
                    onClick={() => scrollThumbnails('right')}
                    className="absolute right-0 z-10 p-1.5 rounded-full bg-white border shadow-sm hover:bg-gray-50 text-gray-600 transition"
                  >
                    <ChevronRight size={20} />
                  </button>
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