import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3001/carts";

// Fetch the logged-in user's cart
export const fetchUserCart = createAsyncThunk(
  "cart/fetchUserCart",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL, {
        params: { userId },
      });

      return {
        userId,
        cart: response.data[0] || null,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to load cart"
      );
    }
  }
);

// Save or update the logged-in user's cart
export const syncUserCart = createAsyncThunk(
  "cart/syncUserCart",
  async ({ userId, items }, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL, {
        params: { userId },
      });

      const existingCart = response.data[0];

      const cartData = {
        userId,
        items,
      };

      if (existingCart) {
        const updated = await axios.patch(
          `${API_URL}/${existingCart.id}`,
          cartData
        );

        return updated.data;
      }

      const created = await axios.post(API_URL, cartData);

      return created.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to save cart"
      );
    }
  }
);

const CartSlice = createSlice({
  name: "cart",

  initialState: {
    items: [],
    loading: false,
    error: null,
    currentUserId: null,
  },

  reducers: {
    addTocart: (state, action) => {
      const existingProduct = state.items.find(
        (product) =>
          String(product.id) === String(action.payload.id)
      );

      if (existingProduct) {
        existingProduct.quantity =
          (Number(existingProduct.quantity) || 1) + 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
        });
      }
    },

    removeCart: (state, action) => {
      state.items.splice(action.payload, 1);
    },

    increaseQuantity: (state, action) => {
      const product = state.items[action.payload];

      if (product && Number(product.quantity)<Number(product.stock)) {
        product.quantity =
          (Number(product.quantity) || 1) + 1;
      }
    },

    decreaseQuantity: (state, action) => {
      const product = state.items[action.payload];

      if (product && product.quantity > 1) {
        product.quantity -= 1;
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.currentUserId = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUserCart.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUserId = action.payload.userId;
        state.items = action.payload.cart?.items || [];
      })

      .addCase(fetchUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to load cart";
      })

      // Save cart and update Redux immediately after success
      .addCase(syncUserCart.pending, (state) => {
        state.error = null;
      })

      .addCase(syncUserCart.fulfilled, (state, action) => {
        state.currentUserId = action.payload.userId;
        state.items = action.payload.items || [];
        state.error = null;
      })

      .addCase(syncUserCart.rejected, (state, action) => {
        state.error =
          action.payload || "Failed to save cart";
      });
  },
});

export const {
  addTocart,
  removeCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = CartSlice.actions;

export default CartSlice.reducer;