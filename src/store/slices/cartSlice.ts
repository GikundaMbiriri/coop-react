import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartProduct {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
  rating: number;
  qty: number;
}

interface CartState {
  items: CartProduct[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Omit<CartProduct, "qty">>) {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (!exists) {
        state.items.push({ ...action.payload, qty: 1 });
      }
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    updateItemQty(
      state,
      action: PayloadAction<{ id: number; qty: number }>
    ) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item && action.payload.qty >= 1) {
        item.qty = action.payload.qty;
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, updateItemQty, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
