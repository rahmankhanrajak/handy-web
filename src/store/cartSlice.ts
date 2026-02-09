import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  productId: number;
  variantId?: string;
  addons?: string[];   // ✅ add-ons
  qty: number;
}

interface CartState {
  items: Record<string, CartItem>;
}

const initialState: CartState = {
  items: {},
};

// ✅ helper to generate unique key
const makeKey = (productId: number, variantId?: string, addons?: string[]) => {
  const addonKey =
    addons && addons.length > 0 ? addons.slice().sort().join("-") : "noaddons";

  return `${productId}_${variantId || "base"}_${addonKey}`;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const { productId, variantId, addons, qty } = action.payload;

      const key = makeKey(productId, variantId, addons);

      state.items[key] = {
        productId,
        variantId,
        addons: addons || [],
        qty: (state.items[key]?.qty || 0) + qty,
      };
    },

    updateQty: (
      state,
      action: PayloadAction<{
        productId: number;
        variantId?: string;
        addons?: string[];
        delta: number;
      }>
    ) => {
      const { productId, variantId, addons, delta } = action.payload;

      // ✅ if variantId or addons provided -> update exact item
      if (variantId || (addons && addons.length > 0)) {
        const key = makeKey(productId, variantId, addons);
        const item = state.items[key];
        if (!item) return;

        item.qty += delta;
        if (item.qty <= 0) delete state.items[key];
        return;
      }

      // ✅ base product (no variant, no addons)
      const baseKey = makeKey(productId, "base", []);
      if (state.items[baseKey]) {
        state.items[baseKey].qty += delta;
        if (state.items[baseKey].qty <= 0) delete state.items[baseKey];
        return;
      }

      // ✅ otherwise reduce last matching variant item (any addons)
      const keys = Object.keys(state.items).filter(
        (k) => state.items[k].productId === productId
      );

      if (keys.length === 0) return;

      const keyToUpdate = keys[keys.length - 1];

      state.items[keyToUpdate].qty += delta;
      if (state.items[keyToUpdate].qty <= 0) delete state.items[keyToUpdate];
    },

    removeItem: (
      state,
      action: PayloadAction<{
        productId: number;
        variantId?: string;
        addons?: string[];
      }>
    ) => {
      const { productId, variantId, addons } = action.payload;
      const key = makeKey(productId, variantId, addons);
      delete state.items[key];
    },

    clearCart: (state) => {
      state.items = {};
    },
  },
});

export const { addItem, updateQty, clearCart, removeItem } = cartSlice.actions;
export default cartSlice.reducer;
