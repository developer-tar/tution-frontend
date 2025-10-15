import React, { useEffect, useState, Suspense } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Divider,
  Grid,
  CircularProgress,
  TextField,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, updateCartItem, deleteCartItem } from "../../redux/slices/cartSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import api from "../../api";
// import { Link } from "react-router-dom";

// Lazy load the modals to avoid initialization issues
const ParentRegistrationModal = React.lazy(() => import("../../Components/ParentRegistrationModal"));
const ParentLoginModal = React.lazy(() => import("../../Components/ParentLoginModal"));

export default function YourBasket() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.cart);
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' // 'success', 'error', 'warning', 'info'
  });

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Helper functions for toast messages
  const showToast = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleQuantityChange = async (cart_id, quantity) => {
    if (quantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(cart_id));
    const item = items.find(i => i.id === cart_id);
    
    try {
      await dispatch(updateCartItem({ cart_id, quantity, price: item?.price || 0 }));
    } catch (error) {
      // If API fails, refresh cart to get correct state
      dispatch(fetchCart());
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cart_id);
        return newSet;
      });
    }
  };

  const handleDelete = (cart_id) => {
    dispatch(deleteCartItem(cart_id))
      .catch(() => {
        // If API fails, refresh cart to get correct state
        dispatch(fetchCart());
      });
  };

  const totalAmount = !loading
    ? items?.reduce((sum, item) => sum + item.total, 0)
    : 0;

  // Check if parent is logged in
  const isParentLoggedIn = () => {

    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    return token && userRole === 'Parent';
  };

  const handlePlaceOrder = async () => {
    
    // Check if parent is logged in
    if (!isParentLoggedIn()) {
      
      setShowLoginModal(true); // Show login modal first
      return;
    }

    // User is logged in, proceed with subscription checkout
    try {
      // Collect all price_ids from cart items
      const priceIds = items.map(item => item.price_id).filter(Boolean);
      console.log('Place Order with price_ids:', priceIds);
      
      // Prepare payload for subscription checkout
      const checkoutPayload = {
        price_ids: priceIds,
        // Add any other required fields here
      };

      setCheckoutLoading(true); // Show loading state
      
      // Hit subscription-checkout API
      const response = await api.post('/parent/checkout');
      
      if (response.data.success) {
        console.log('Checkout successful:', response.data);
        
        // Check if there's a redirect link in response
        if (response?.data?.message?.url) {
          // Redirect to payment gateway
          window.location.href = response.data.message.url;
        } else {
          // If no redirect URL, show success message
          showToast('Order placed successfully!', 'success');
        }
      } else {
        showToast('Failed to process order. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      
      // Handle different types of errors
      if (error.response?.data?.message) {
        showToast(`Error: ${error.response.data.message}`, 'error');
      } else {
        showToast('Failed to process order. Please try again.', 'error');
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    console.log('Login successful:', userData);
    // Close all modals immediately
    setShowLoginModal(false);
    setShowRegistrationModal(false);
    
    // Force navbar to update by triggering a re-render
    window.dispatchEvent(new Event('storage'));
    
    // After successful login, proceed with order
    setTimeout(() => {
      handlePlaceOrder();
    }, 500);
  };

  const handleRegistrationSuccess = (userData) => {
    console.log('Registration successful:', userData);
    // Registration doesn't automatically log in user
    // The registration modal will handle switching to login modal
  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegistrationModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegistrationModal(false);
    setShowLoginModal(true);
  };

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
                <IconButton 
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  disabled={updatingItems.has(item.id)}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography>{item.quantity}</Typography>
                <IconButton 
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  disabled={updatingItems.has(item.id)}
                >
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

      {/* Sidebar - Your Order Section */}
      <Grid item xs={12} md={4}>
        {/* Your Order Section - Moved from Checkout */}
        <Box
          sx={{
            backgroundColor: "#F9F9FF",
            padding: 3,
            borderRadius: "5px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
            mb: 3,
          }}
        >
          {/* Order Summary */}
          <Typography sx={{ fontWeight: 600, mb: 2, color: "#1f2937", fontSize: "16px" }}>
            Your Order
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
              fontSize: "14px",
              color: "#6b7280",
            }}
          >
            <Typography>Product</Typography>
            <Typography>Subtotal</Typography>
          </Box>

          {/* Dynamic Product List from Cart */}
          {loading ? (
            <Typography>Loading...</Typography>
          ) : items && items.length > 0 ? (
            items.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                  fontSize: "14px",
                  color: "#1f2937",
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 500 }}>{item.name} × {item.quantity}</Typography>
                  <Typography sx={{ fontSize: "12px", color: "#6b7280" }}>
                   
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 600 }}>£{item.total.toFixed(2)}</Typography>
              </Box>
            ))
          ) : (
            <Typography sx={{ fontSize: "14px", color: "#6b7280" }}>No items in cart</Typography>
          )}

          <Box sx={{ borderTop: "1px solid #e0e0e0", pt: 2, mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
                fontSize: "14px",
                color: "#1f2937",
              }}
            >
              <Typography>Total</Typography>
              <Typography sx={{ fontWeight: 600, color: "#d32f2f" }}>
                £{totalAmount.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          {/* Coupon Section */}
        

          {/* Place Order Button */}
          <Button
            variant="contained"
            onClick={handlePlaceOrder}
            sx={{
              mt: 2,
              width: "100%",
              borderRadius: "30px",
              textTransform: "none",
              background: "linear-gradient(90deg, #4450A5 0%, #EF2A1E 100%)",
              fontWeight: "bold",
              padding: "12px 0",
            }}
            disabled={loading || items.length === 0 || checkoutLoading}
          >
            {checkoutLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Place Order'
            )}
          </Button>
        </Box>

        {/* Basket Totals Section - Commented Out */}
        {/* <Box
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
        </Box> */}
      </Grid>

      {/* Parent Login Modal */}
      {showLoginModal && (
        <Suspense fallback={<CircularProgress />}>
          <ParentLoginModal
            open={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onSuccess={handleLoginSuccess}
            onSwitchToRegister={handleSwitchToRegister}
          />
        </Suspense>
      )}

      {/* Parent Registration Modal */}
      {showRegistrationModal && (
        <Suspense fallback={<CircularProgress />}>
          <ParentRegistrationModal
            open={showRegistrationModal}
            onClose={() => setShowRegistrationModal(false)}
            onSuccess={handleRegistrationSuccess}
            onSwitchToLogin={handleSwitchToLogin}
          />
        </Suspense>
      )}

      {/* Toast Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
