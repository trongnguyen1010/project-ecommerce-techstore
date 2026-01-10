import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useCartStore } from './useCartStore';


interface User {
  id: number;
  fullName: string;
  email: string | null;
  phone: string | null;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      // Hàm đăng nhập: Lưu user & token vào store
      // login: (user, token) => set({ user, token }),

      // SỬA HÀM LOGIN: Thêm logic đồng bộ giỏ hàng
      login: async (user, token) => {
        // Lưu thông tin đăng nhập vào Store trước
        set({ user, token });

        // Gọi CartStore để đồng bộ
        try {
          // Lấy hàng ở Local đẩy lên Server
          await useCartStore.getState().syncLocalCartToDB();
          
          // Tải giỏ hàng mới nhất từ Server về
          await useCartStore.getState().fetchCart();
        } catch (error) {
          console.error("Lỗi đồng bộ giỏ hàng khi login:", error);
        }
      },

      // Hàm đăng xuất: Xóa sạch
    //   logout: () => set({ user: null, token: null }),
    // }),
    // {
    //   name: 'auth-storage', // Tên key trong LocalStorage
    //   storage: createJSONStorage(() => localStorage),
    
    // SỬA HÀM LOGOUT: Xóa luôn giỏ hàng trong máy
      logout: () => {
        set({ user: null, token: null });
        useCartStore.getState().clearCart(); 
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);