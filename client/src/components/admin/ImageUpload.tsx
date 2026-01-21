import { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { uploadImage } from '../../apis/upload.api';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  onUpload: (url: string) => void; // Callback trả URL ra ngoài cho cha dùng
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const { token } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate dung lượng (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File quá lớn! Vui lòng chọn ảnh dưới 5MB');
      return;
    }

    setIsUploading(true);
    try {
      // Gọi API Upload
      const url = await uploadImage(token!, file);
      
      // GỌI CALLBACK ĐỂ TRẢ URL RA NGOÀI
      onUpload(url);
      
      toast.success('Tải ảnh lên thành công!');
    } catch (error) {
      console.error(error);
      toast.error('Lỗi tải ảnh lên');
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <label className={`
      border-2 border-dashed border-gray-300 rounded-lg h-24 
      flex flex-col items-center justify-center cursor-pointer 
      hover:border-blue-500 hover:bg-blue-50 transition 
      text-gray-400 hover:text-blue-500
      ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
    `}>
      {isUploading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <Upload size={24} />
          <span className="text-xs mt-1 font-medium">Thêm ảnh</span>
        </>
      )}
      <input 
        type="file" 
        accept="image/*" 
        className="hidden"
        disabled={isUploading}
        onChange={handleFileUpload}
      />
    </label>
  );
}