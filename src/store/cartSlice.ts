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
            const key = `${action.payload.productId}_${action.payload.variantId || "base"}`;
            const item = state.items[key];
            if (!item) return;

            item.qty += action.payload.delta;
            if (item.qty <= 0) delete state.items[key];
        },
      removeItem: (state, action: PayloadAction<{ productId: number; variantId?: string }>) => {
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
