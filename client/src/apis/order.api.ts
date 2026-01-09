import axios from 'axios';

// Cấu hình axios (Sau này đổi port 3000 thành domain thật chỉ cần sửa 1 chỗ này)
const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Hàm gọi API đặt hàng
export const createOrder = async (orderData: any) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

// Hàm lấy lịch sử đơn hàng (cần truyền token vào header)
export const getMyOrders = async (token: string) => {
  const response = await api.get('/orders/me', {
    headers: {
      Authorization: `Bearer ${token}`, // Gửi lên cho Server kiểm tra
    },
  });
  return response.data;
};