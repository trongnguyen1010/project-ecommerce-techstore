import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, X, ChevronLeft, ChevronRight, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { getProducts, type Product } from '../apis/product.api';
import { getCategories, type Category } from '../apis/category.api';
import { useCartStore } from '../stores/useCartStore';
import { easeOut, motion } from 'framer-motion';
import Lenis from 'lenis';
import HomeSlider from '../components/home/HomeSlider';
import ProductCard from '../components/product/ProductCard';
import FlashSale from '../components/home/FlashSale';
import PolicyBar from '../components/home/PolicyBar';
import HeroSection from '../components/home/HeroSection';
import BrandMarquee from '../components/home/BrandMarquee';

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

  // SMOOTH SCROLL (LENIS) - ĐÃ FIX
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number; // 1. Tạo biến để lưu ID của khung hình

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf); // 2. Lưu ID vào biến
    }

    rafId = requestAnimationFrame(raf); // 3. Khởi chạy

    return () => {
      cancelAnimationFrame(rafId); // 4.Hủy vòng lặp khi rời trang
      lenis.destroy();             // 5.Hủy instance Lenis

      // 6. Trả lại quyền điều khiển cuộn cho trình duyệt (để trang khác cuộn được)
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.overflow = 'auto';
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
      {/* BANNER SLIDER */}
      {/* <div className="px-4 pt-6 max-w-7xl mx-auto w-full">
        <HomeSlider />
      </div> */}
      <div className="px-4 pt-6 max-w-7xl mx-auto w-full mb-8">
            {/* <HomeSlider /> */}
            <HeroSection/>
      </div>
      <div className="bg-white border-y border-gray-100 py-6">
        <BrandMarquee />
      </div>
      {/*THANH CAM KẾT */}
      <PolicyBar />

      <div className="max-w-6xl mx-auto px-4 flex-grow w-full pb-10">
      
      {/* 2. FLASH SALE (Mới) */}
      {/* <FlashSale /> */}

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
            <button onClick={() => { setSearchTerm(''); setSelectedCat(undefined) }} className="text-blue-600 font-bold mt-2 hover:underline">
              Xóa bộ lọc
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6 mb-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variants={fadeInUp}
              />
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
    </div>
  );
}