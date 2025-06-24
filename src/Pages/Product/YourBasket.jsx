import React, { useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Divider,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, updateCartItem, deleteCartItem } from "../../redux/slices/cartSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Link } from "react-router-dom";

export default function YourBasket() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = (cart_id, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCartItem({ cart_id, quantity }))
      .then(() => dispatch(fetchCart()));
  };

  const handleDelete = (cart_id) => {
    dispatch(deleteCartItem(cart_id)).then(() => dispatch(fetchCart()));
  };

  const totalAmount = !loading
    ? items?.reduce((sum, item) => sum + item.total, 0)
    : 0;

  return (
    <Grid container spacing={4} sx={{ p: 4 }}>
      <Grid item xs={12} md={8}>
        {loading ? (
          <CircularProgress />
        ) : items && items.length > 0 ? (
          items.map((item) => (
            <Box
              key={item.id}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p={2}
              mb={2}
              bgcolor="#FAFAFF"
              borderRadius={2}
              boxShadow={1}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <img
                  src={item.image || "https://via.placeholder.com/50"}
                  alt={item.name}
                  style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8 }}
                />
                <Typography>{item.name}</Typography>
              </Box>

              <Typography>£{item.price.toFixed(2)}</Typography>

              <Box display="flex" alignItems="center" gap={1}>
                <IconButton onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
                  <RemoveIcon />
                </IconButton>
                <Typography>{item.quantity}</Typography>
                <IconButton onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                  <AddIcon />
                </IconButton>
              </Box>

              <Typography>£{item.total.toFixed(2)}</Typography>

              <IconButton onClick={() => handleDelete(item.id)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          ))
        ) : (
          <Typography>No items in cart.</Typography>
        )}
      </Grid>

      {/* Sidebar */}
      <Grid item xs={12} md={4}>
        <Box
          p={3}
          bgcolor="#FAFAFF"
          borderRadius={2}
          boxShadow={1}
          textAlign="center"
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Basket Totals
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {loading ? (
            <Typography>Loading total...</Typography>
          ) : (
            <Typography variant="body1" gutterBottom>
              Total:
              <strong style={{ marginLeft: 8, color: "red" }}>
                £{totalAmount.toFixed(2)}
              </strong>
            </Typography>
          )}

          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/checkout"
            sx={{
              mt: 2,
              width: "100%",
              borderRadius: "30px",
              textTransform: "none",
              background: "linear-gradient(to right, #3f51b5, #f44336)",
              fontWeight: "bold",
            }}
            disabled={loading || items.length === 0}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
