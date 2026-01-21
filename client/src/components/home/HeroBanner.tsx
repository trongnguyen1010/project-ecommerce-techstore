import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function HeroBanner() {
  return (
    <div className="relative bg-gray-900 rounded-2xl overflow-hidden mb-10 shadow-2xl">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1531297420499-0f8b7833c91f?q=80&w=3200&auto=format&fit=crop" 
          alt="Tech Banner" 
          className="w-full h-full object-cover opacity-60 hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 md:p-16 max-w-2xl text-white">
        <span className="inline-block px-4 py-1 bg-blue-600 text-xs font-bold uppercase tracking-wider rounded-full mb-4 animate-fade-in-up">
          Sản phẩm mới về
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight animate-fade-in-up delay-100">
          Công nghệ tương lai <br/>
          <span className="text-blue-400">trong tầm tay bạn</span>
        </h2>
        <p className="text-gray-300 text-lg mb-8 animate-fade-in-up delay-200">
          Khám phá bộ sưu tập iPhone 15, Macbook M3 và các thiết bị Gaming Gear đỉnh cao với mức giá ưu đãi nhất tháng này.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
          <button onClick={() => document.getElementById('product-list')?.scrollIntoView({ behavior: 'smooth' })} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/50">
            Mua sắm ngay <ArrowRight size={20} />
          </button>
          <Link to="/products/1" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-full font-bold transition border border-white/30 text-center">
            Xem khuyến mãi
          </Link>
        </div>
      </div>
    </div>
  );
}