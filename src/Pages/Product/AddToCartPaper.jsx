import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Typography, Chip, IconButton, Container, Snackbar, Alert, CircularProgress } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DescriptionIcon from "@mui/icons-material/Description";
import PageHeader from "../PageHeader";
import { button, containerStyles, icon, spainColor } from '../style';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import api from '../../api';

const AddToCartPaper = () => {
    const dispatch = useDispatch();
    const { slug } = useParams();
    const navigate = useNavigate();
    const [paperData, setPaperData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [purchasing, setPurchasing] = useState(false);
    const [isStudent, setIsStudent] = useState(false);
    const [isParent, setIsParent] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Papers", path: "/papers" },
        { label: paperData?.name || "Loading...", path: "#" },
    ];

    // Check user role (stored lowercase in localStorage)
    useEffect(() => {
        const role = localStorage.getItem('role') || '';
        setIsStudent(role === 'Student');
        setIsParent(role === 'Parent');
    }, []);

    // Fetch paper details
    useEffect(() => {
        const fetchPaperDetails = async () => {
            if (!slug) {
                setSnackbar({
                    open: true,
                    message: 'No paper selected',
                    severity: 'error'
                });
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await api.get(`/paper/${slug}/details`);

                if (response.data.success) {
                    setPaperData(response.data.data);
                } else {
                    throw new Error('Failed to fetch paper details');
                }
            } catch (error) {
                console.error('Error fetching paper details:', error);
                setSnackbar({
                    open: true,
                    message: error.response?.data?.message || 'Failed to load paper details',
                    severity: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPaperDetails();
    }, [slug]);

    const handleAddToCart = async () => {
        if (!paperData) {
            setSnackbar({
                open: true,
                message: 'No paper data found',
                severity: 'error'
            });
            return;
        }

        setAddingToCart(true);

        try {
            const payload = {
                product_type: paperData.product_type || "paper", // Use product_type from API response
                product_id: paperData.id,
                quantity: 1,
                price_id: paperData.stripe_price_id
            };

            const result = await dispatch(addToCart(payload));

            if (addToCart.fulfilled.match(result)) {
                setSnackbar({
                    open: true,
                    message: 'Paper added to cart successfully!',
                    severity: 'success'
                });

                // Redirect to basket after success
                setTimeout(() => {
                    navigate('/basket');
                }, 1500);
            } else {
                throw new Error(result.payload || 'Failed to add to cart');
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Failed to add to cart',
                severity: 'error'
            });
        } finally {
            setAddingToCart(false);
        }
    };

    const handlePurchaseNow = async () => {
        if (!paperData) {
            setSnackbar({
                open: true,
                message: 'No paper data found',
                severity: 'error'
            });
            return;
        }

        if (!isStudent) {
            setSnackbar({
                open: true,
                message: 'Please log in as a student to purchase directly',
                severity: 'warning'
            });
            return;
        }

        setPurchasing(true);

        try {
            // Validate stripe_price_id exists
            if (!paperData.stripe_price_id) {
                setSnackbar({
                    open: true,
                    message: 'This paper is not available for purchase. Missing price information.',
                    severity: 'error'
                });
                setPurchasing(false);
                return;
            }

            const response = await api.post('/student/paper/purchase', {
                paper_id: paperData.id,
                product_type: paperData.product_type || "paper",
                stripe_price_id: paperData.stripe_price_id // Include stripe_price_id for checkout
            });

            if (response.data.success && response.data.data?.checkout_url) {
                // Redirect to Stripe checkout
                window.location.href = response.data.data.checkout_url;
            } else {
                throw new Error(response.data.message || 'Failed to initiate purchase');
            }
        } catch (error) {
            console.error('Purchase error:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Failed to initiate purchase',
                severity: 'error'
            });
            setPurchasing(false);
        }
    };

    const handleParentCheckout = async () => {
        if (!paperData) {
            setSnackbar({
                open: true,
                message: 'No paper data found',
                severity: 'error'
            });
            return;
        }

        if (!isParent) {
            setSnackbar({
                open: true,
                message: 'Please log in as a parent to checkout',
                severity: 'warning'
            });
            return;
        }

        setPurchasing(true);

        try {
            // Validate stripe_price_id exists
            if (!paperData.stripe_price_id) {
                setSnackbar({
                    open: true,
                    message: 'This paper is not available for purchase. Missing price information.',
                    severity: 'error'
                });
                setPurchasing(false);
                return;
            }

            const response = await api.post('/parent/paper/checkout', {
                paper_id: paperData.id,
                product_type: paperData.product_type || "paper",
                stripe_price_id: paperData.stripe_price_id, // Include stripe_price_id for checkout
                // student_id is optional - can be added later if needed
            });

            if (response.data.success && response.data.checkout_url) {
                // Redirect to Stripe checkout
                window.location.href = response.data.checkout_url;
            } else {
                throw new Error(response.data.message || 'Failed to initiate checkout');
            }
        } catch (error) {
            console.error('Parent checkout error:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Failed to initiate checkout',
                severity: 'error'
            });
            setPurchasing(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading) {
        return (
            <>
                <PageHeader
                    title="Loading..."
                    breadcrumbs={breadcrumbs}
                />
                <Box sx={{ py: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <CircularProgress />
                </Box>
            </>
        );
    }

    if (!paperData) {
        return (
            <>
                <PageHeader
                    title="Paper Not Found"
                    breadcrumbs={breadcrumbs}
                />
                <Box sx={{ py: 8, textAlign: 'center' }}>
                    <Typography variant="h6" color="error">
                        Paper details could not be loaded
                    </Typography>
                    <Button
                        component={Link}
                        to="/papers"
                        variant="contained"
                        sx={{ mt: 2 }}
                    >
                        Back to Papers
                    </Button>
                </Box>
            </>
        );
    }

    return (
        <>
            <PageHeader
                title={paperData.name}
                breadcrumbs={breadcrumbs}
            />
            <Box sx={{ py: 8, px: { xs: 2, md: 6 } }}>
                <Container sx={containerStyles}>

                    {/* Cart Header */}
                    <Box
                        sx={{
                            backgroundColor: "#fff",
                            padding: "16px",
                            borderRadius: "12px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 4,
                            borderTop: "3px solid blue"
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <IconButton
                                component={Link}
                                to="/papers"
                                sx={{ color: "#7b1fa2" }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography sx={{ fontSize: "14px", fontWeight: 500, color: "#1f2937" }}>
                                {paperData.name}
                            </Typography>
                        </Box>
                        <Link to="/basket" style={{ textDecoration: "none" }}>
                            <Button
                                variant="contained"
                                sx={{
                                    background: "linear-gradient(90deg, #4450A5 0%, #EF2A1E 100%)",
                                    color: "#fff",
                                    fontWeight: 600,
                                    padding: "8px 16px",
                                    borderRadius: "10px",
                                    textTransform: "none",
                                }}
                            >
                                View Cart
                            </Button>
                        </Link>
                    </Box>

                    {/* Product Content */}
                    <Grid container spacing={4} alignItems="center">
                        {/* Left Image Section */}
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    backgroundColor: "#fff",
                                    padding: 3,
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Box
                                    component="img"
                                    src={paperData.image || "/assets/images/product-img.png"}
                                    alt={paperData.name}
                                    sx={{
                                        width: "100%",
                                        maxWidth: "400px",
                                        height: "auto",
                                        borderRadius: "8px",
                                    }}
                                />
                            </Box>
                        </Grid>

                        {/* Right Content Section */}
                        <Grid item xs={12} md={6}>
                            <Box>
                                {/* Title */}
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 700,
                                        color: "#1f2937",
                                        mb: 2,
                                        fontSize: { xs: "24px", md: "32px" },
                                    }}
                                >
                                    {paperData.name}
                                </Typography>

                                {/* Category & Format Badges */}
                                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                    {paperData.category && (
                                        <Chip
                                            label={paperData.category}
                                            sx={{
                                                backgroundColor: "#e0e7ff",
                                                color: "#4f46e5",
                                                fontWeight: 600,
                                                fontSize: "14px",
                                            }}
                                        />
                                    )}
                                    {paperData.format && (
                                        <Chip
                                            label={paperData.format}
                                            sx={{
                                                backgroundColor: "#fef3c7",
                                                color: "#d97706",
                                                fontWeight: 600,
                                                fontSize: "14px",
                                            }}
                                        />
                                    )}
                                </Box>

                                {/* Description */}
                                <Typography sx={{ color: "#6b7280", mb: 2, fontSize: "14px", lineHeight: 1.6 }}>
                                    {paperData.description}
                                </Typography>

                                {/* Paper Details */}
                                <Box sx={{ mb: 3 }}>
                                    {paperData.pdfs_count !== undefined && paperData.pdfs_count !== null && paperData.pdfs_count > 0 && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <DescriptionIcon sx={{ fontSize: 20, color: '#6b7280' }} />
                                            <Typography sx={{ fontSize: '14px', color: '#6b7280' }}>
                                                No of pack/bundle: {paperData.pdfs_count}
                                            </Typography>
                                        </Box>
                                    )}
                                    {paperData.school && (
                                        <Typography sx={{ fontSize: '14px', color: '#6b7280', mb: 1 }}>
                                            School: {paperData.school}
                                        </Typography>
                                    )}
                                </Box>

                                {/* Price */}
                                <Typography
                                    sx={{
                                        color: "#d32f2f",
                                        fontWeight: "bold",
                                        fontSize: "24px",
                                        mb: 3,
                                    }}
                                >
                                    {paperData.currency || '€'}{paperData.price}
                                </Typography>

                                {/* Action Buttons */}
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    {isStudent && (
                                        <Button
                                            variant="contained"
                                            disableElevation
                                            onClick={handlePurchaseNow}
                                            disabled={addingToCart || purchasing}
                                            fullWidth
                                            sx={{
                                                background: 'linear-gradient(90deg, #4450A5 0%, #EF2A1E 100%)',
                                                color: 'white',
                                                fontWeight: 600,
                                                borderRadius: '20px',
                                                px: 3,
                                                py: 1.5,
                                                textTransform: 'none',
                                                fontSize: '16px',
                                                '&:disabled': {
                                                    bgcolor: '#ccc',
                                                    color: '#666'
                                                },
                                                '&:hover': {
                                                    background: 'linear-gradient(90deg, #3a4190 0%, #d1251a 100%)',
                                                }
                                            }}
                                        >
                                            {purchasing ? 'Processing...' : 'Pay Now'}
                                        </Button>
                                    )}

                                    {isParent && (
                                        <Button
                                            variant="contained"
                                            disableElevation
                                            onClick={handleParentCheckout}
                                            disabled={addingToCart || purchasing}
                                            fullWidth
                                            sx={{
                                                background: 'linear-gradient(90deg, #4450A5 0%, #EF2A1E 100%)',
                                                color: 'white',
                                                fontWeight: 600,
                                                borderRadius: '20px',
                                                px: 3,
                                                py: 1.5,
                                                textTransform: 'none',
                                                fontSize: '16px',
                                                '&:disabled': {
                                                    bgcolor: '#ccc',
                                                    color: '#666'
                                                },
                                                '&:hover': {
                                                    background: 'linear-gradient(90deg, #3a4190 0%, #d1251a 100%)',
                                                }
                                            }}
                                        >
                                            {purchasing ? 'Processing...' : 'Pay Now'}
                                        </Button>
                                    )}

                                    {!isStudent && !isParent && (
                                        <Button
                                            variant="contained"
                                            disableElevation
                                            onClick={() => navigate('/signup')}
                                            fullWidth
                                            sx={{
                                                background: 'linear-gradient(90deg, #4450A5 0%, #EF2A1E 100%)',
                                                color: 'white',
                                                fontWeight: 600,
                                                borderRadius: '20px',
                                                px: 3,
                                                py: 1.5,
                                                textTransform: 'none',
                                                fontSize: '16px',
                                                '&:hover': {
                                                    background: 'linear-gradient(90deg, #3a4190 0%, #d1251a 100%)',
                                                }
                                            }}
                                        >
                                            Login to Pay Now
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Success/Error Snackbar */}
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
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default AddToCartPaper;

