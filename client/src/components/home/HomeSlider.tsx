import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Circle } from 'lucide-react'; // Import thêm Circle
import { Link } from 'react-router-dom';
import { getBanners } from '../../apis/banner.api';

// Dữ liệu mẫu dự phòng
const BACKUP_SLIDES = [
  {
    id: 1,
    title: "iPhone 15 Pro Max",
    description: "Titanium. Thật sự mạnh mẽ. Trải nghiệm chip A17 Pro.",
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2070&auto=format&fit=crop",
    link: "/products/1"
  },
  {
    id: 2,
    title: "MacBook Pro M3",
    description: "Thời lượng pin dài nhất từng có trên máy Mac.",
    imageUrl: "https://images.unsplash.com/photo-1531297420499-0f8b7833c91f?q=80&w=2070&auto=format&fit=crop",
    link: "/products/2"
  },
  {
      id: 3,
      title: "Sony PlayStation 5",
      description: "Đắm chìm trong thế giới game với tốc độ tải siêu nhanh.",
      imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=2070&auto=format&fit=crop",
      link: "/products/3"
  }
];

export default function HomeSlider() {
    const [slides, setSlides] = useState<any[]>([]);
    const [current, setCurrent] = useState(0);

    // Load Data
    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const data = await getBanners();
                if (data && data.length > 0) {
                    setSlides(data);
                } else {
                    setSlides(BACKUP_SLIDES);
                }
            } catch (e) {
                setSlides(BACKUP_SLIDES);
            }
        };
        fetchSlides();
    }, []);

    // Auto-play
    useEffect(() => {
        if (slides.length === 0) return;
        const timer = setInterval(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        // Cleanup function: Sẽ chạy khi component unmount or khi `current` thay đổi
        //Cứ mỗi lần slide đổi (do bấm hoặc tự chạy), timer cũ bị hủy, timer mới bắt đầu đếm lại từ 0.
        return () => clearInterval(timer);
    }, [current, slides.length]);

    const handleNext = () => setCurrent((prev) => (prev + 1) % slides.length);
    const handlePrev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    // Loading state
    if (slides.length === 0) return <div className="h-[400px] md:h-[500px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>;

    const currentSlide = slides[current];

    return (
        <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-2xl mb-10 shadow-2xl group bg-gray-900">
        
        {/* --- PHẦN HÌNH ẢNH & NỘI DUNG --- */}
        <AnimatePresence mode='wait'>
            <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
            >
            <img 
                src={currentSlide.imageUrl || currentSlide.image} 
                alt={currentSlide.title} 
                className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

            <div className="absolute inset-0 flex flex-col justify-center items-start px-12 md:px-20 max-w-3xl text-white">
                <motion.h2 
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                className="text-3xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg"
                >
                {currentSlide.title}
                </motion.h2>
                
                <motion.p 
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                className="text-gray-200 text-lg md:text-xl mb-8 drop-shadow-md line-clamp-2 max-w-lg"
                >
                {currentSlide.description}
                </motion.p>
                
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                <Link 
                    to={currentSlide.link || '/products'}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-lg hover:-translate-y-1"
                >
                    Xem ngay <ArrowRight size={20} />
                </Link>
                </motion.div>
            </div>
            </motion.div>
        </AnimatePresence>

        {/* --- NÚT ĐIỀU HƯỚNG (PREV / NEXT) --- */}
        {/* Nút Prev */}
        <button 
            onClick={handlePrev}
            className="absolute top-1/2 left-0 -translate-y-1/2 p-3 pl-1 bg-black/20 text-white/80 hover:text-white hover:bg-black/60 backdrop-blur-sm transition-all duration-300 rounded-r-full cursor-pointer z-20 group-hover:pl-2 hover:shadow-lg"
        >
            <ChevronLeft size={32} strokeWidth={3} />
        </button>

        {/* Nút Next */}
        <button 
            onClick={handleNext}
            className="absolute top-1/2 right-0 -translate-y-1/2 p-3 pr-1 bg-black/20 text-white/80 hover:text-white hover:bg-black/60 backdrop-blur-sm transition-all duration-300 rounded-l-full cursor-pointer z-20 group-hover:pr-2 hover:shadow-lg"
        >
            <ChevronRight size={32} strokeWidth={2.5} />
        </button>

        {/* --- DOTS INDICATORS (DẤU CHẤM TRÒN) --- */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {slides.map((_, idx) => (
            <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`transition-all duration-300 rounded-full shadow-sm
                ${idx === current 
                    ? 'w-8 h-2.5 bg-blue-500' // Active: Dài ra và màu xanh
                    : 'w-2.5 h-2.5 bg-white/50 hover:bg-white' // Inactive: Tròn nhỏ
                }
                `}
                aria-label={`Go to slide ${idx + 1}`}
            />
            ))}
        </div>

        </div>
    );
}