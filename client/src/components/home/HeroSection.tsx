import HomeSlider from './HomeSlider'; // Import cái slider cũ của bạn vào đây
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:h-[500px] mb-8">

      {/* 1. SLIDER CHÍNH (Chiếm 2/3 màn hình) */}
      <div className="md:col-span-2 h-full rounded-2xl overflow-hidden shadow-sm relative group">
        <HomeSlider />
      </div>

      {/* 2. CỘT BANNER PHỤ (Chiếm 1/3 màn hình) */}
      <div className="md:col-span-1 flex flex-col gap-4 h-full">

        {/* Banner phụ 1 (Trên) */}
        <div className="relative h-1/2 rounded-2xl overflow-hidden group cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1592434134753-a70baf7979d5?q=80&w=1000&auto=format&fit=crop"
            alt="Banner phụ 1"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Lớp phủ Gradient để chữ dễ đọc */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-6">
            <span className="text-yellow-400 font-bold text-xs uppercase tracking-wider mb-1">New Arrival</span>
            <h3 className="text-white text-xl font-bold leading-tight mb-2">iPad Pro M4 <br /> Giá cực sốc</h3>
            <Link to="/products" className="text-white text-sm font-medium hover:underline flex items-center gap-1">
              Mua ngay <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Banner phụ 2 (Dưới) */}
        <div className="relative h-1/2 rounded-2xl overflow-hidden group cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1000&auto=format&fit=crop"
            alt="Banner phụ 2"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent flex flex-col justify-center items-end p-6 text-right">
            <span className="text-red-400 font-bold text-xs uppercase tracking-wider mb-1">Sale 50%</span>
            <h3 className="text-white text-xl font-bold leading-tight mb-2">Phụ kiện <br /> Gaming Gear</h3>
            <Link to="/products" className="text-white text-sm font-medium hover:underline flex items-center gap-1">
              Khám phá <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}