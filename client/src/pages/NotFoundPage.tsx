import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        
        {/* Animation Icon */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative inline-block mb-8"
        >
          <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
             <AlertCircle size={64} className="text-blue-600" />
          </div>
          {/* Hiệu ứng vòng tròn lan tỏa */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400 rounded-full opacity-20 animate-ping"></div>
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl font-extrabold text-gray-900 mb-4"
        >
          404
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-600 mb-8 max-w-md mx-auto"
        >
          Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị thay đổi.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-1"
          >
            <Home size={20} />
            Về trang chủ
          </Link>
        </motion.div>

      </div>
    </div>
  );
}