import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Package, Search } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { getProducts, type Product } from '../../apis/product.api';
import { deleteProduct } from '../../apis/admin.product.api';

// // Định nghĩa kiểu dữ liệu
// interface Product {
//   id: number;
//   name: string;
//   price: string; // Do Decimal trả về string
//   stock: number;
//   category: { name: string };
//   images: string[];
// }

export default function AdminProductsPage() {
  const { token, user } = useAuthStore();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Bảo vệ trang Admin
  useEffect(() => {
    if (!token || user?.role !== 'ADMIN') {
      alert('Cấm phận sự!');
      navigate('/');
      return;
    }
    fetchProducts();
  }, [token, user]);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý Xóa
  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Bạn chắc chắn muốn xóa sản phẩm "${name}"?`)) {
      try {
        await deleteProduct(token!, id);
        alert('Đã xóa thành công!');
        fetchProducts(); // Tải lại danh sách để thấy nó biến mất
      } catch (error) {
        alert('Xóa thất bại!');
      }
    }
  };

  if (loading) return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="max-w-7xl mx-auto">
        
        {/* Header: Tiêu đề + Nút Thêm mới */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Package className="text-blue-600" size={32} />
            Quản lý sản phẩm
          </h1>
          <Link 
            to="/admin/products/new" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition shadow-lg shadow-blue-500/30"
          >
            <Plus size={20} /> Thêm sản phẩm
          </Link>
        </div>

        {/* Bảng Danh sách */}
        <div className="bg-white rounded-xl shadow overflow-hidden border">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-gray-600 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="p-4">Hình ảnh</th>
                <th className="p-4">Tên sản phẩm</th>
                <th className="p-4">Danh mục</th>
                <th className="p-4">Giá bán</th>
                <th className="p-4">Kho</th>
                <th className="p-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="w-12 h-12 rounded border overflow-hidden bg-gray-100">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-gray-400">No img</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-gray-800">{product.name}</td>
                  <td className="p-4 text-gray-500 text-sm">
                    <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">
                        {product.category?.name || 'Chưa phân loại'}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-blue-600">
                    {Number(product.price).toLocaleString()} ₫
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    {/* Nút Sửa (Tạm thời chưa link đi đâu) */}
                    <Link to={`/admin/products/edit/${product.id}`} className="p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600 rounded transition">
                      <Edit size={18} />
                    </Link>
                    
                    {/* Nút Xóa */}
                    <button 
                      onClick={() => handleDelete(product.id, product.name)}
                      className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
}