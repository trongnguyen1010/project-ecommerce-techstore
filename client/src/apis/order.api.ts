import { api } from './index'; 


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