// redux/slices/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

// ✅ Fetch Cart
export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/cart");
    const rawItems = res.data.data || [];

    return rawItems.map((item) => ({
      id: item.cart_id,              // ✅ Actual cart ID for update/delete
      name: item.course_name,
      image: item.course_image,
      quantity: item.quantity,
      price: parseFloat(item.course_price),
      total: parseFloat(item.total_price),
    }));
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});


// ✅ Add to Cart
export const addToCart = createAsyncThunk("cart/addToCart", async (item, { rejectWithValue }) => {
  try {
    const res = await api.post("/cart/add", item);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 👉 Update cart item by cart_id
export const updateCartItem = createAsyncThunk("cart/updateItem", async ({ cart_id, quantity }, { rejectWithValue }) => {
  try {
    await api.put(`/cart/update/${cart_id}`, { quantity }); // ✅ POST method
    return { cart_id, quantity };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// ✅ Delete Cart
export const deleteCartItem = createAsyncThunk("cart/deleteCartItem", async (cartId, { rejectWithValue }) => {
  try {
    await api.delete(`/cart/remove/${cartId}`);
    return cartId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// ✅ Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
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

      // Add
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items.push({
          id: Date.now(), // Temporary; ideally from backend
          ...action.payload,
        });
      })

     // Update
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const { cart_id, quantity } = action.payload;
        const item = state.items.find((i) => i.cart_id === cart_id);
        if (item) {
          item.quantity = quantity;
          item.total_price = parseFloat(item.course_price) * quantity;
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export default cartSlice.reducer;
