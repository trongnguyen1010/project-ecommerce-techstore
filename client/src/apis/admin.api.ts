import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Lấy tất cả đơn hàng (Admin)
export const getAllOrders = async (token: string) => {
  const response = await api.get('/orders', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Cập nhật trạng thái đơn
export const updateOrderStatus = async (token: string, orderId: number, status: string) => {
  const response = await api.patch(`/orders/${orderId}/status`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Lấy thống kê Dashboard
export const getDashboardStats = async (token: string) => {
  const response = await api.get('/stats', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};