import { useEffect, useState } from 'react';
import { Trash2, Plus, ExternalLink, Save, ImageIcon } from 'lucide-react';
import { getBanners, createBanner, deleteBanner, type Banner } from '../../apis/banner.api';
import ImageUpload from '../../components/admin/ImageUpload';
import toast from 'react-hot-toast';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    imageUrl: '',
  });

  // Load danh sách
  const fetchBanners = async () => {
    try {
      const data = await getBanners();
      // Nếu API chưa có, data có thể là [], code vẫn chạy tốt
      if (Array.isArray(data)) setBanners(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Xử lý thêm mới
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) return toast.error('Vui lòng upload ảnh banner!');
    if (!formData.title) return toast.error('Vui lòng nhập tiêu đề!');

    setLoading(true);
    try {
      await createBanner(formData);
      toast.success('Thêm banner thành công!');
      
      // Reset form
      setFormData({ title: '', description: '', link: '', imageUrl: '' });
      fetchBanners(); // Load lại list
    } catch (error) {
      toast.error('Lỗi khi thêm banner (Backend chưa hỗ trợ?)');
      // Mẹo: Nếu backend chưa có, bạn có thể push tạm vào state banners để test UI
      // setBanners([...banners, { ...formData, id: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa
  const handleDelete = async (id: number) => {
    if (!confirm('Bạn chắc chắn muốn xóa banner này?')) return;
    try {
      await deleteBanner(id);
      toast.success('Đã xóa banner');
      setBanners(banners.filter(b => b.id !== id));
    } catch (error) {
      toast.error('Lỗi khi xóa');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* CỘT TRÁI: FORM THÊM MỚI */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 sticky top-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Plus className="bg-blue-600 text-white rounded-full p-1" size={24} />
            Thêm Banner Mới
          </h2>
          
          <form onSubmit={handleCreate} className="space-y-4">
             {/* Upload Ảnh */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh (Bắt buộc)</label>
                {formData.imageUrl ? (
                  <div className="relative rounded-lg overflow-hidden border">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-40 object-cover" />
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, imageUrl: ''})}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <ImageUpload onUpload={(urls) => setFormData({...formData, imageUrl: urls[0]})} />
                )}
                <p className="text-xs text-gray-500">Kích thước ảnh: 1920 x 720</p>
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề lớn</label>
                <input 
                  type="text" required placeholder="VD: Siêu Sale 11.11"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                />
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
                <textarea 
                  rows={2} placeholder="VD: Giảm giá 50% cho tất cả Laptop..."
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                />
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link liên kết (Sản phẩm/Danh mục)</label>
                <input 
                  type="text" placeholder="VD: /products/1 hoặc /category/laptop"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})}
                />
             </div>

             <button 
               type="submit" disabled={loading}
               className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
             >
               {loading ? 'Đang lưu...' : <><Save size={20} /> Lưu Banner</>}
             </button>
          </form>
        </div>
      </div>

      {/* CỘT PHẢI: DANH SÁCH BANNER */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
           <ImageIcon size={24} className="text-gray-600" /> Danh sách Banner đang chạy
        </h2>

        {banners.length === 0 ? (
           <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed">
              <p className="text-gray-500">Chưa có banner nào. Hãy thêm mới!</p>
           </div>
        ) : (
           banners.map((banner) => (
             <div key={banner.id} className="bg-white p-4 rounded-xl shadow-sm border flex gap-4 items-center group hover:shadow-md transition">
                {/* Ảnh thumbnail */}
                <div className="w-32 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                   <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                </div>
                
                {/* Thông tin */}
                <div className="flex-grow">
                   <h3 className="font-bold text-gray-800 text-lg">{banner.title}</h3>
                   <p className="text-gray-500 text-sm line-clamp-1">{banner.description}</p>
                   {banner.link && (
                     <a href={banner.link} className="text-blue-500 text-xs flex items-center gap-1 mt-1 hover:underline">
                        <ExternalLink size={12} /> {banner.link}
                     </a>
                   )}
                </div>

                {/* Hành động */}
                <button 
                   onClick={() => handleDelete(banner.id)}
                   className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                   title="Xóa banner"
                >
                   <Trash2 size={20} />
                </button>
             </div>
           ))
        )}
      </div>

    </div>
  );
}