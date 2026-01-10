import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore'; 
import { addToCartAPI, getCart, removeFromCartAPI, updateCartItemAPI } from '../apis/cart.api';

export interface CartItem {
  id: number;       // Nếu là Local thì là ProductID, DB thì là CartItemID
  productId: number; 
  name: string;
  price: number;
  images: string[];
  quantity: number;
}

interface CartState {
  items: CartItem[];
  
  // Hàm gọi khi User vừa đăng nhập xong để tải giỏ từ DB về
  fetchCart: () => Promise<void>;
  
  //Gửi giỏ Local lên Server khi Login
  syncLocalCartToDB: () => Promise<void>;

  totalPrice: () => number;
  addToCart: (product: any) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  decreaseQuantity: (itemId: number) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      //Tải giỏ hàng từ DB (Dùng khi đã login)
      fetchCart: async () => {
        const token = useAuthStore.getState().token;
        if (!token) return;

        try {
          const cartDB = await getCart(token);
          // Map dữ liệu từ DB sang format của Frontend
          const mappedItems = cartDB.items.map((item: any) => ({
            id: item.id,            
            productId: item.productId,
            name: item.product.name,
            price: Number(item.product.price),
            images: item.product.images || [],
            quantity: item.quantity,
          }));
          set({ items: mappedItems });
        } catch (error) {
          console.error("Lỗi tải giỏ hàng:", error);
        }
      },

      // Logic thêm giỏ hàng (Hybrid)
      addToCart: async (product) => {
        const { token } = useAuthStore.getState();
        const items = get().items;

        //ĐÃ ĐĂNG NHẬP -> GỌI API
        if (token) {
          try {
            await addToCartAPI(token, product.id, 1); // Mặc định thêm 1
            toast.success('Đã thêm vào giỏ hàng!');
            await get().fetchCart(); // Tải lại giỏ mới nhất từ DB
          } catch (error) {
            toast.error('Lỗi thêm giỏ hàng');
          }
        } 
        //CHƯA ĐĂNG NHẬP -> LƯU LOCAL (Như cũ)
        else {
          const existingItem = items.find((i) => i.productId === product.id);
          if (existingItem) {
            const newItems = items.map((i) =>
              i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
            );
            set({ items: newItems });
            toast.success('Đã tăng số lượng!');
          } else {
            const newItem = {
              id: Date.now(), // ID tạm
              productId: product.id,
              name: product.name,
              price: Number(product.price),
              images: product.images || [],
              quantity: 1,
            };
            set({ items: [...items, newItem] });
            toast.success('Đã thêm vào giỏ hàng!');
          }
        }
      },

      // Logic xóa (Hybrid)
      removeFromCart: async (itemId) => {
        const { token } = useAuthStore.getState();
        
        if (token) {
          await removeFromCartAPI(token, itemId); // itemId ở đây là CartItem ID
          await get().fetchCart();
          toast.success('Đã xóa sản phẩm');
        } else {
          // Xóa Local: itemId lúc này là CartItem ID tạm hoặc check theo ProductId
          set({ items: get().items.filter((i) => i.id !== itemId) });
        }
      },

      //Logic giảm số lượng (Hybrid)
      decreaseQuantity: async (itemId) => {
        const { token } = useAuthStore.getState();
        const items = get().items;
        const targetItem = items.find(i => i.id === itemId);

        if (!targetItem) return;

        if (token) {
            // Nếu còn 1 thì xóa luôn, else giảm
            if (targetItem.quantity > 1) {
                await updateCartItemAPI(token, itemId, targetItem.quantity - 1);
            } else {
                await removeFromCartAPI(token, itemId);
            }
            await get().fetchCart();
        } else {
            // Logic Local cũ
             if (targetItem.quantity > 1) {
                const newItems = items.map((i) =>
                    i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
                );
                set({ items: newItems });
            } else {
                set({ items: items.filter((i) => i.id !== itemId) });
            }
        }
      },

      // Đồng bộ Local lên Server khi Login
      syncLocalCartToDB: async () => {
        const { token } = useAuthStore.getState();
        const localItems = get().items; // Lấy items đang có ở Local

        if (!token || localItems.length === 0) return;

        try {
            // Duyệt qua từng món ở Local và đẩy lên Server
            // (Dùng Promise.all để chạy song song)
            const promises = localItems.map(item => 
                addToCartAPI(token, item.productId, item.quantity)
            );
            await Promise.all(promises);

            // đẩy xong tải lại giỏ chuẩn từ DB về
            await get().fetchCart();
            toast.success('Đã đồng bộ giỏ hàng!');
        } catch (error) {
            console.error("Lỗi đồng bộ:", error);
        }
      },

      totalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);