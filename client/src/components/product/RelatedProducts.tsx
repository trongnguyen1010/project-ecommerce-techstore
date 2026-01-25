import { useEffect, useState } from 'react';
import { getProducts, type Product } from '../../apis/product.api';
import ProductCard from './ProductCard';
import { easeOut, motion } from 'framer-motion';

interface RelatedProductsProps {
  categoryId: number;
  currentProductId: number;
}

export default function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);

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
    <div className="mt-16 mb-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="w-1 h-8 bg-blue-600 rounded-full block"></span>
        Có thể bạn cũng thích
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}