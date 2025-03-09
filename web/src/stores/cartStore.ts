import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ClothingItemDto } from '../models/item';
import { OrderItemDto } from '../models/order';

export type CartItem = {
  item: {
    id: string;
    code: string;
    title: string;
    price: number;
    size: string;
    type: string;
    image?: string;
  };
  pieces: number;
  subtotal: number;
};

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;

  // Actions
  addItem: (product: ClothingItemDto, quantity: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  // Helpers
  getCartItems: () => CartItem[];
  getOrderItems: () => OrderItemDto[];
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,

      addItem: (product, quantity) => {
        const { items } = get();
        const existingItemIndex = items.findIndex((item) => item.item.id === product.id);

        if (existingItemIndex !== -1) {
          // Item already exists, update quantity
          const updatedItems = [...items];
          const newQuantity = updatedItems[existingItemIndex].pieces + quantity;
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            pieces: newQuantity,
            subtotal: product.price * newQuantity,
          };

          set({
            items: updatedItems,
            total: calculateTotal(updatedItems),
            itemCount: calculateItemCount(updatedItems),
          });
        } else {
          // Add new item
          const newItem: CartItem = {
            item: {
              id: product.id,
              code: product.code,
              title: product.title,
              price: product.price,
              size: product.size,
              type: product.type,
              image: product.image,
            },
            pieces: quantity,
            subtotal: product.price * quantity,
          };

          const updatedItems = [...items, newItem];

          set({
            items: updatedItems,
            total: calculateTotal(updatedItems),
            itemCount: calculateItemCount(updatedItems),
          });
        }
      },

      removeItem: (itemId) => {
        const { items } = get();
        const updatedItems = items.filter((item) => item.item.id !== itemId);

        set({
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems),
        });
      },

      updateQuantity: (itemId, quantity) => {
        const { items } = get();
        const itemIndex = items.findIndex((item) => item.item.id === itemId);

        if (itemIndex !== -1 && quantity > 0) {
          const updatedItems = [...items];
          updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            pieces: quantity,
            subtotal: updatedItems[itemIndex].item.price * quantity,
          };

          set({
            items: updatedItems,
            total: calculateTotal(updatedItems),
            itemCount: calculateItemCount(updatedItems),
          });
        }
      },

      clearCart: () => {
        set({
          items: [],
          total: 0,
          itemCount: 0,
        });
      },

      getCartItems: () => {
        return get().items;
      },

      getOrderItems: () => {
        return get().items as OrderItemDto[];
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        total: state.total,
        itemCount: state.itemCount,
      }),
    },
  ),
);

// Helper functions
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.subtotal, 0);
};

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.pieces, 0);
};
