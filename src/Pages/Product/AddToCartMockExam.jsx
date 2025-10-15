import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Typography, Chip, IconButton, Container, Snackbar, Alert, CircularProgress } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PageHeader from "../PageHeader";
import { button, containerStyles, icon, spainColor } from '../style';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import api from '../../api';

const AddToCartMockExam = () => {
    const dispatch = useDispatch();
    const { slug } = useParams();
    const navigate = useNavigate();
    const [mockExamData, setMockExamData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Mock Exams", path: "/mock-exams" },
        { label: mockExamData?.name || "Loading...", path: "#" },
    ];

    // Fetch mock exam details
    useEffect(() => {
        const fetchMockExamDetails = async () => {
            if (!slug) {
                setSnackbar({
                    open: true,
                    message: 'No mock exam selected',
                    severity: 'error'
                });
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await api.get(`/mock-exam/${slug}/details`);
                
                if (response.data.success) {
                    setMockExamData(response.data.data);
                } else {
                    throw new Error('Failed to fetch mock exam details');
                }
            } catch (error) {
                console.error('Error fetching mock exam details:', error);
                setSnackbar({
                    open: true,
                    message: error.response?.data?.message || 'Failed to load mock exam details',
                    severity: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchMockExamDetails();
    }, [slug]);

    const handleAddToCart = async () => {
        if (!mockExamData) {
            setSnackbar({
                open: true,
                message: 'No mock exam data found',
                severity: 'error'
            });
            return;
        }
        
        setAddingToCart(true);
        
        try {
            const payload = {
                product_type: "mock",
                product_id: mockExamData.id,
                quantity: 1,
                price_id:mockExamData.stripe_price_id
            };

            const result = await dispatch(addToCart(payload));
            
            if (addToCart.fulfilled.match(result)) {
                setSnackbar({
                    open: true,
                    message: 'Mock exam added to cart successfully!',
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

    if (!mockExamData) {
        return (
            <>
                <PageHeader
                    title="Mock Exam Not Found"
                    breadcrumbs={breadcrumbs}
                />
                <Box sx={{ py: 8, textAlign: 'center' }}>
                    <Typography variant="h6" color="error">
                        Mock exam details could not be loaded
                    </Typography>
                    <Button
                        component={Link}
                        to="/mock-exams"
                        variant="contained"
                        sx={{ mt: 2 }}
                    >
                        Back to Mock Exams
                    </Button>
                </Box>
            </>
        );
    }

    return (
        <>
            <PageHeader
                title={mockExamData.name}
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
                                to="/mock-exams"
                                sx={{ color: "#7b1fa2" }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography sx={{ fontSize: "14px", fontWeight: 500, color: "#1f2937" }}>
                                {mockExamData.name}
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
                                    src={mockExamData.image || "/assets/images/product-img.png"}
                                    alt={mockExamData.name}
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
                                    {mockExamData.name}
                                </Typography>

                                {/* Category & Format Badges */}
                                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                    {mockExamData.category && (
                                        <Chip
                                            label={mockExamData.category}
                                            sx={{
                                                backgroundColor: "#e0e7ff",
                                                color: "#4f46e5",
                                                fontWeight: 600,
                                                fontSize: "14px",
                                            }}
                                        />
                                    )}
                                    {mockExamData.format && (
                                        <Chip
                                            label={mockExamData.format}
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
                                    {mockExamData.description}
                                </Typography>

                                {/* Exam Details */}
                                <Box sx={{ mb: 3 }}>
                                    {mockExamData.duration_minutes && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <AccessTimeIcon sx={{ fontSize: 20, color: '#6b7280' }} />
                                            <Typography sx={{ fontSize: '14px', color: '#6b7280' }}>
                                                Duration: {mockExamData.duration_minutes} minutes
                                            </Typography>
                                        </Box>
                                    )}
                                    {mockExamData.questions_count && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <AssignmentIcon sx={{ fontSize: 20, color: '#6b7280' }} />
                                            <Typography sx={{ fontSize: '14px', color: '#6b7280' }}>
                                                Questions: {mockExamData.questions_count} | Total Marks: {mockExamData.total_marks || 'N/A'}
                                            </Typography>
                                        </Box>
                                    )}
                                    {mockExamData.school && (
                                        <Typography sx={{ fontSize: '14px', color: '#6b7280', mb: 1 }}>
                                            School: {mockExamData.school}
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
                                    {mockExamData.formatted_price || `${mockExamData.currency}${mockExamData.price}`}
                                </Typography>

                                {/* Add to Cart Button */}
                                <Button
                                    disableElevation
                                    onClick={handleAddToCart}
                                    disabled={addingToCart}
                                    sx={{
                                        ...button,
                                        '&:disabled': {
                                            bgcolor: '#ccc',
                                            color: '#666'
                                        }
                                    }}
                                >
                                    {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                                    <Box sx={icon}>
                                        <ArrowForwardIcon sx={{ fontSize: 20, color: addingToCart ? '#666' : '#EF2A1E' }} />
                                    </Box>
                                </Button>
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

export default AddToCartMockExam;
