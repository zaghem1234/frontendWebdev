import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  isOpen: false,
  cartItems: [],
  
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  
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
}));
