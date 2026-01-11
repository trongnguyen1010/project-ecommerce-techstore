import { api } from './index'; 

export const uploadImage = async (token: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file); // Tên 'file' phải khớp với Backend

    const response = await api.post('/upload', formData, {
        headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data', // Báo cho server biết đây là file
        },
    });
    
    return response.data.url; // Trả về link ảnh (Cloudinary URL)
};