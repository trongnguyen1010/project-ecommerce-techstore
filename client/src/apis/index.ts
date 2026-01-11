import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

//Interceptor: Lấy token thủ công từ LocalStorage
api.interceptors.request.use(
    (config) => {
        // Móc thẳng vào túi dữ liệu của Zustand trong LocalStorage
        const storageData = localStorage.getItem('auth-storage');
        
        if (storageData) {
            try {
                const parsedData = JSON.parse(storageData);
                // Đường dẫn: state -> token
                const token = parsedData.state?.token;

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.log("Token hết hạn");
        }
        return Promise.reject(error);
    }
);