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
  const [cartSyncing, setCartSyncing] = useState(true);
  const [previousCartCount, setPreviousCartCount] = useState(cartItems.length);
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
    
    if (token && (role === 'Parent' || role === 'Student')) {
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

  // Sync cart after payment
  useEffect(() => {
    const syncCartAfterPayment = async () => {
      try {
        // Store previous cart count from Redux state
        const currentCount = cartItems.length;
        setPreviousCartCount(currentCount);
        
        // Wait 2-3 seconds for webhook to process
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        // Fetch latest cart from backend
        const result = await dispatch(fetchCart());
        
        if (fetchCart.fulfilled.match(result)) {
          const fetchedCart = result.payload;
          const newCount = fetchedCart.length;
          
          // If backend cart is empty, clear Redux state (payment succeeded, backend cleared cart)
          if (newCount === 0) {
            dispatch(clearCart());
            // Cart cleared - payment completed successfully
          } else if (newCount < currentCount) {
            // Backend cart reduced but not empty (partial purchase scenario)
            // Redux state will be updated by fetchCart, no need to clear
            // But we should still show success
          } else {
            // Cart still has items - manual visit or webhook pending
            // Keep Redux state as-is (already updated by fetchCart)
          }
        }
        
        // Optional: Verify payment for mock exams or papers if session_id exists
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');
        const currentPath = window.location.pathname;
        const role = localStorage.getItem('role');
        
        if (sessionId) {
          try {
            // Check if this is a paper payment
            if (currentPath.includes('/paper/payment-success') && role === 'Student') {
              // Verify paper payment for students
              await api.post('/student/paper/verify-payment', { session_id: sessionId });
            } else if (currentPath.includes('/parent/paper/payment-success')) {
              // Parent paper payment - webhook handles it, verification is optional
            } else if (currentPath.includes('/mock-exam/payment-success') || currentPath.includes('/parent/mock-exam/payment-success')) {
              // Mock exam verification
              await api.get(`/parent/mock-exam/verify-payment?session_id=${sessionId}`);
            }
          } catch (error) {
            // Verification failed, but cart update is sufficient
            console.warn('Payment verification failed:', error);
          }
        }
      } catch (error) {
        console.error('Failed to sync cart:', error);
        // Don't clear cart on error
      } finally {
        setCartSyncing(false);
      }
    };

    // Only sync if user is logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && (role === 'Parent' || role === 'Student')) {
      syncCartAfterPayment();
    } else {
      setCartSyncing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const handleAddStudent = () => {
    // Redirect to add student page
    window.location.href = `${process.env.REACT_APP_PARENT_URL}parent/add-student`;
  };

  // Show loading state while syncing cart
  if (cartSyncing) {
    return (
      <Container maxWidth="md" sx={{ py: 4, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="body1" sx={{ color: '#666' }}>
            Processing your payment...
          </Typography>
        </Box>
      </Container>
    );
  }

  const isPaperPayment = window.location.pathname.includes('/paper/payment-success');
  const isParentPaperPayment = window.location.pathname.includes('/parent/paper/payment-success');

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
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            }}
          >
            <CardContent>
              {/* Success Icon */}
              <Box sx={{ mb: 2 }}>
                <CheckCircleIcon 
                  sx={{ 
                    fontSize: 60, 
                    color: '#4caf50',
                    filter: 'drop-shadow(0 4px 8px rgba(76,175,80,0.3))'
                  }} 
                />
              </Box>

              {/* Success Message */}
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

              {/* Next Steps Section - Conditional based on payment type */}
              {(isPaperPayment || isParentPaperPayment) ? (
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
                    Next Step: Take Your Exam
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#555', 
                      mb: 2,
                      fontSize: { xs: '0.85rem', md: '0.95rem' }
                    }}
                  >
                    Your paper has been added to your account. You can now start taking the exam from your "My Papers" page.
                  </Typography>
                </Box>
              ) : (
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

                  {/* URL Copy Section - Only for course payments */}
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
                {(isPaperPayment || isParentPaperPayment) ? (
                  <>
                    <Button
                      variant="contained"
                      size="medium"
                      component={Link}
                      to="/student/my-papers"
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
                      View My Papers
                    </Button>
                    <Button
                      variant="outlined"
                      size="medium"
                      component={Link}
                      to="/papers"
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
                      Browse More Papers
                    </Button>
                  </>
                ) : (
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
