import axios from 'axios';

// Cấu hình đường dẫn gốc của Backend
const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Định nghĩa kiểu dữ liệu cho Product (TypeScript)
export interface Product {
  description: string;
  id: number;
  name: string;
  price: string; // Lưu ý: Decimal của Prisma trả về string ở JSON
  stock: number;
  images: string[];
}

// Hàm gọi API lấy danh sách
export const getProducts = async () => {
  const response = await api.get<Product[]>('/products');
  return response.data;
};

export  const getProduct = async (id: number) => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};