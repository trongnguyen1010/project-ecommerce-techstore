import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Image as ImageIcon,
         Upload, X, Loader2 } from 'lucide-react'; 
import { useAuthStore } from '../../stores/useAuthStore';
import { createProduct, updateProduct } from '../../apis/admin.product.api';
import { getProduct } from '../../apis/product.api';
import { getCategories, type Category, createCategory } from '../../apis/category.api';
import toast from 'react-hot-toast';
import { uploadImage } from '../../apis/upload.api';
import ImageUpload from '../../components/admin/ImageUpload';

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


    // // --- STATE & LOGIC UPLOAD ẢNH MỚI ---
    // const [isUploading, setIsUploading] = useState(false); // State loading khi up ảnh

    // // Hàm xử lý khi chọn file từ máy tính
    // const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (!file) return;

    //     // Validate dung lượng (Ví dụ 5MB)
    //     if (file.size > 5 * 1024 * 1024) {
    //         toast.error('File quá lớn! Vui lòng chọn ảnh dưới 5MB');
    //         return;
    //     }

    //     setIsUploading(true);
    //     try {
    //         // Gọi API Upload
    //         const url = await uploadImage(token!, file);
            
    //         // Thêm URL vừa nhận được vào mảng images
    //         setFormData(prev => ({
    //             ...prev,
    //             images: [...prev.images, url]
    //         }));
            
    //         toast.success('Tải ảnh lên thành công!');
    //     } catch (error) {
    //         console.error(error);
    //         toast.error('Lỗi tải ảnh lên (Check server/Cloudinary)');
    //     } finally {
    //         setIsUploading(false);
    //         e.target.value = ''; // Reset input để chọn lại được file cũ nếu muốn
    //     }
    // };

    // Hàm xóa ảnh khỏi danh sách
    const handleRemoveImage = (index: number) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
    };
    // // ------------------------------------

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

    // Hàm tạo nhanh danh mục
    const handleQuickCreateCategory = async () => {
        const newName = window.prompt('Nhập tên danh mục mới:');
        if (!newName || newName.trim() === '') return; // Người dùng bấm Hủy hoặc không nhập gì

        try {
            // 1. Gọi API tạo
            const newCat = await createCategory(token!, newName);
            // 2. Thêm vào danh sách hiện tại
            setCategories([...categories, newCat]);
            // 3. Tự động chọn luôn danh mục vừa tạo
            setFormData({ ...formData, categoryId: String(newCat.id) });
            toast.success(`Đã tạo danh mục: ${newName}`);
        } catch (error) {
            toast.error('Lỗi tạo danh mục!');
        }
    }

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
                        {/* <select 
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
                        </select> */}
                        <div className="flex gap-2">
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

                            {/*Nút thêm nhanh */}
                            <button 
                                type="button"
                                onClick={handleQuickCreateCategory}
                                className="bg-green-100 text-green-700 p-2 rounded hover:bg-green-200 transition font-bold whitespace-nowrap"
                                title="Tạo danh mục mới"
                            >
                                + Thêm mới
                            </button>
                        </div>
                    </div>
                    
                    {/* --- KHU VỰC UPLOAD ẢNH --- */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hình ảnh sản phẩm
                        </label>
                        
                        {/* Danh sách ảnh đã có */}
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-4">
                            {formData.images.map((img, index) => (
                                <div key={index} className="relative group border rounded-lg overflow-hidden h-24 bg-gray-50">
                                    <img 
                                    src={img} 
                                    alt={`Product ${index}`} 
                                    className="w-full h-full object-contain"
                                    />
                                    {/* Nút xóa ảnh */}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-sm"
                                        title="Xóa ảnh này"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}

                            {/* Nút Upload */}
                            <ImageUpload onUpload={(url) => {
                                // Khi component con upload xong, nó trả về URL
                                setFormData(prev => ({
                                    ...prev,
                                    images: [...prev.images, url]
                                }));
                            }} />
                        </div>
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