import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, clearCart } from '../redux/slices/cartSlice';
import api from '../api';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart?.items || []);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('processing'); // processing, success, pending, error
  const [previousCartCount, setPreviousCartCount] = useState(0);
  const [isSyncingCart, setIsSyncingCart] = useState(true);
  
  const addStudentUrl = `${process.env.REACT_APP_PARENT_URL}parent/add-student`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(addStudentUrl);
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (token && role === 'Parent') {
      setIsLoggedIn(true);
    }

    // If accessing from external URL and not logged in, save token from URL params if available
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    const urlRole = urlParams.get('role');
    
    if (urlToken && !token) {
      localStorage.setItem('token', urlToken);
      localStorage.setItem('role', urlRole || 'Parent');
      setIsLoggedIn(true);
    }
  }, []);

  // Sync cart after payment success
  useEffect(() => {
    const syncCartAfterPayment = async () => {
      try {
        // Store previous cart count
        const currentCount = cartItems.length;
        setPreviousCartCount(currentCount);
        
        // Wait 2-3 seconds for webhook to process
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        // Retry logic (2-3 attempts)
        let retries = 0;
        const maxRetries = 3;
        let cartUpdated = false;
        let finalCartCount = currentCount;
        
        while (retries < maxRetries && !cartUpdated) {
          // Fetch latest cart from backend
          const result = await dispatch(fetchCart());
          
          if (fetchCart.fulfilled.match(result)) {
            const fetchedCart = result.payload;
            const newCount = fetchedCart.length;
            finalCartCount = newCount;
            
            // Check if cart was updated (reduced or empty)
            if (newCount < currentCount || newCount === 0) {
              cartUpdated = true;
              dispatch(clearCart());
              setPaymentStatus('success');
              setIsSyncingCart(false);
              
              // Optional: Verify payment for mock exams
              const urlParams = new URLSearchParams(window.location.search);
              const sessionId = urlParams.get('session_id');
              
              if (sessionId) {
                try {
                  await api.get(`/parent/mock-exam/verify-payment?session_id=${sessionId}`);
                } catch (error) {
                  console.warn('Payment verification failed:', error);
                  // Cart update is sufficient, verification is optional
                }
              }
              break;
            }
          }
          
          retries++;
          if (retries < maxRetries) {
            // Wait 2 seconds before retry
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
        
        // If cart not updated after retries
        if (!cartUpdated) {
          // Check if cart is already empty (manual visit scenario)
          if (finalCartCount === 0 && currentCount === 0) {
            // Cart was already empty, likely manual visit
            setPaymentStatus('success');
          } else {
            // Cart still has items or webhook pending
            setPaymentStatus('pending');
          }
          setIsSyncingCart(false);
        }
      } catch (error) {
        console.error('Failed to sync cart:', error);
        setPaymentStatus('error');
        setIsSyncingCart(false);
      }
    };
    
    // Only sync if user is logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role === 'Parent') {
      syncCartAfterPayment();
    } else {
      setIsSyncingCart(false);
      setPaymentStatus('success'); // Show success even if not logged in
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const handleAddStudent = () => {
    // Redirect to add student page
    window.location.href = `${process.env.REACT_APP_PARENT_URL}parent/add-student`;
  };

  const handleRetryCartSync = async () => {
    setIsSyncingCart(true);
    setPaymentStatus('processing');
    
    try {
      const result = await dispatch(fetchCart());
      if (fetchCart.fulfilled.match(result)) {
        const fetchedCart = result.payload;
        if (fetchedCart.length === 0 || fetchedCart.length < previousCartCount) {
          dispatch(clearCart());
          setPaymentStatus('success');
        } else {
          setPaymentStatus('pending');
        }
      }
    } catch (error) {
      console.error('Failed to refresh cart:', error);
      setPaymentStatus('error');
    } finally {
      setIsSyncingCart(false);
    }
  };

  // Render different UI based on payment status
  const renderPaymentStatus = () => {
    if (isSyncingCart || paymentStatus === 'processing') {
      return (
        <>
          <Box sx={{ mb: 2 }}>
            <CircularProgress 
              sx={{ 
                color: '#1976d2',
                fontSize: 60
              }} 
            />
          </Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#1976d2',
              mb: 1,
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            Processing Your Payment...
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#666', 
              mb: 2,
              fontSize: { xs: '0.9rem', md: '1rem' }
            }}
          >
            Please wait while we verify your payment and update your cart.
          </Typography>
        </>
      );
    }

    if (paymentStatus === 'pending') {
      return (
        <>
          <Box sx={{ mb: 2 }}>
            <AccessTimeIcon 
              sx={{ 
                fontSize: 60, 
                color: '#ff9800',
                filter: 'drop-shadow(0 4px 8px rgba(255,152,0,0.3))'
              }} 
            />
          </Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#f57c00',
              mb: 1,
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            Payment Received
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#666', 
              mb: 2,
              fontSize: { xs: '0.9rem', md: '1rem' }
            }}
          >
            Your payment has been received. Your cart is being updated. Please refresh in a moment.
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRetryCartSync}
              sx={{
                borderColor: '#ff9800',
                color: '#ff9800',
                fontWeight: 600,
                borderRadius: '20px',
                px: 3,
                py: 1,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#f57c00',
                  backgroundColor: 'rgba(255,152,0,0.04)'
                }
              }}
            >
              Refresh Cart
            </Button>
          </Box>
        </>
      );
    }

    if (paymentStatus === 'error') {
      return (
        <>
          <Box sx={{ mb: 2 }}>
            <ErrorIcon 
              sx={{ 
                fontSize: 60, 
                color: '#f44336',
                filter: 'drop-shadow(0 4px 8px rgba(244,67,54,0.3))'
              }} 
            />
          </Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#d32f2f',
              mb: 1,
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            Unable to Update Cart
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#666', 
              mb: 2,
              fontSize: { xs: '0.9rem', md: '1rem' }
            }}
          >
            There was an error updating your cart. Please refresh the page or contact support if payment was deducted.
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRetryCartSync}
              sx={{
                borderColor: '#f44336',
                color: '#f44336',
                fontWeight: 600,
                borderRadius: '20px',
                px: 3,
                py: 1,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#d32f2f',
                  backgroundColor: 'rgba(244,67,54,0.04)'
                }
              }}
            >
              Try Again
            </Button>
          </Box>
        </>
      );
    }

    // Success status (default)
    return (
      <>
        <Box sx={{ mb: 2 }}>
          <CheckCircleIcon 
            sx={{ 
              fontSize: 60, 
              color: '#4caf50',
              filter: 'drop-shadow(0 4px 8px rgba(76,175,80,0.3))'
            }} 
          />
        </Box>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            color: '#2e7d32',
            mb: 1,
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}
        >
          Payment Successful!
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#666', 
            mb: 2,
            fontSize: { xs: '0.9rem', md: '1rem' }
          }}
        >
          🎉 Congratulations! Your item purchase has been completed successfully.
        </Typography>
      </>
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={10}>
          <Card 
            sx={{ 
              textAlign: 'center', 
              p: 3,
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              background: paymentStatus === 'success' 
                ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                : paymentStatus === 'pending'
                ? 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)'
                : paymentStatus === 'error'
                ? 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)'
                : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
            }}
          >
            <CardContent>
              {/* Dynamic Status Icon and Message */}
              {renderPaymentStatus()}

              {/* Next Steps Section - Only show on success */}
              {paymentStatus === 'success' && (
                <Box sx={{ mb: 3 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#1976d2',
                      mb: 1,
                      fontSize: { xs: '1rem', md: '1.25rem' }
                    }}
                  >
                    Next Step: Enroll Your Student
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#555', 
                      mb: 2,
                      fontSize: { xs: '0.85rem', md: '0.95rem' }
                    }}
                  >
                    Add your student's details and enroll them to start learning journey.
                  </Typography>

                  {/* URL Copy Section */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#666', mb: 1, fontSize: '0.8rem' }}>
                      If button doesn't work, copy this URL:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                      <TextField
                        value={addStudentUrl}
                        size="small"
                        InputProps={{
                          readOnly: true,
                          style: { fontSize: '0.75rem' }
                        }}
                        sx={{ 
                          maxWidth: '300px',
                          '& .MuiOutlinedInput-root': {
                            height: '32px'
                          }
                        }}
                      />
                      <IconButton 
                        onClick={copyToClipboard}
                        size="small"
                        sx={{ 
                          bgcolor: '#1976d2', 
                          color: 'white',
                          '&:hover': { bgcolor: '#1565c0' }
                        }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                {paymentStatus === 'success' && (
                  <>
                    <Button
                      variant="contained"
                      size="medium"
                      startIcon={<PersonAddIcon />}
                      onClick={handleAddStudent}
                      sx={{
                        background: 'linear-gradient(90deg, #4450A5 0%, #EF2A1E 100%)',
                        color: 'white',
                        fontWeight: 600,
                        borderRadius: '20px',
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        boxShadow: '0 4px 15px rgba(68,80,165,0.3)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(68,80,165,0.4)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Add Student Details
                    </Button>

                    <Button
                      variant="outlined"
                      size="medium"
                      component={Link}
                      to="/"
                      sx={{
                        borderColor: '#4450A5',
                        color: '#4450A5',
                        fontWeight: 600,
                        borderRadius: '20px',
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        '&:hover': {
                          borderColor: '#EF2A1E',
                          color: '#EF2A1E',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Back to Home
                    </Button>
                  </>
                )}
                
                {(paymentStatus === 'pending' || paymentStatus === 'error') && (
                  <Button
                    variant="outlined"
                    size="medium"
                    component={Link}
                    to="/basket"
                    sx={{
                      borderColor: '#4450A5',
                      color: '#4450A5',
                      fontWeight: 600,
                      borderRadius: '20px',
                      px: 3,
                      py: 1,
                      textTransform: 'none',
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      '&:hover': {
                        borderColor: '#EF2A1E',
                        color: '#EF2A1E',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    View Cart
                  </Button>
                )}
              </Box>

            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Toast Notification */}
      <Snackbar
        open={showToast}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseToast}
          severity="success"
          sx={{ width: '100%' }}
          variant="filled"
        >
          🔗 Link copied to clipboard!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PaymentSuccess;
