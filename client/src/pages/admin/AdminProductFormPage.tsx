import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Image as ImageIcon } from 'lucide-react'; // Thêm icon
import { useAuthStore } from '../../stores/useAuthStore';
import { createProduct, updateProduct } from '../../apis/admin.product.api';
import { getProduct } from '../../apis/product.api';
import { getCategories, type Category } from '../../apis/category.api';
import toast from 'react-hot-toast';

export default function AdminProductFormPage() {
    const { token, user } = useAuthStore();
    const navigate = useNavigate();
    const { id } = useParams();
    
    const isEditMode = Boolean(id);

    // State Form
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        stock: 0,
        categoryId: '',
        description: '',
        //THAY ĐỔI: Dùng mảng chuỗi thay vì chuỗi đơn
        images: [''], 
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token || user?.role !== 'ADMIN') {
            navigate('/');
            return;
        }

        const initData = async () => {
            try {
                const cats = await getCategories();
                setCategories(cats);

                if (isEditMode && id) {
                    const product = await getProduct(Number(id));
                    setFormData({
                        name: product.name,
                        price: Number(product.price),
                        stock: product.stock,
                        categoryId: String(product.categoryId),
                        description: product.description || '',
                        // Nếu có ảnh thì lấy, nếu không thì để mảng có 1 chuỗi rỗng
                        images: product.images && product.images.length > 0 ? product.images : [''],
                    });
                }
            } catch (error) {
                alert('Lỗi tải dữ liệu!');
            }
        };

        initData();
    }, [token, id, isEditMode]);

    // --- LOGIC XỬ LÝ NHIỀU ẢNH ---
    const handleImageChange = (index: number, value: string) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const addImageField = () => {
        setFormData({ ...formData, images: [...formData.images, ''] });
    };

    const removeImageField = (index: number) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
    };
    // -----------------------------

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Lọc bỏ các dòng link rỗng trước khi gửi
            const cleanImages = formData.images.filter(img => img.trim() !== '');

            const payload = {
                name: formData.name,
                price: Number(formData.price),
                stock: Number(formData.stock),
                categoryId: Number(formData.categoryId),
                description: formData.description,
                images: cleanImages, // Gửi mảng ảnh lên
            };

            if (isEditMode && id) {
                await updateProduct(token!, Number(id), payload);
                // alert('Cập nhật thành công!');
                toast.success('Cập nhật thành công!');
            } else {
                await createProduct(token!, payload);
                // alert('Thêm mới thành công!');
                toast.success('Thêm mới thành công!');
            }

            navigate('/admin/products');
        } catch (error: any) {
            // alert(`Lỗi: ${error.response?.data?.message || 'Có lỗi xảy ra'}`);
            toast.error(`Lỗi: ${error.response?.data?.message || 'Có lỗi xảy ra'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
                
                <div className="flex items-center gap-4 mb-6 border-b pb-4">
                    <button onClick={() => navigate('/admin/products')} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <ArrowLeft size={24} className="text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    <div>
                        <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
                        <input 
                            id="product-name"
                            required type="text" 
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VNĐ)</label>
                            <input 
                                id="product-price"
                                required type="number" min="0"
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                            />
                        </div>
                        <div>
                            <label htmlFor="product-stock" className="block text-sm font-medium text-gray-700 mb-1">Số lượng kho</label>
                            <input 
                                id="product-stock"
                                required type="number" min="0"
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.stock}
                                onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="product-category" className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                        <select 
                            id="product-category"
                            required
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            value={formData.categoryId}
                            onChange={e => setFormData({...formData, categoryId: e.target.value})}
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* KHU VỰC NHẬP NHIỀU ẢNH (DYNAMIC LIST) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh sản phẩm (URL)</label>
                        
                        <div className="space-y-3">
                            {formData.images.map((imgUrl, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    {/* Input Link */}
                                    <div className="flex-1">
                                        <div className="flex items-center border rounded focus-within:ring-2 focus-within:ring-blue-500 bg-white overflow-hidden">
                                            <div className="pl-3 text-gray-400">
                                                <ImageIcon size={18} />
                                            </div>
                                            <input 
                                                // Tạo ID duy nhất cho mỗi dòng để không bị lỗi Accessibility
                                                id={`product-image-${index}`} 
                                                aria-label={`Link ảnh số ${index + 1}`}
                                                
                                                type="url" 
                                                placeholder="https://..."
                                                className="w-full p-2 outline-none"
                                                value={imgUrl}
                                                onChange={(e) => handleImageChange(index, e.target.value)}
                                            />
                                        </div>
                                        {/* Preview ảnh nhỏ ngay dưới input */}
                                        {imgUrl && (
                                            <img 
                                                src={imgUrl} 
                                                alt="Preview" 
                                                className="mt-2 h-20 w-20 object-cover rounded border"
                                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                            />
                                        )}
                                    </div>

                                    {/* Nút Xóa (Chỉ hiện nếu có nhiều hơn 1 dòng hoặc dòng đó có chữ) */}
                                    <button 
                                        type="button"
                                        onClick={() => removeImageField(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                                        title="Xóa ảnh này"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Nút Thêm dòng mới */}
                        <button 
                            type="button"
                            onClick={addImageField}
                            className="mt-3 text-sm flex items-center gap-1 text-blue-600 font-bold hover:underline"
                        >
                            <Plus size={16} /> Thêm ảnh khác
                        </button>
                    </div>

                    <div>
                        <label htmlFor="product-desc" className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
                        <textarea 
                            id="product-desc"
                            rows={4}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                    </div>

                    <button 
                        disabled={loading}
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
                    >
                        <Save size={20} />
                        {loading ? 'Đang lưu...' : (isEditMode ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm mới')}
                    </button>

                </form>
        </div>
    );
}