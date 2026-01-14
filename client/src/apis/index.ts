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

// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             console.log("Token hết hạn");

//         }
//         return Promise.reject(error);
//     }
// );

// --- RESPONSE: Xử lý Token hết hạn ---
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Kiểm tra nếu lỗi là 401 (Unauthorized)
        if (error.response?.status === 401 && originalRequest) {
            
            // Kiểm tra xem API đang gọi có phải là API Login không
            const isLoginRequest = originalRequest.url.includes('/login') || originalRequest.url.includes('/auth/login');

            // TRƯỜNG HỢP 1: Đang đăng nhập mà bị 401 -> Là do sai mật khẩu -> Trả lỗi về để UI hiện thông báo
            if (isLoginRequest) {
                return Promise.reject(error);
            }

            // TRƯỜNG HỢP 2: Đang dùng app mà bị 401 -> Là do Token hết hạn
            if (!isLoginRequest) {
                console.log("Phiên đăng nhập hết hạn. Đang đăng xuất...");
                
                // Xóa sạch dữ liệu
                localStorage.removeItem('auth-storage');
                localStorage.removeItem('cart-storage');

                // Chuyển hướng về trang Login
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);