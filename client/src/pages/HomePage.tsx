import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Filter, X } from 'lucide-react';
import { getProducts, type Product } from '../apis/product.api';
import { getCategories, type Category } from '../apis/category.api'; // Import Category API
import { useCartStore } from '../stores/useCartStore';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // State bộ lọc
  const [selectedCat, setSelectedCat] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  
  const addToCart = useCartStore((state) => state.addToCart);

  //Tải danh mục khi vào trang
  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  //Tải sản phẩm khi bộ lọc thay đổi (Category hoặc Search)
  useEffect(() => {
    // Tạo hiệu ứng debounce (đợi người dùng gõ xong mới gọi API)
    const timeout = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeout);
  }, [selectedCat, searchTerm]);

  const fetchProducts = async () => {
    try {
      const data = await getProducts(selectedCat, searchTerm);
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      
      {/* --- BANNER QUẢNG CÁO (Trang trí) --- */}
      <div className="bg-blue-600 text-white py-12 px-4 mb-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-lg">
            <h1 className="text-4xl font-bold mb-4">Săn Sale Công Nghệ</h1>
            <p className="text-blue-100 text-lg mb-6">Giảm giá lên đến 50% cho các thiết bị điện tử mới nhất.</p>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg">
              Mua ngay
            </button>
          </div>
          {/* Ảnh minh họa banner (nếu có) */}
          <div className="hidden md:block text-9xl">🎁</div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        
        {/* --- THANH CÔNG CỤ (SEARCH & FILTER) --- */}
        <div className="bg-white p-4 rounded-xl shadow-sm border mb-8 flex flex-col md:flex-row gap-4 justify-between items-center sticky top-20 z-10">
          
          {/* Bộ lọc danh mục */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            <button 
              onClick={() => setSelectedCat(undefined)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition border
                ${!selectedCat ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200'}`}
            >
              Tất cả
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition border
                  ${selectedCat === cat.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Ô tìm kiếm */}
          <div className="relative w-full md:w-80">
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..." 
              className="w-full pl-10 pr-10 py-2 border rounded-full focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* --- DANH SÁCH SẢN PHẨM --- */}
        {products.length === 0 ? (
           <div className="text-center py-20">
             <div className="text-6xl mb-4">🔍</div>
             <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào phù hợp.</p>
             <button onClick={() => {setSearchTerm(''); setSelectedCat(undefined)}} className="text-blue-600 font-bold mt-2 hover:underline">
               Xóa bộ lọc
             </button>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition duration-300 group overflow-hidden flex flex-col h-full">
                
                {/* Ảnh sản phẩm */}
                <div className="relative pt-[100%] bg-white overflow-hidden border-b">
                  <Link to={`/products/${product.id}`}>
                    <img 
                      src={product.images?.[0] || 'https://via.placeholder.com/300'} 
                      alt={product.name}
                      className="absolute top-0 left-0 w-full h-full object-contain p-4 group-hover:scale-105 transition duration-300"
                    />
                  </Link>
                  {product.stock === 0 && (
                     <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">Hết hàng</div>
                  )}
                </div>

                {/* Thông tin */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">
                    {product.category?.name || 'Tech'}
                  </div>
                  <Link to={`/products/${product.id}`} className="font-bold text-gray-800 text-lg mb-1 line-clamp-2 hover:text-blue-600 transition">
                    {product.name}
                  </Link>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">
                      {Number(product.price).toLocaleString('vi-VN')} ₫
                    </span>
                    <button 
                      onClick={() => addToCart({ ...product, price: Number(product.price) })}
                      disabled={product.stock === 0}
                      className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Thêm vào giỏ"
                    >
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}