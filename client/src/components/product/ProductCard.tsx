import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { type Product } from '../../apis/product.api';
import { useCartStore } from '../../stores/useCartStore';

interface ProductCardProps {
    product: Product;
    variants?: any; // Nhận animation từ cha truyền vào
}

export default function ProductCard({ product, variants }: ProductCardProps) {
    const addToCart = useCartStore((state) => state.addToCart);

    return (
        <motion.div
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col h-full"
        >
            {/* 1. Phần Ảnh */}
            <div className="relative pt-[100%] bg-white overflow-hidden border-b">
                <Link to={`/products/${product.id}`}>
                    <img
                        src={product.images?.[0] || 'https://via.placeholder.com/300'}
                        alt={product.name}
                        className="absolute top-0 left-0 w-full h-full object-contain p-2 md:p-4 group-hover:scale-110 transition duration-500"
                    />
                </Link>

                {/* Badge hết hàng */}
                {product.stock === 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded shadow-sm">
                        Hết hàng
                    </div>
                )}

                {/* Badge giảm giá */}
                {/* <div className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">-20%</div> */}
            </div>

            {/* 2. Phần Thông tin  */}
            <div className="p-2 md:p-4 flex flex-col flex-grow">
                {/* Category */}
                <div className="text-[10px] md:text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold truncate">
                    {product.category?.name || 'Tech'}
                </div>

                {/* Tên sản phẩm: Giới hạn 2 dòng */}
                <Link
                    to={`/products/${product.id}`}
                    className="font-bold text-gray-800 text-sm md:text-lg mb-1 line-clamp-2 hover:text-blue-600 transition min-h-[2.5rem]"
                    title={product.name}
                >
                    {product.name}
                </Link>

                {/* Giá & Nút mua */}
                <div className="mt-auto pt-2 md:pt-4 flex items-center justify-between">
                    <span className="text-sm md:text-xl font-bold text-blue-600">
                        {Number(product.price).toLocaleString('vi-VN')} ₫
                    </span>

                    <button
                        onClick={() => addToCart({ ...product, price: Number(product.price) })}
                        disabled={product.stock === 0}
                        className="bg-blue-50 text-blue-600 p-2 md:p-2.5 rounded-full hover:bg-blue-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                        title="Thêm vào giỏ"
                    >
                        <ShoppingCart size={18} className="md:w-5 md:h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}