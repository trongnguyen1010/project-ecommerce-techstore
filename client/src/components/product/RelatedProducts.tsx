import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, type Product } from '../../apis/product.api';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';

interface RelatedProductsProps {
  categoryId: number;
  currentProductId: number;
}

export default function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    // Gọi API lấy sản phẩm theo CategoryId
    const fetchRelated = async () => {
      try {
        // Giả sử hàm getProducts tham số thứ 1 là categoryId
        const res = await getProducts(categoryId); 
        
        // Lọc bỏ sản phẩm đang xem & chỉ lấy 4 cái
        const related = res.data
          .filter((p: Product) => p.id !== currentProductId)
          .slice(0, 4);
          
        setProducts(related);
      } catch (error) {
        console.error("Lỗi tải sản phẩm liên quan", error);
      }
    };

    if (categoryId) {
      fetchRelated();
    }
  }, [categoryId, currentProductId]);

  if (products.length === 0) return null;

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-blue-600 pl-4">
        Có thể bạn cũng thích
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition group flex flex-col">
            
            {/* Ảnh */}
            <div className="relative pt-[100%] overflow-hidden border-b rounded-t-xl">
              <Link to={`/products/${product.id}`}>
                 <img 
                   src={product.images?.[0]} 
                   alt={product.name}
                   className="absolute top-0 left-0 w-full h-full object-contain p-4 group-hover:scale-110 transition duration-500 mix-blend-multiply" 
                 />
              </Link>
            </div>

            {/* Thông tin */}
            <div className="p-4 flex flex-col flex-grow">
               <Link to={`/products/${product.id}`} className="font-medium text-gray-800 line-clamp-2 hover:text-blue-600 mb-2 min-h-[48px]">
                 {product.name}
               </Link>
               
               <div className="mt-auto flex items-center justify-between">
                  <span className="font-bold text-blue-600">
                    {Number(product.price).toLocaleString('vi-VN')} ₫
                  </span>
                  
                  <button 
                    onClick={() => addToCart({...product, price: Number(product.price)})}
                    className="p-2 bg-gray-100 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition"
                    title="Thêm vào giỏ"
                  >
                    <ShoppingCart size={18} />
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}