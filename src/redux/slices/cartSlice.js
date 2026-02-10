import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

// ✅ Fetch Cart
export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/cart");
    const rawItems = res.data.data || [];

    return rawItems.map((item, index) => ({
      id: item.cart_id || item.id || index,
      name: item.course_name,
      image: item.course_image,
      quantity: item.quantity,
      price: parseFloat(item.course_price),
      total: parseFloat(item.total_price),
      product_type: item.product_type || null,
      registration_fee_display: item.registration_fee_display || null,
      course_duration: item.course_duration || null,
    }));
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// ✅ Add to Cart (no state mutation here)
export const addToCart = createAsyncThunk("cart/addToCart", async (item, { rejectWithValue }) => {
  try {
    await api.post("/cart/add", item); // don't expect detailed data here
    return {}; // no need to process response
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// ✅ Update Cart Item Quantity
export const updateCartItem = createAsyncThunk(
  "cart/updateItem",
  async ({ cart_id, quantity, price }, { rejectWithValue }) => {
    try {
      await api.put(`/cart/update/${cart_id}`, { quantity });
      return {
        cart_id,
        quantity,
        total_price: parseFloat(price) * quantity,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ✅ Delete Cart Item
export const deleteCartItem = createAsyncThunk("cart/deleteCartItem", async (cartId, { rejectWithValue }) => {
  try {
    await api.delete(`/cart/remove/${cartId}`);
    return cartId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ No addToCart.fulfilled — we use fetchCart afterward

      .addCase(updateCartItem.fulfilled, (state, action) => {
        const { cart_id, quantity, total_price } = action.payload;
        const item = state.items.find((i) => i.id === cart_id);
        if (item) {
          item.quantity = quantity;
          item.total = total_price;
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

// Export actions
export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;
