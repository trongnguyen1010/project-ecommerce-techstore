import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Import thêm ChevronLeft, ChevronRight cho nút phân trang
import { Plus, Edit, Trash2, Package, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { getProducts, type Product } from '../../apis/product.api';
import { deleteProduct } from '../../apis/admin.product.api';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const { token, user } = useAuthStore();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. THÊM STATE MỚI
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Bảo vệ trang & Gọi API (Có Debounce tìm kiếm)
  useEffect(() => {
    if (!token || user?.role !== 'ADMIN') {
      toast.error('Cấm phận sự!');
      navigate('/');
      return;
    }

    // Debounce: Đợi 300ms sau khi ngừng gõ mới gọi API
    const timeout = setTimeout(() => {
        fetchProducts();
    }, 300);

    return () => clearTimeout(timeout);
  }, [token, user, page, searchTerm]); // Thêm page, searchTerm vào dependency

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // 2. CẬP NHẬT GỌI API: Truyền thêm searchTerm và page
      const response = await getProducts(undefined, searchTerm, page);
      
      setProducts(response.data);
      setTotalPages(response.meta.last_page); // Lưu tổng số trang
    } catch (error) {
      toast.error("Lỗi tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý Xóa
  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Bạn chắc chắn muốn xóa sản phẩm "${name}"?`)) {
      try {
        await deleteProduct(token!, id);
        toast.success('Đã xóa thành công!');
        fetchProducts(); 
      } catch (error) {
        toast.error('Xóa thất bại!');
      }
    }
  };

  // 3. HÀM XỬ LÝ TÌM KIẾM
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setPage(1); // Reset về trang 1 khi tìm kiếm
  };

  if (loading && products.length === 0) return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Package className="text-blue-600" size={32} />
            Quản lý sản phẩm
          </h1>
          <Link 
            to="/admin/products/new" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition shadow-lg"
          >
            <Plus size={20} /> Thêm sản phẩm
          </Link>
        </div>

        {/* 4. THANH TÌM KIẾM (MỚI) */}
        <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex items-center gap-2">
            <Search className="text-gray-400" size={20} />
            <input 
                type="text" 
                placeholder="Tìm kiếm theo tên sản phẩm..." 
                className="flex-1 outline-none text-gray-700"
                value={searchTerm}
                onChange={handleSearch}
            />
        </div>

        {/* Bảng Danh sách */}
        <div className="bg-white rounded-xl shadow overflow-hidden border">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b text-gray-600 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="p-4 w-20">Hình ảnh</th>
                  <th className="p-4">Tên sản phẩm</th>
                  <th className="p-4">Danh mục</th>
                  <th className="p-4">Giá bán</th>
                  <th className="p-4">Kho</th>
                  <th className="p-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.length === 0 ? (
                    // 5. UI: Thông báo khi không có sản phẩm
                    <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-500 italic">
                            Không tìm thấy sản phẩm nào.
                        </td>
                    </tr>
                ) : (
                    products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition group">
                        <td className="p-4">
                            <div className="w-12 h-12 rounded border overflow-hidden bg-gray-100">
                            {product.images?.[0] ? (
                                <img src={product.images[0]} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-xs text-gray-400">No img</div>
                            )}
                            </div>
                        </td>
                        <td className="p-4 font-medium text-gray-800">
                            {product.name}
                            {/* 6. UI: Hiển thị ID nhỏ bên dưới */}
                            <div className="text-xs text-gray-400 font-normal">ID: #{product.id}</div>
                        </td>
                        <td className="p-4 text-gray-500 text-sm">
                            <span className="bg-gray-100 px-2 py-1 rounded text-gray-600 border border-gray-200">
                                {product.category?.name || 'Chưa phân loại'}
                            </span>
                        </td>
                        <td className="p-4 font-bold text-blue-600">
                            {Number(product.price).toLocaleString()} ₫
                        </td>
                        <td className="p-4">
                            {/* 7. UI: Badge trạng thái đẹp hơn */}
                            <span className={`px-2 py-1 rounded text-xs font-bold border ${product.stock > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                {product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}
                            </span>
                        </td>
                        <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                                <Link 
                                    // Sửa link cho đúng chuẩn router
                                    to={`/admin/products/edit/${product.id}`} 
                                    className="p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded transition"
                                    title="Sửa"
                                >
                                <Edit size={18} />
                                </Link>
                                
                                <button 
                                    onClick={() => handleDelete(product.id, product.name)}
                                    className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded transition"
                                    title="Xóa"
                                >
                                <Trash2 size={18} />
                                </button>
                            </div>
                        </td>
                    </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>

          {/* 8. THANH PHÂN TRANG (MỚI) */}
          {products.length > 0 && (
            <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                    Trang <b>{page}</b> / {totalPages}
                </span>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 bg-white border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button 
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 bg-white border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
          )}
        </div>
    </div>
  );
}