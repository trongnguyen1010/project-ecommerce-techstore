import { useState, useCallback } from 'react';
import { Upload, Loader2, CloudUpload } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { uploadImage } from '../../apis/upload.api';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
  onUpload: (urls: string[]) => void; 
  disabled?: boolean;
}

export default function ImageUpload({ onUpload, disabled = false }: ImageUploadProps) {
  const { token } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      // Upload song song
      const results = await Promise.allSettled(
        acceptedFiles.map(async (file) => {
          if (file.size > 5 * 1024 * 1024) {
            toast.error(`${file.name} quá lớn (>5MB)`);
            throw new Error('File too large');
          }

          const url = await uploadImage(token!, file);
          return url;
        })
      );

      // Lọc những file upload thành công
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          uploadedUrls.push(result.value);
        }
      });

      if (uploadedUrls.length > 0) {
        // ✅ Chỉ gọi onUpload, để parent component quản lý danh sách
        onUpload(uploadedUrls);
        toast.success(`Tải lên ${uploadedUrls.length} ảnh thành công!`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Lỗi tải ảnh lên');
    } finally {
      setIsUploading(false);
    }
  }, [token, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    multiple: true,
    disabled: isUploading || disabled
  });

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-4 h-32
          flex flex-col items-center justify-center cursor-pointer 
          transition-all duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="flex flex-col items-center text-blue-500">
            <Loader2 className="animate-spin mb-2" size={24} />
            <span className="text-sm font-medium">Đang tải...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            {isDragActive ? (
              <>
                <CloudUpload size={32} className="text-blue-500 animate-bounce" />
                <span className="text-sm mt-2 font-medium text-blue-500">Thả tay để upload!</span>
              </>
            ) : (
              <>
                <Upload size={24} />
                <span className="text-sm mt-2 font-medium">Kéo thả hoặc click chọn</span>
                <span className="text-xs mt-1">(Nhiều ảnh, tối đa 5MB)</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* ❌ Xóa preview ở đây - để parent component quản lý */}
    </div>
  );
}