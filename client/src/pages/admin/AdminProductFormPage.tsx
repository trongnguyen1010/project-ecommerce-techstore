import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, GripVertical, ArrowUp, ArrowDown } from 'lucide-react'; 
import { useAuthStore } from '../../stores/useAuthStore';
import { createProduct, updateProduct } from '../../apis/admin.product.api';
import { getProduct } from '../../apis/product.api';
import { getCategories, type Category, createCategory } from '../../apis/category.api';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/admin/ImageUpload';

// 🟢 Interface cho FormData
interface ProductFormData {
    name: string;
    price: number;
    stock: number;
    categoryId: string;
    description: string;
    images: string[];
}

export default function AdminProductFormPage() {
    const { token, user } = useAuthStore();
    const navigate = useNavigate();
    const { id } = useParams();
    
    const isEditMode = Boolean(id);

    // 🟢 State Form với type rõ ràng
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        price: 0,
        stock: 0,
        categoryId: '',
        description: '',
        images: [], 
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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
                        images: Array.isArray(product.images) && product.images.length > 0 
                            ? product.images 
                            : [],
                    });
                }
            } catch (error) {
                console.error(error);
                toast.error('Lỗi tải dữ liệu!');
            }
        };

        initData();
    }, [token, id, isEditMode, navigate, user?.role]);

    // Hàm xóa ảnh khỏi danh sách
    const handleRemoveImage = (index: number) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
    };

    // Hàm di chuyển ảnh lên
    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const newImages = [...formData.images];
        [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
        setFormData({ ...formData, images: newImages });
    };

    // Hàm di chuyển ảnh xuống
    const handleMoveDown = (index: number) => {
        if (index === formData.images.length - 1) return;
        const newImages = [...formData.images];
        [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
        setFormData({ ...formData, images: newImages });
    };

    // Drag and drop sắp xếp
    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (dropIndex: number) => {
        if (draggedIndex === null || draggedIndex === dropIndex) return;

        const newImages = [...formData.images];
        const draggedImage = newImages[draggedIndex];
        
        // Xóa ảnh tại vị trí cũ
        newImages.splice(draggedIndex, 1);
        // Chèn ảnh vào vị trí mới
        newImages.splice(dropIndex, 0, draggedImage);
        
        setFormData({ ...formData, images: newImages });
        setDraggedIndex(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // 🟢 Validate dữ liệu
        if (!formData.name.trim()) {
            toast.error('Vui lòng nhập tên sản phẩm!');
            return;
        }

        if (!formData.categoryId) {
            toast.error('Vui lòng chọn danh mục!');
            return;
        }

        if (formData.price <= 0) {
            toast.error('Giá bán phải lớn hơn 0!');
            return;
        }

        if (formData.stock < 0) {
            toast.error('Số lượng kho không được âm!');
            return;
        }

        // Lọc bỏ các dòng link rỗng trước khi gửi
        const cleanImages = formData.images.filter(img => img && img.trim() !== '');

        if (cleanImages.length === 0) {
            toast.error('Vui lòng tải lên ít nhất 1 ảnh!');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                name: formData.name.trim(),
                price: Number(formData.price),
                stock: Number(formData.stock),
                categoryId: Number(formData.categoryId),
                description: formData.description.trim(),
                images: cleanImages,
            };

            if (isEditMode && id) {
                await updateProduct(token!, Number(id), payload);
                toast.success('Cập nhật sản phẩm thành công!');
            } else {
                await createProduct(token!, payload);
                toast.success('Tạo sản phẩm mới thành công!');
            }

            navigate('/admin/products');
        } catch (error: any) {
            console.error(error);
            toast.error(`Lỗi: ${error.response?.data?.message || 'Có lỗi xảy ra'}`);
        } finally {
            setLoading(false);
        }
    };

    // Hàm tạo nhanh danh mục
    const handleQuickCreateCategory = async () => {
        const newName = window.prompt('Nhập tên danh mục mới:');
        if (!newName || newName.trim() === '') return;

        try {
            const newCat = await createCategory(token!, newName);
            setCategories([...categories, newCat]);
            setFormData({ ...formData, categoryId: String(newCat.id) });
            toast.success(`Đã tạo danh mục: ${newName}`);
        } catch (error) {
            console.error(error);
            toast.error('Lỗi tạo danh mục!');
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
                
            <div className="flex items-center gap-4 mb-6 border-b pb-4">
                <button 
                    onClick={() => navigate('/admin/products')} 
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">
                    {isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                
                <div>
                    <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
                    <input 
                        id="product-name"
                        type="text" 
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="Nhập tên sản phẩm"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VNĐ) *</label>
                        <input 
                            id="product-price"
                            type="number" 
                            min="0"
                            step="1000"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.price}
                            onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <label htmlFor="product-stock" className="block text-sm font-medium text-gray-700 mb-1">Số lượng kho *</label>
                        <input 
                            id="product-stock"
                            type="number" 
                            min="0"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.stock}
                            onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                            placeholder="0"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="product-category" className="block text-sm font-medium text-gray-700 mb-1">Danh mục *</label>
                    <div className="flex gap-2">
                        <select 
                            id="product-category"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            value={formData.categoryId}
                            onChange={e => setFormData({...formData, categoryId: e.target.value})}
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>

                        <button 
                            type="button"
                            onClick={handleQuickCreateCategory}
                            className="bg-green-100 text-green-700 px-4 py-2 rounded hover:bg-green-200 transition font-bold whitespace-nowrap"
                            title="Tạo danh mục mới"
                        >
                            + Thêm mới
                        </button>
                    </div>
                </div>
                
                {/* --- KHU VỰC UPLOAD ẢNH --- */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hình ảnh sản phẩm *
                    </label>
                    
                    {/* Upload Component */}
                    <div className="mb-4">
                        <ImageUpload onUpload={(newUrls) => 
                            setFormData(prev => ({
                                ...prev,
                                images: [...prev.images, ...newUrls]
                            }))
                        } />
                    </div>

                    {/* Danh sách ảnh đã có - Có thể sắp xếp */}
                    {formData.images.length > 0 && (
                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2 font-medium">💡 Kéo thả để sắp xếp hoặc dùng nút mũi tên</p>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                {formData.images.map((img, index) => (
                                    <div 
                                        key={index} 
                                        draggable
                                        onDragStart={() => handleDragStart(index)}
                                        onDragOver={handleDragOver}
                                        onDrop={() => handleDrop(index)}
                                        className={`relative group border-2 rounded-lg overflow-hidden h-24 bg-gray-50 transition cursor-move
                                            ${draggedIndex === index ? 'border-blue-500 opacity-50' : 'border-gray-200 hover:border-blue-400'}
                                        `}
                                    >
                                        {/* Badge số thứ tự */}
                                        <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center z-10">
                                            {index + 1}
                                        </div>

                                        {/* Icon grip */}
                                        <div className="absolute top-1 right-1 text-gray-400 opacity-0 group-hover:opacity-100 transition z-10">
                                            <GripVertical size={16} />
                                        </div>

                                        {/* Ảnh */}
                                        <img 
                                            src={img} 
                                            alt={`Product ${index + 1}`} 
                                            className="w-full h-full object-contain"
                                        />

                                        {/* Toolbar - hiển thị khi hover */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 flex items-center justify-between opacity-0 group-hover:opacity-100 transition p-1 z-10">
                                            {/* Nút lên */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMoveUp(index);
                                                }}
                                                disabled={index === 0}
                                                className="p-1 hover:bg-blue-500 rounded disabled:opacity-30 disabled:cursor-not-allowed transition text-white"
                                                title="Di chuyển lên"
                                            >
                                                <ArrowUp size={14} />
                                            </button>

                                            {/* Nút xóa */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveImage(index);
                                                }}
                                                className="p-1 hover:bg-red-500 rounded transition text-white"
                                                title="Xóa ảnh"
                                            >
                                                <X size={14} />
                                            </button>

                                            {/* Nút xuống */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMoveDown(index);
                                                }}
                                                disabled={index === formData.images.length - 1}
                                                className="p-1 hover:bg-blue-500 rounded disabled:opacity-30 disabled:cursor-not-allowed transition text-white"
                                                title="Di chuyển xuống"
                                            >
                                                <ArrowDown size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <p className="text-xs text-gray-500">Hỗ trợ: JPG, PNG, WEBP (Tối đa 5MB)</p>
                </div>

                <div>
                    <label htmlFor="product-desc" className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
                    <textarea 
                        id="product-desc"
                        rows={4}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        placeholder="Nhập mô tả chi tiết sản phẩm..."
                    />
                </div>

                <button 
                    disabled={loading}
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                    <Save size={20} />
                    {loading ? 'Đang lưu...' : (isEditMode ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm mới')}
                </button>

            </form>
        </div>
    );
}