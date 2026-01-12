import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, X, ChevronLeft, ChevronRight, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { getProducts, type Product } from '../apis/product.api';
import { getCategories, type Category } from '../apis/category.api';
import { useCartStore } from '../stores/useCartStore';
import { easeOut, motion } from 'framer-motion';
import Lenis from 'lenis';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // State bộ lọc
  const [selectedCat, setSelectedCat] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  // State phân trang
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const addToCart = useCartStore((state) => state.addToCart);

  // SMOOTH SCROLL (LENIS)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Hàm easing
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy(); 
    };
  }, []);

  // --- LOGIC API ---
  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timeout);
  }, [selectedCat, searchTerm, page]);

  const fetchProducts = async () => {
    try {
      const response = await getProducts(selectedCat, searchTerm, page);
      setProducts(response.data); 
      setTotalPages(response.meta.last_page);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterChange = (catId?: number) => {
      setSelectedCat(catId);
      setPage(1);
  }
  
  const handleSearchChange = (val: string) => {
      setSearchTerm(val);
      setPage(1);
  }

  // Cấu hình hiệu ứng
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      
      {/* --- BANNER QUẢNG CÁO --- */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-16 px-4 mb-8 relative overflow-hidden"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="max-w-lg">
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-bold mb-4"
            >
              Săn Sale Công Nghệ
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-blue-100 text-lg mb-8"
            >
              Nâng cấp thiết bị của bạn với mức giá ưu đãi nhất năm.
            </motion.p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg"
            >
              Mua ngay
            </motion.button>
          </div>
          {/* Ảnh minh họa */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="hidden md:block text-[150px] drop-shadow-2xl"
          >
            🎁
          </motion.div>
        </div>
        {/* Họa tiết nền trang trí */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 flex-grow w-full">
        
        {/* --- THANH CÔNG CỤ (Sticky & Animation) --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center sticky top-4 z-20"
        >
          {/* Bộ lọc danh mục */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            <button 
              onClick={() => setSelectedCat(undefined)} 
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition border
                ${!selectedCat ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200'}`}
            >
              Tất cả
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => handleFilterChange(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition border
                  ${selectedCat === cat.id ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Ô tìm kiếm */}
          <div className="relative w-full md:w-80">
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..." 
              className="w-full pl-10 pr-10 py-2 border rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </motion.div>

        {/* --- DANH SÁCH SẢN PHẨM --- */}
        {products.length === 0 ? (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
             <div className="text-6xl mb-4">🔍</div>
             <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào phù hợp.</p>
             <button onClick={() => {setSearchTerm(''); setSelectedCat(undefined)}} className="text-blue-600 font-bold mt-2 hover:underline">
               Xóa bộ lọc
             </button>
           </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div 
                key={product.id}
                // Animation khi cuộn tới
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }} // Chỉ chạy 1 lần, cách mép dưới 50px thì chạy
                variants={fadeInUp}
                className="bg-white rounded-xl shadow-sm border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col h-full"
              >
                
                {/* Ảnh sản phẩm */}
                <div className="relative pt-[100%] bg-white overflow-hidden border-b">
                  <Link to={`/products/${product.id}`}>
                    <img 
                      src={product.images?.[0] || 'https://via.placeholder.com/300'} 
                      alt={product.name}
                      className="absolute top-0 left-0 w-full h-full object-contain p-4 group-hover:scale-110 transition duration-500"
                    />
                  </Link>
                  {product.stock === 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">Hết hàng</div>
                  )}
                </div>

                {/* Thông tin */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">
                    {product.category?.name || 'Tech'}
                  </div>
                  <Link to={`/products/${product.id}`} className="font-bold text-gray-800 text-lg mb-1 line-clamp-2 hover:text-blue-600 transition">
                    {product.name}
                  </Link>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">
                      {Number(product.price).toLocaleString('vi-VN')} ₫
                    </span>
                    <button 
                      onClick={() => addToCart({ ...product, price: Number(product.price) })}
                      disabled={product.stock === 0}
                      className="bg-blue-50 text-blue-600 p-2.5 rounded-full hover:bg-blue-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                      title="Thêm vào giỏ"
                    >
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* --- THANH PHÂN TRANG --- */}
        {products.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            className="flex justify-center items-center gap-4 mt-12 mb-12"
          >
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border bg-white rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm"
            >
              <ChevronLeft size={24} />
            </button>
            
            <span className="font-bold text-gray-700 bg-white px-4 py-2 rounded-full shadow-sm border">
              Trang {page} / {totalPages}
            </span>

            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 border bg-white rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm"
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </div>

      {/* --- PHẦN FOOTER--- */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Cột 1: Thông tin Shop */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
              <span className="bg-blue-600 text-white p-1 rounded">TS</span> TechStore
            </h3>
            <p className="text-sm leading-relaxed mb-4">
              Hệ thống bán lẻ thiết bị công nghệ chính hãng hàng đầu Việt Nam. Cam kết chất lượng 100%.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-500 transition"><Facebook size={20}/></a>
              <a href="#" className="hover:text-pink-500 transition"><Instagram size={20}/></a>
              <a href="#" className="hover:text-red-500 transition"><Youtube size={20}/></a>
            </div>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Về TechStore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition">Giới thiệu</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Liên hệ</Link></li>
              <li><Link to="/blog" className="hover:text-white transition">Tin tức công nghệ</Link></li>
              <li><Link to="/careers" className="hover:text-white transition">Tuyển dụng</Link></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/policy" className="hover:text-white transition">Chính sách bảo hành</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition">Vận chuyển & Giao hàng</Link></li>
              <li><Link to="/payment" className="hover:text-white transition">Thanh toán an toàn</Link></li>
              <li><Link to="/faq" className="hover:text-white transition">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Liên hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <span>12 Nguyễn Văn Bảo, Gò Vấp, TP.HCM</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-blue-500 flex-shrink-0" />
                <span>1900 123 456</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-blue-500 flex-shrink-0" />
                <span>support@techstore.vn</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Dòng bản quyền */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>© 2026 TechStore. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}