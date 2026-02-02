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

const ParentRegistrationModal = ({ open, onClose, onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    choose_the_role: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [parentRoleId, setParentRoleId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

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
    if (!formData.email || !formData.password || !formData.first_name || !formData.last_name) {
      setError('All fields are required');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Password validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
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
      const response = await api.post('/register', formData);

      if (response.data.success) {
        // Registration successful - redirect to login modal
        onClose();

        // Reset form
        setFormData({
          email: '',
          password: '',
          first_name: '',
          last_name: '',
          choose_the_role: parentRoleId || 3
        });

        // Switch to login modal after successful registration
        setTimeout(() => {
          onSwitchToLogin && onSwitchToLogin();
        }, 100);
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);

      // Handle different types of errors
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Handle validation errors from backend
        const errorMessages = Object.values(error.response.data.errors).flat();
        setError(errorMessages.join(', '));
      } else {
        setError('Registration failed. Please try again.');
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
        first_name: '',
        last_name: '',
        choose_the_role: parentRoleId || 3
      });
      onClose();
    }
  };

  const handleSwitchToLogin = () => {
    handleClose();
    onSwitchToLogin && onSwitchToLogin();
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
          Parent Registration
        </Typography>
        <IconButton onClick={handleClose} disabled={loading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" sx={{ mb: 3, color: '#6b7280' }}>
            Please register as a parent to place your order
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              name="first_name"
              label="First Name"
              value={formData.first_name}
              onChange={handleInputChange}
              fullWidth
              required
              disabled={loading}
              variant="outlined"
            />
            <TextField
              name="last_name"
              label="Last Name"
              value={formData.last_name}
              onChange={handleInputChange}
              fullWidth
              required
              disabled={loading}
              variant="outlined"
            />
          </Box>

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
            helperText="Minimum 6 characters"
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
              Already have an account?{' '}
              <MuiLink
                component="button"
                type="button"
                onClick={handleSwitchToLogin}
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
                Login here
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
              'Register & Continue'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ParentRegistrationModal;
