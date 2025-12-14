import React, { useEffect, useState, Suspense } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Divider,
  Grid,
  CircularProgress,
} from "@mui/material";
// Note: Using custom toast notification instead of Snackbar to avoid import issues
// ESLint cache refresh comment
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, updateCartItem, deleteCartItem } from "../../redux/slices/cartSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";
import api from "../../api";

// Lazy load the modals to avoid initialization issues
const ParentRegistrationModal = React.lazy(() => import("../../components/ParentRegistrationModal"));
const ParentLoginModal = React.lazy(() => import("../../components/ParentLoginModal"));

// Fixed: Removed Snackbar/Alert imports to resolve ESLint errors
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
    severity: 'success' // success, error, warning, info
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

  // Auto-close snackbar after 4 seconds
  React.useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        handleCloseSnackbar();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.open]);

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
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Handle different types of errors
      let errorMessage = '';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = 'Checkout service not available. Please try again later.';
      } else if (error.response?.status >= 400) {
        errorMessage = `Server error (${error.response.status}). Please try again.`;
      } else {
        errorMessage = 'Failed to process order. Please try again.';
      }
      
      // Show error toast with proper styling
      showToast(errorMessage, 'error');
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
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              py: 8,
              textAlign: 'center'
            }}
          >
            <ShoppingCartIcon 
              sx={{ 
                fontSize: 80, 
                color: '#e0e0e0', 
                mb: 2,
                animation: 'bounce 2s infinite',
                '@keyframes bounce': {
                  '0%, 20%, 50%, 80%, 100%': {
                    transform: 'translateY(0)'
                  },
                  '40%': {
                    transform: 'translateY(-10px)'
                  },
                  '60%': {
                    transform: 'translateY(-5px)'
                  }
                }
              }} 
            />
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#9e9e9e', 
                fontWeight: 500, 
                mb: 1 
              }}
            >
              Your cart is empty
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#bdbdbd', 
                mb: 3 
              }}
            >
              Looks like you haven't added any courses yet
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/"
              sx={{
                bgcolor: '#1976d2',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#1565c0',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Browse 
            </Button>
          </Box>
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
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <ShoppingCartIcon sx={{ fontSize: 40, color: '#e0e0e0', mb: 1 }} />
              <Typography sx={{ fontSize: "14px", color: "#6b7280", fontWeight: 500 }}>
                No items in cart
              </Typography>
            </Box>
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

      {/* Custom Toast Notifications */}
      {snackbar.open && (
        <Box
          sx={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 9999,
            bgcolor: snackbar.severity === 'error' ? '#f44336' : '#4caf50',
            color: 'white',
            p: 3,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            minWidth: 350,
            maxWidth: 500,
            animation: 'slideIn 0.3s ease-out',
            '@keyframes slideIn': {
              from: { transform: 'translateX(100%)', opacity: 0 },
              to: { transform: 'translateX(0)', opacity: 1 }
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                {snackbar.severity === 'error' ? '⚠️ Error' : '✅ Success'}
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                {snackbar.message}
              </Typography>
            </Box>
            <Button
              size="small"
              onClick={handleCloseSnackbar}
              sx={{ 
                color: 'white', 
                p: 0.5, 
                minWidth: 'auto',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              ✕
            </Button>
          </Box>
        </Box>
      )}
    </Grid>
  );
}
