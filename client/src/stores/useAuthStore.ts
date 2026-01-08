import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
      login: (user, token) => set({ user, token }),

      // Hàm đăng xuất: Xóa sạch
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage', // Tên key trong LocalStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);