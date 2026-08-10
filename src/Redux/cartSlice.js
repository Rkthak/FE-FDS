import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: null,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;
    },

    clearCartState: (state) => {
      state.cart = null;
    },

    setCartLoading: (state, action) => {
      state.loading = action.payload;
    },

    setCartError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setCart, clearCartState, setCartLoading, setCartError } =
  cartSlice.actions;

export default cartSlice.reducer;
