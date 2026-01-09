// client/src/stores/useCartStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '../apis/product.api';
import toast from 'react-hot-toast';

// Định nghĩa kiểu dữ liệu cho 1 món hàng trong giỏ (kế thừa Product và thêm số lượng)
export interface CartItem extends Product {
  quantity: number;
}

// Định nghĩa các hành động của Giỏ hàng
interface CartState {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  decreaseQuantity: (productId: number) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // Hàm Thêm vào giỏ
      addToCart: (product) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id)

        if (existingItem){
            //neu da co -> + them 1
            set({
                items: items.map((item) =>
                    item.id === product.id
                    ? {...item, quantity: item.quantity + 1}
                    :item
                )
            });
            toast.success('Đã tăng số lượng sản phẩm!');
        }else{
            //neu chua co -> them moi
            set({ items: [...items, {...product, quantity: 1}] });
            toast.success('Đã thêm vào giỏ hàng!');
        }
      },

      // Hàm Xóa khỏi giỏ
      removeFromCart: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),

      // Hàm Xóa sạch giỏ
      clearCart: () => set({ items: [] }),

      // Hàm tính tổng tiền
      totalPrice: () => {
        return get().items.reduce(
          (total, item) => total + Number(item.price) * item.quantity,
          0
        );
      },
      // logic cho hàm Giảm số lượng
      decreaseQuantity: (productId) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === productId);

        if (existingItem && existingItem.quantity > 1) {
          // Nếu số lượng > 1 thì giảm đi 1
          set({
            items: items.map((item) =>
              item.id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            ),
          });
        } else {
          // Nếu số lượng = 1 mà bấm trừ thì xóa luôn
          set((state) => ({
            items: state.items.filter((item) => item.id !== productId),
          }));
        }
      },
    }),
    {
      name: 'cart-storage', // Tên key lưu trong LocalStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);