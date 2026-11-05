import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3001/whishlist";

// Fetch the logged-in user's wishlist
export const fetchUserWishlist = createAsyncThunk(
  "whishlist/fetchUserWishlist",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL, {
        params: { userId: String(userId) },
      });

      return {
        userId: String(userId),
        wishlist: response.data[0] || null,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to load wishlist"
      );
    }
  }
);

// Save or update the user's wishlist
export const syncUserWishlist = createAsyncThunk(
  "whishlist/syncUserWishlist",
  async ({ userId, items, product }, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL, {
        params: { userId: String(userId) },
      });

      const existingWishlist = response.data[0];

      // Support either a complete items array or a single product
      let updatedItems = Array.isArray(items)
        ? items
        : existingWishlist?.items || [];

      if (product) {
        updatedItems = [...updatedItems, product];
      }

      const wishlistData = {
        userId: String(userId),
        items: updatedItems,
      };

      if (existingWishlist) {
        const updated = await axios.put(
          `${API_URL}/${existingWishlist.id}`,
          wishlistData
        );

        return updated.data;
      }

      const created = await axios.post(API_URL, wishlistData);

      return created.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to save wishlist"
      );
    }
  }
);

const WhishlistSlice = createSlice({
  name: "whishlist",

  initialState: {
    items: [],
    loading: false,
    error: null,
    currentUserId: null,
  },

  reducers: {
    addToWhishlist: (state, action) => {
      // Prevent the same product from appearing multiple times
      const exists = state.items.some(
        (product) => String(product.id) === String(action.payload.id)
      );

      if (!exists) {
        state.items.push(action.payload);
      }
    },

    removeWhishlist: (state, action) => {
      // Remove a product by its ID
      const productId =
        typeof action.payload === "object"
          ? action.payload.id
          : action.payload;

      state.items = state.items.filter(
        (product) => String(product.id) !== String(productId)
      );
    },

    clearWishlist: (state) => {
      state.items = [];
      state.currentUserId = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUserWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUserId = action.payload.userId;
        state.items = action.payload.wishlist?.items || [];
      })

      .addCase(fetchUserWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load wishlist";
      })

      .addCase(syncUserWishlist.fulfilled, (state, action) => {
        state.currentUserId = String(action.payload.userId);
        state.items = action.payload.items || state.items;
        state.error = null;
      })

      .addCase(syncUserWishlist.rejected, (state, action) => {
        state.error = action.payload || "Failed to save wishlist";
      });
  },
});

export const {
  addToWhishlist,
  removeWhishlist,
  clearWishlist,
} = WhishlistSlice.actions;

export default WhishlistSlice.reducer;