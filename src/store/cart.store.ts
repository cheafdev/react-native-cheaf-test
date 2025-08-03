import { create } from 'zustand';
import { CartItem, CartSummary, Snack } from '../domain/models';

interface CartState {
  items: CartItem[];
  addItem: (snackId: string) => void;
  removeItem: (snackId: string) => void;
  updateQuantity: (snackId: string, quantity: number) => void;
  clearCart: () => void;
  getSummary: (snacks: Snack[]) => CartSummary;
  _hasHydrated: boolean;
}

// Helper function to calculate summary outside the store
const calculateSummary = (items: CartItem[], snacks: Snack[]): CartSummary => {
  let subtotal = 0;

  items.forEach((item: CartItem) => {
    const snack = snacks.find((s: Snack) => s.id === item.snackId);
    if (snack) {
      subtotal += snack.price * item.quantity;
    }
  });

  const tax = subtotal * 0.16; // 16% tax
  const total = subtotal + tax;

  return {
    itemCount: items.reduce(
      (sum: number, item: CartItem) => sum + item.quantity,
      0
    ),
    subtotal,
    tax,
    total,
  };
};

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  addItem: (snackId: string) =>
    set((state) => {
      // Check if item already exists
      const existing = state.items.find((i) => i.snackId === snackId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.snackId === snackId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { snackId, quantity: 1 }] };
    }),
  removeItem: (snackId: string) =>
    set((state) => ({
      items: state.items.filter((i) => i.snackId !== snackId),
    })),
  updateQuantity: (snackId: string, quantity: number) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.snackId === snackId ? { ...i, quantity } : i
      ),
    })),
  clearCart: () => set({ items: [] }),
  getSummary: (snacks: Snack[]) => {
    const { items } = get();
    return calculateSummary(items, snacks);
  },
  _hasHydrated: true,
}));
