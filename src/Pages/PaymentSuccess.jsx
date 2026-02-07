import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
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
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'failed', 'pending', null
  const [paymentError, setPaymentError] = useState(null);
  const addStudentUrl = `${process.env.REACT_APP_PARENT_URL}parent/add-student`;

  // Assign paper to student (parent paper payment success)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [parentStudents, setParentStudents] = useState([]);
  const [paperPurchases, setPaperPurchases] = useState([]);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignDialogFetchLoading, setAssignDialogFetchLoading] = useState(false);
  const [assignError, setAssignError] = useState('');
  const [assignSuccess, setAssignSuccess] = useState(false);

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

  // Verify payment and sync cart after payment
  useEffect(() => {
    const verifyAndSyncPayment = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('token');

        // Verify payment status if session_id exists
        if (sessionId && token && role === 'Parent') {
          try {
            const verifyResponse = await api.post('/parent/verify-payment', { session_id: sessionId });

            if (verifyResponse.data.success) {
              const isPaid = verifyResponse.data.data?.paid === true;

              if (isPaid) {
                setPaymentStatus('success');
                // Fulfill basket order (create paper_purchases, mock_exam_purchases, clear cart)
                // so records exist even when Stripe webhook did not fire (e.g. localhost)
                try {
                  await api.post('/parent/checkout/fulfill', { session_id: sessionId });
                } catch (fulfillError) {
                  console.warn('Fulfill order (non-blocking):', fulfillError?.response?.data || fulfillError.message);
                }
              } else {
                setPaymentStatus('failed');
                setPaymentError(verifyResponse.data.data?.payment_status || 'Payment not completed');
              }
            } else {
              setPaymentStatus('failed');
              setPaymentError(verifyResponse.data.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setPaymentStatus('failed');
            setPaymentError(error.response?.data?.message || 'Failed to verify payment status');
          }
        } else if (sessionId) {
          // For other roles or paths, use existing verification logic
          const currentPath = window.location.pathname;

          try {
            if (currentPath.includes('/paper/payment-success') && role?.toLowerCase() === 'student') {
              await api.post('/student/paper/verify-payment', { session_id: sessionId });
              setPaymentStatus('success');
            } else if (currentPath.includes('/parent/paper/payment-success')) {
              // Parent paper payment - webhook handles it
              setPaymentStatus('success');
            } else if (currentPath.includes('/mock-exam/payment-success') || currentPath.includes('/parent/mock-exam/payment-success')) {
              await api.get(`/parent/mock-exam/verify-payment?session_id=${sessionId}`);
              setPaymentStatus('success');
            } else {
              // Default to success if no specific verification
              setPaymentStatus('success');
            }
          } catch (error) {
            console.warn('Payment verification failed:', error);
            setPaymentStatus('failed');
            setPaymentError('Payment verification failed');
          }
        } else {
          // No session_id, assume success (legacy flow)
          setPaymentStatus('success');
        }

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
          } else if (newCount < currentCount) {
            // Backend cart reduced but not empty (partial purchase scenario)
            // Redux state will be updated by fetchCart
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
      verifyAndSyncPayment();
    } else {
      setCartSyncing(false);
      setPaymentStatus('success'); // Default for non-logged in users
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const handleAddStudent = () => {
    // Redirect to add student page
    window.location.href = `${process.env.REACT_APP_PARENT_URL}parent/add-student`;
  };

  const handleOpenAssignDialog = async () => {
    setAssignDialogOpen(true);
    setAssignError('');
    setAssignSuccess(false);
    setSelectedPurchaseId('');
    setSelectedStudentId('');
    setAssignDialogFetchLoading(true);
    try {
      const [studentsRes, purchasesRes] = await Promise.all([
        api.get('/parent/students/names'),
        api.get('/parent/paper-purchases'),
      ]);
      const students = studentsRes.data?.success ? (studentsRes.data.data || []) : [];
      const purchases = purchasesRes.data?.success ? (purchasesRes.data.data || []) : [];
      setParentStudents(students);
      setPaperPurchases(purchases);
      if (purchases.length > 0) {
        setSelectedPurchaseId(String(purchases[0].purchase_id));
      }
    } catch (err) {
      console.error('Failed to load students or purchases:', err);
      setAssignError(err.response?.data?.message || 'Failed to load students or purchases.');
      setParentStudents([]);
      setPaperPurchases([]);
    } finally {
      setAssignDialogFetchLoading(false);
    }
  };

  const handleCloseAssignDialog = () => {
    setAssignDialogOpen(false);
    setAssignError('');
    setAssignSuccess(false);
  };

  const handleAssignStudent = async () => {
    if (!selectedPurchaseId || !selectedStudentId) {
      setAssignError('Please select a paper and a student.');
      return;
    }
    setAssignLoading(true);
    setAssignError('');
    try {
      const res = await api.put(`/parent/paper-purchases/${selectedPurchaseId}/assign-student`, {
        student_id: parseInt(selectedStudentId, 10),
      });
      if (res.data?.success) {
        setAssignSuccess(true);
        setParentStudents((prev) => prev.map((s) => (String(s.id) === selectedStudentId ? { ...s, assigned: true } : s)));
        setTimeout(() => handleCloseAssignDialog(), 1500);
      } else {
        setAssignError(res.data?.message || 'Assign failed.');
      }
    } catch (err) {
      setAssignError(err.response?.data?.message || 'Failed to assign student.');
    } finally {
      setAssignLoading(false);
    }
  };

  // Show loading state while verifying payment and syncing cart
  if (cartSyncing || paymentStatus === null) {
    return (
      <Container maxWidth="md" sx={{ py: 4, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="body1" sx={{ color: '#666' }}>
            Verifying your payment...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Show payment failure state
  if (paymentStatus === 'failed') {
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
                background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)'
              }}
            >
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <CancelIcon
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
                  Payment Failed
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: '#666',
                    mb: 2,
                    fontSize: { xs: '0.9rem', md: '1rem' }
                  }}
                >
                  {paymentError || 'Your payment could not be processed. Please try again.'}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap', mt: 3 }}>
                  <Button
                    variant="contained"
                    size="medium"
                    component={Link}
                    to="/basket"
                    sx={{
                      background: 'linear-gradient(90deg, #4450A5 0%, #EF2A1E 100%)',
                      color: 'white',
                      fontWeight: 600,
                      borderRadius: '20px',
                      px: 3,
                      py: 1,
                      textTransform: 'none',
                    }}
                  >
                    Try Again
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
                    }}
                  >
                    Back to Home
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  }

  const isPaperPayment = window.location.pathname.includes('/paper/payment-success');
  const isParentPaperPayment = window.location.pathname.includes('/parent/paper/payment-success');
  const isParent = (localStorage.getItem('role') || '').toLowerCase() === 'parent';

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
                    {isParent && (
                      <Button
                        variant="contained"
                        size="medium"
                        startIcon={<PersonAddIcon />}
                        onClick={handleOpenAssignDialog}
                        sx={{
                          background: 'linear-gradient(90deg, #1976d2 0%, #1565c0 100%)',
                          color: 'white',
                          fontWeight: 600,
                          borderRadius: '20px',
                          px: 3,
                          py: 1,
                          textTransform: 'none',
                          fontSize: { xs: '0.9rem', md: '1rem' },
                          boxShadow: '0 4px 15px rgba(25,118,210,0.3)',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(25,118,210,0.4)',
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Add student details
                      </Button>
                    )}
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

      {/* Assign paper to student dialog (parent paper payment) */}
      <Dialog open={assignDialogOpen} onClose={handleCloseAssignDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Assign paper to student</DialogTitle>
        <DialogContent>
          {assignDialogFetchLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              {assignError && (
                <Alert severity="error" onClose={() => setAssignError('')}>
                  {assignError}
                </Alert>
              )}
              {assignSuccess && (
                <Alert severity="success">Student assigned successfully.</Alert>
              )}
              {parentStudents.length === 0 && !assignDialogFetchLoading ? (
                <Typography color="text.secondary">
                  You have no students linked to your account. Add a student first, then you can assign papers to them.
                </Typography>
              ) : paperPurchases.length === 0 ? (
                <Typography color="text.secondary">
                  No paper purchases found yet. Your purchase may still be processing—try again in a moment.
                </Typography>
              ) : (
                <>
                  <FormControl fullWidth size="small">
                    <InputLabel id="assign-purchase-label">Purchased paper</InputLabel>
                    <Select
                      labelId="assign-purchase-label"
                      value={selectedPurchaseId}
                      label="Purchased paper"
                      onChange={(e) => setSelectedPurchaseId(e.target.value)}
                    >
                      {paperPurchases.map((p) => (
                        <MenuItem key={p.purchase_id} value={String(p.purchase_id)}>
                          {p.paper_name || `Purchase #${p.purchase_id}`}
                          {p.student_name ? ` (${p.student_name})` : ''}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size="small">
                    <InputLabel id="assign-student-label">Student to assign</InputLabel>
                    <Select
                      labelId="assign-student-label"
                      value={selectedStudentId}
                      label="Student to assign"
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                    >
                      {parentStudents.map((s) => (
                        <MenuItem key={s.id} value={String(s.id)}>
                          {s.full_name}
                          {s.email ? ` (${s.email})` : ''}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseAssignDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAssignStudent}
            disabled={assignLoading || parentStudents.length === 0 || paperPurchases.length === 0 || !selectedPurchaseId || !selectedStudentId}
          >
            {assignLoading ? 'Assigning...' : 'Assign'}
          </Button>
        </DialogActions>
      </Dialog>

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
