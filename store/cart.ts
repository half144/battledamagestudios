import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === item.id);

        if (existingItem) {
          const updatedItems = currentItems.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
          set((state) => ({
            items: updatedItems,
            totalItems: state.totalItems + 1,
            totalPrice: state.totalPrice + item.price,
          }));
        } else {
          const newItem = { ...item, quantity: 1 };
          set((state) => ({
            items: [...state.items, newItem],
            totalItems: state.totalItems + 1,
            totalPrice: state.totalPrice + item.price,
          }));
        }
      },

      removeItem: (itemId) => {
        const currentItems = get().items;
        const itemToRemove = currentItems.find((i) => i.id === itemId);

        if (itemToRemove) {
          set((state) => ({
            items: state.items.filter((i) => i.id !== itemId),
            totalItems: state.totalItems - itemToRemove.quantity,
            totalPrice:
              state.totalPrice - itemToRemove.price * itemToRemove.quantity,
          }));
        }
      },

      updateQuantity: (itemId, quantity) => {
        const currentItems = get().items;
        const item = currentItems.find((i) => i.id === itemId);

        if (item) {
          const quantityDiff = quantity - item.quantity;
          const updatedItems = currentItems.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          );

          set((state) => ({
            items: updatedItems,
            totalItems: state.totalItems + quantityDiff,
            totalPrice: state.totalPrice + item.price * quantityDiff,
          }));
        }
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
