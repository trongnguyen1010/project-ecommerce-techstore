import axios from 'axios';

// Cấu hình đường dẫn gốc của Backend
const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Định nghĩa kiểu dữ liệu cho Product (TypeScript)
export interface Product {
  id: number;
  name: string;
  price: string | number; // API trả về có thể là số hoặc chuỗi
  description: string;
  stock: number;
  images: string[];
  categoryId: number;
  category?: { 
    id: number;
    name: string;
  };
}

// Hàm gọi API lấy danh sách, cho phép truyền params vào
export const getProducts = async (categoryId?: number, search?: string) : Promise<Product[]> => {
  const response = await api.get('/products', {
    params: {
      category: categoryId,
      search: search
    }
  });
  return response.data;
};

export  const getProduct = async (id: number) => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};