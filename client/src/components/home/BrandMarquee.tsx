import { motion } from 'framer-motion';

const brands = [
    "Apple", "Samsung", "Sony", "Asus", "Dell", "HP", "Lenovo", "LG", "Xiaomi", "Oppo"
];

// Bạn có thể thay string bằng <img> logo thật
export default function BrandMarquee() {
    return (
        <div className="w-full overflow-hidden bg-white py-3 border-b border-gray-100">
            <div className="relative w-full">
                {/* Hiệu ứng mờ 2 bên cạnh */}
                <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
                <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10"></div>

                {/* Animation chạy vô tận */}
                <div className="flex overflow-hidden">
                    <motion.div
                    className="flex gap-16 whitespace-nowrap py-2 pr-16"
                    animate={{ x: [0, "-50%"] }} //Chạy 50% chiều dài
                    transition={{
                        repeat: Infinity, 
                        duration: 30, 
                        ease: "linear" 
                    }}
                >
                    {/* Render 2 lần để tạo vòng lặp không bị đứt quãng */}
                    {[...brands, ...brands].map((brand, index) => (
                        <span key={index} className="text-2xl font-bold text-gray-400 hover:text-blue-600 cursor-pointer transition-colors uppercase select-none">
                            {brand}
                        </span>
                    ))}
                </motion.div>
                </div>
                
            </div>
        </div>
    );
}