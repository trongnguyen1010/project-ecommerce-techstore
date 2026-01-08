import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Định nghĩa kiểu dữ liệu trả về từ Server
interface AuthResponse {
  accessToken: string;
  user: {
    id: number;
    email: string | null;
    phone: string | null;
    fullName: string;
    role: string;
  };
}

// 1. API Đăng nhập
export const loginAPI = async (identifier: string, password: string) => {
  const response = await api.post<AuthResponse>('/auth/login', { identifier, password });
  return response.data;
};

// 2. API Đăng ký
export const registerAPI = async (data: any) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};