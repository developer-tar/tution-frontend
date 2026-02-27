import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Link as MuiLink,
  InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import api from '../api';
import { useDispatch } from 'react-redux';
import { addToCart, fetchCart } from '../redux/slices/cartSlice';

const ParentLoginModal = ({ open, onClose, onSuccess, onSwitchToRegister }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    choose_the_role: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [parentRoleId, setParentRoleId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Sync guest cart to server
  const syncGuestCartToServer = async () => {
    try {
      const guestCart = localStorage.getItem('guestCart');
      if (!guestCart) return;

      const guestCartItems = JSON.parse(guestCart);
      if (guestCartItems.length === 0) return;

      // Add each item from guest cart to server cart
      for (const item of guestCartItems) {
        try {
          await dispatch(addToCart({
            product_type: item.product_type,
            product_id: item.product_id,
            quantity: item.quantity,
            price_id: item.price_id,
          })).unwrap();
        } catch (error) {
          console.error('Error adding item to cart:', error);
        }
      }

      // Clear guest cart after successful sync
      localStorage.removeItem('guestCart');

      // Fetch updated cart
      await dispatch(fetchCart());

      // Trigger event to update navbar and other components
      window.dispatchEvent(new Event('guestCartUpdated'));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error syncing guest cart:', error);
    }
  };

  // Fetch parent role ID from roles API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get('/common/data?param=Roles');
        const roles = response.data?.data || [];
        const parentRole = roles.find(role => role.name === 'Parent');
        if (parentRole) {
          setParentRoleId(parentRole.id);
          setFormData(prev => ({ ...prev, choose_the_role: parentRole.id }));
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        // Fallback to role ID 3 as mentioned in requirements
        setParentRoleId(3);
        setFormData(prev => ({ ...prev, choose_the_role: 3 }));
      }
    };

    if (open) {
      fetchRoles();
    }
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/login', formData);

      if (response.data.success) {
        // Store token in localStorage using new response format
        if (response.data.data?.access_token) {
          localStorage.setItem('token', response.data.data.access_token);
          localStorage.setItem('role', response.data.data.role);
          // localStorage.setItem('userName', response.data.data.full_name || formData.email.split('@')[0]);
          localStorage.setItem('userData', JSON.stringify(response.data.data));
        }

        // Sync guest cart to server after login
        await syncGuestCartToServer();

        onSuccess && onSuccess(response.data);
        onClose();

        // Reset form
        setFormData({
          email: '',
          password: '',
          choose_the_role: parentRoleId || 3
        });
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);

      // Handle different types of errors
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Handle validation errors from backend
        const errorMessages = Object.values(error.response.data.errors).flat();
        setError(errorMessages.join(', '));
      } else if (error.response?.status === 401) {
        setError('Invalid email or password');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError('');
      setFormData({
        email: '',
        password: '',
        choose_the_role: parentRoleId || 3
      });
      onClose();
    }
  };

  const handleSwitchToRegister = () => {
    handleClose();
    onSwitchToRegister && onSwitchToRegister();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          padding: 2
        }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: 1
      }}>
        <Typography component="div" variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
          Parent Login
        </Typography>
        <IconButton onClick={handleClose} disabled={loading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" sx={{ mb: 3, color: '#6b7280' }}>
            Please login to your parent account to place your order
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            required
            disabled={loading}
            sx={{ mb: 2 }}
            variant="outlined"
          />

          <TextField
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            fullWidth
            required
            disabled={loading}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              Don't have an account?{' '}
              <MuiLink
                component="button"
                type="button"
                onClick={handleSwitchToRegister}
                sx={{
                  color: '#7b1fa2',
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
                disabled={loading}
              >
                Register here
              </MuiLink>
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              background: 'linear-gradient(90deg, #4450A5 0%, #EF2A1E 100%)',
              textTransform: 'none',
              borderRadius: '8px',
              px: 3,
              minWidth: 120
            }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Login & Continue'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ParentLoginModal;
