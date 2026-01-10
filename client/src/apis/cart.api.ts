import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
});

//Lấy giỏ hàng từ DB
export const getCart = async (token: string) => {
    const response = await api.get('/cart', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Trả về object Cart (có mảng items)
};

// Thêm vào giỏ DB
export const addToCartAPI = async (token: string, productId: number, quantity: number) => {
    const response = await api.post('/cart', { productId, quantity }, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Cập nhật số lượng
export const updateCartItemAPI = async (token: string, itemId: number, quantity: number) => {
    const response = await api.patch(`/cart/${itemId}`, { quantity }, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Xóa món
export const removeFromCartAPI = async (token: string, itemId: number) => {
    const response = await api.delete(`/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};