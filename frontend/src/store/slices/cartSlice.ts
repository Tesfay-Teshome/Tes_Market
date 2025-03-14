import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cart, CartItem } from '@/types';

export interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
}

const initialState: CartState = {
  items: [],
  total: 0,
  loading: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Cart>) => {
      state.items = action.payload.items;
      state.total = action.payload.total_amount;
      state.loading = false;
    },
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.product.id === action.payload.product.id
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        existingItem.subtotal = existingItem.quantity * existingItem.product.price;
      } else {
        state.items.push(action.payload);
      }

      state.total = state.items.reduce((total, item) => total + item.subtotal, 0);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = state.items.reduce((total, item) => total + item.subtotal, 0);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        item.subtotal = item.quantity * item.product.price;
        state.total = state.items.reduce((total, item) => total + item.subtotal, 0);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setCart,
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  setLoading,
} = cartSlice.actions;
export default cartSlice.reducer;