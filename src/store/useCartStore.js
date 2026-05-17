import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      isOpen: false,
      isAccountOpen: false,
      cartItems: [],
      searchQuery: '',
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleAccount: () => set((state) => ({ isAccountOpen: !state.isAccountOpen })),
      openAccount: () => set({ isAccountOpen: true }),
      closeAccount: () => set({ isAccountOpen: false }),
      
      addItem: (item) => set((state) => {
        const existingItem = state.cartItems.find(
          (i) => i.id === item.id && i.potSize === item.potSize
        );
        if (existingItem) {
          return {
            cartItems: state.cartItems.map((i) =>
              i.id === item.id && i.potSize === item.potSize
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
            isOpen: true,
          };
        }
        return { 
          cartItems: [...state.cartItems, item],
          isOpen: true,
        };
      }),
      
      removeItem: (itemId, potSize) => set((state) => ({
        cartItems: state.cartItems.filter((i) => !(i.id === itemId && i.potSize === potSize))
      })),

      updateQuantity: (itemId, potSize, quantity) => set((state) => ({
        cartItems: state.cartItems.map((i) =>
          i.id === itemId && i.potSize === potSize
            ? { ...i, quantity: Math.max(1, quantity) }
            : i
        )
      })),
      
      clearCart: () => set({ cartItems: [] }),

      getCartTotal: () => {
        return get().cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'plant-beauty-cart',
      partialize: (state) => ({ cartItems: state.cartItems })
    }
  )
);
