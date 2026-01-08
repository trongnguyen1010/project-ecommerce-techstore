// client/src/pages/HomePage.tsx
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../apis/product.api';
import { Loader, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom'; // <--- Import thêm cái này để chuyển trang

export default function HomePage() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="text-red-500">Lỗi rồi!</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <ShoppingBag className="text-blue-600" /> 
          Danh sách sản phẩm
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            // Bọc thẻ Link vào bấm chuyển trang
            <Link to={`/product/${product.id}`} key={product.id} className="group">
              <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition border h-full">
                <div className="h-48 mb-4 flex items-center justify-center overflow-hidden rounded-lg bg-white">
                   {product.images && product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.name} className="h-full w-full object-contain group-hover:scale-105 transition duration-300" />
                  ) : (
                    <div className="bg-gray-200 w-full h-full flex items-center justify-center"></div>
                  )}
                </div>
                <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                <p className="text-blue-600 font-bold mt-2 text-xl">
                  {Number(product.price).toLocaleString('vi-VN')} ₫
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}