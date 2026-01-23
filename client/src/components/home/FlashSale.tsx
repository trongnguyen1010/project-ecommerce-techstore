import { Timer, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FlashSale() {
  return (
    <div className="my-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-6 text-white shadow-lg overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

      {/* Header Flash Sale */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-white text-red-600 p-2 rounded-lg animate-pulse">
             <Zap size={24} fill="currentColor" />
          </div>
          <div>
            <h2 className="text-2xl font-bold italic uppercase tracking-wider">Flash Sale</h2>
            <p className="text-white/80 text-sm">Kết thúc trong:</p>
          </div>
          
          {/* Đồng hồ đếm ngược giả lập */}
          <div className="flex gap-2 ml-4 font-bold text-gray-800">
            <span className="bg-white px-2 py-1 rounded">02</span> :
            <span className="bg-white px-2 py-1 rounded">15</span> :
            <span className="bg-white px-2 py-1 rounded">40</span>
          </div>
        </div>
        
        <Link to="/flash-sale" className="mt-4 md:mt-0 text-white text-sm font-semibold hover:underline flex items-center gap-1">
          Xem tất cả <span className="text-lg">›</span>
        </Link>
      </div>

      {/* List sản phẩm Flash Sale */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 relative z-10">
        {/* Mockup 1 sản phẩm flash sale */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-lg p-3 text-gray-800 transition hover:-translate-y-1 hover:shadow-md">
            <div className="relative aspect-square mb-2">
                <img src={`https://via.placeholder.com/150?text=SP${i}`} className="w-full h-full object-contain"/>
                <span className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">-40%</span>
            </div>
            <div className="text-sm font-medium line-clamp-2 mb-2 h-10">iPhone 15 Pro Max 256GB Titanium</div>
            <div className="flex flex-col">
                <span className="text-red-600 font-bold">29.990.000₫</span>
                <span className="text-xs text-gray-400 line-through">35.000.000₫</span>
            </div>
            {/* Thanh đã bán */}
            <div className="mt-2 w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                <div className="absolute top-0 left-0 bg-red-500 h-full w-[80%] rounded-full"></div>
                <span className="absolute top-0 left-0 w-full text-center text-[8px] text-white font-bold leading-3">Đã bán 80%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}