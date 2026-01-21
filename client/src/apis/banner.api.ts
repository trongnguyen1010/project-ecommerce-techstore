import { api } from './index'; 

export interface Banner {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  link?: string;
  order?: number;
  createdAt?: string; 
}

// 1. Lấy danh sách (Public)
export const getBanners = async () => {
  try {
    const response = await api.get<Banner[]>('/banners'); // Generic type để gợi ý code
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy banner:", error);
    return [];
  }
};

// 2. Tạo mới (Admin)
// Omit 'id' và 'createdAt' vì DB tự tạo
export const createBanner = async (data: Omit<Banner, 'id' | 'createdAt'>) => {
  const response = await api.post<Banner>('/admin/banners', data);
  return response.data;
};

// 3. Xóa (Admin)
export const deleteBanner = async (id: number) => {
  const response = await api.delete(`/admin/banners/${id}`);
  return response.data;
};