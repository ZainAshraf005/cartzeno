import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Helper function to get persisted cart
const persistCart = () => {
  if (typeof window === "undefined") return [];
  try {
    return window.localStorage.getItem("cart")
      ? JSON.parse(window.localStorage.getItem("cart")!)
      : [];
  } catch {
    return []; // Return empty array if parsing fails
  }
};

interface ProductType {
  id: string | undefined;
  title: string | undefined;
  image: string | undefined;
  price: number | undefined;
  stock: number | undefined;
}

interface CartItem extends ProductType {
  quantity: number;
}

interface Cart {
  items: CartItem[];
}

// Define the initial state
const initialState: Cart = {
  items: persistCart(),
};

// Create the cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ProductType>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
    },
  },
});

// Export the actions and reducer
export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
