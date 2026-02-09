import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  productId: number;
  variantId?: string;
  qty: number;
}

interface CartState {
  items: Record<string, CartItem>;
}

const initialState: CartState = {
  items: {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const key = `${action.payload.productId}_${action.payload.variantId || "base"}`;

      state.items[key] = {
        ...action.payload,
        qty: (state.items[key]?.qty || 0) + action.payload.qty,
      };
    },

    updateQty: (
      state,
      action: PayloadAction<{
        productId: number;
        variantId?: string;
        delta: number;
      }>
    ) => {
      const { productId, variantId, delta } = action.payload;

      // If variantId provided -> update exact item
      if (variantId) {
        const key = `${productId}_${variantId}`;
        const item = state.items[key];
        if (!item) return;

        item.qty += delta;
        if (item.qty <= 0) delete state.items[key];
        return;
      }

      // First try base product
      const baseKey = `${productId}_base`;
      if (state.items[baseKey]) {
        state.items[baseKey].qty += delta;
        if (state.items[baseKey].qty <= 0) delete state.items[baseKey];
        return;
      }

      // Otherwise reduce last variant of this product
      const variantKeys = Object.keys(state.items).filter(
        (k) => state.items[k].productId === productId && state.items[k].variantId
      );

      if (variantKeys.length === 0) return;

      const keyToUpdate = variantKeys[variantKeys.length - 1];

      state.items[keyToUpdate].qty += delta;
      if (state.items[keyToUpdate].qty <= 0) delete state.items[keyToUpdate];
    },

    removeItem: (
      state,
      action: PayloadAction<{ productId: number; variantId?: string }>
    ) => {
      const { productId, variantId } = action.payload;
      const key = `${productId}_${variantId || "base"}`;
      delete state.items[key];
    },

    clearCart: (state) => {
      state.items = {};
    },
  },
});

export const { addItem, updateQty, clearCart, removeItem } = cartSlice.actions;
export default cartSlice.reducer;
