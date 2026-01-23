import { Truck, ShieldCheck, RotateCcw, Headphones, CreditCard } from 'lucide-react';

export default function PolicyBar() {
  const policies = [
    { icon: <Truck size={28} />, title: "Miễn phí vận chuyển", desc: "Cho đơn từ 500k" },
    { icon: <ShieldCheck size={28} />, title: "Bảo hành 12 tháng", desc: "Chính hãng 100%" },
    { icon: <RotateCcw size={28} />, title: "Đổi trả 30 ngày", desc: "Lỗi là đổi mới" },
    { icon: <Headphones size={28} />, title: "Hỗ trợ 24/7", desc: "Hotline: 1900.xxxx" },
  ];

  return (
    <div className="bg-white py-6 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {policies.map((item, index) => (
            <div key={index} className="flex items-center gap-4 group cursor-pointer">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                {item.icon}
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm md:text-base">{item.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}