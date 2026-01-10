import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

//API Cập nhật thông tin (Tên, SĐT)
export const updateProfile = async (token: string, data: { fullName: string; phone: string }) => {
  const response = await api.patch('/users/profile', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

//API Đổi mật khẩu
export const changePassword = async (token: string, data: { oldPass: string; newPass: string }) => {
  const response = await api.patch('/users/password', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};