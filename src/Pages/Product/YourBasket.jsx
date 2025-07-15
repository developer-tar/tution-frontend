// src/Pages/Product/Basket.jsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Divider,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  updateCartItem,
  deleteCartItem,
} from "../../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

const Basket = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector((state) => state.cart.items || []);
  const loading = useSelector((state) => state.cart.loading);

  const [alert, setAlert] = useState({ open: false, message: "" });

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;

    dispatch(updateCartItem({ cart_id: id, quantity }))
      .unwrap()
      .then(() => {
        setAlert({ open: true, message: "Quantity updated!" });
        dispatch(fetchCart());
      })
      .catch((err) => {
        setAlert({
          open: true,
          message: err?.message || "Failed to update quantity",
        });
      });
  };

  const handleDelete = (id) => {
    dispatch(deleteCartItem(id))
      .unwrap()
      .then(() => {
        setAlert({ open: true, message: "Item removed from cart!" });
        dispatch(fetchCart());
      })
      .catch((err) => {
        setAlert({
          open: true,
          message: err?.message || "Failed to remove item",
        });
      });
  };

  const total = items.reduce((acc, item) => acc + parseFloat(item.total || 0), 0);

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Your Basket
      </Typography>

      {!loading && items.length === 0 ? (
        <Typography>No items in your cart.</Typography>
      ) : (
        <>
          {items.map((item) => (
            <Box
              key={item.id}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f9f9ff"
              p={2}
              mb={2}
              borderRadius={2}
            >
              {/* Image & Name */}
              <Box display="flex" alignItems="center" gap={2}>
                <img
                  src={item.image || "https://via.placeholder.com/50"}
                  alt={item.name}
                  style={{
                    width: 50,
                    height: 50,
                    objectFit: "cover",
                    borderRadius: 6,
                  }}
                />
                <Box>
                  <Typography fontWeight={600}>{item.name}</Typography>
                  <Typography color="text.secondary">£{item.price}</Typography>
                </Box>
              </Box>

              {/* Quantity Controls */}
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
                  <RemoveIcon />
                </IconButton>
                <Typography>{item.quantity}</Typography>
                <IconButton onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                  <AddIcon />
                </IconButton>
              </Box>

              {/* Total Price */}
              <Typography fontWeight={600}>£{item.total}</Typography>

              {/* Delete Button */}
              <IconButton onClick={() => handleDelete(item.id)}>
                <DeleteIcon color="error" />
              </IconButton>
            </Box>
          ))}

          <Divider sx={{ my: 3 }} />

          {/* Total */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6" color="error">
              £{total.toFixed(2)}
            </Typography>
          </Box>

          <Button
            fullWidth
            sx={{
              mt: 3,
              py: 1.5,
              background: "linear-gradient(to right, #3f51b5, #f44336)",
              color: "#fff",
              fontWeight: 600,
              borderRadius: 3,
              textTransform: "none",
            }}
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </Button>
        </>
      )}

      {/* Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        message={alert.message}
      />
    </Box>
  );
};

export default Basket;
