// src/components/Footer.tsx
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
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
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>© 2026 TechStore. All rights reserved.</p>
        </div>
      </footer>
  );
}