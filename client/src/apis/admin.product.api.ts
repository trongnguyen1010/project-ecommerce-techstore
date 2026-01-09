import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Xóa sản phẩm (Soft Delete)
export const deleteProduct = async (token: string, id: number) => {
    const response = await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }, // Bắt buộc có Token Admin
    });
    return response.data;
};

//Thêm mới
export const createProduct = async (token: string, data: any) => {
    const response = await api.post('/products', data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Cập nhật
export const updateProduct = async (token: string, id: number, data: any) => {
    const response = await api.patch(`/products/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};