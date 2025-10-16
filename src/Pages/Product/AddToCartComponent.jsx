import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Typography, Chip, IconButton, Container, Snackbar, Alert } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PageHeader from "../PageHeader";
import { button, containerStyles, icon, spainColor } from '../style';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';

const AddToCartComponent = () => {
    const dispatch = useDispatch();
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Courses", path: "/course-list" },
        { label: " Year 3 Weekly 24", path: "/" },
        { label: "Year 3: EALING 2024 - 2025", path: "/" },
    ];

    // Load cart data from localStorage
    useEffect(() => {
        const savedCartData = localStorage.getItem('courseCartData');
        if (savedCartData) {
            setCartData(JSON.parse(savedCartData));
        }
    }, []);

    const handleAddToCart = async () => {
        if (!cartData) {
            setSnackbar({
                open: true,
                message: 'No course data found. Please select a course first.',
                severity: 'error'
            });
            return;
        }
        
        setLoading(true);
        
        try {
            const priceId = cartData.selectedCourse?.priceId || 
                           cartData.selectedCourse?.price_id || 
                           cartData.selectedPlan?.priceId || 
                           cartData.selectedPlan?.price_id || 
                           cartData.selectedPriceId ||
                           cartData.courseData?.price_id;
            
            if (!priceId) {
                throw new Error('Price ID is missing from course data. Please contact support.');
            }

            const payload = {
                product_type: "course",
                product_id: cartData.courseData.id,
                quantity: 1,
                price_id: priceId
            };


            const result = await dispatch(addToCart(payload));
            
            if (addToCart.fulfilled.match(result)) {
                setSnackbar({
                    open: true,
                    message: 'Product added to cart successfully!',
                    severity: 'success'
                });
                
                // Trigger cart refresh in navbar
                localStorage.setItem('cartUpdated', Date.now().toString());
                window.dispatchEvent(new StorageEvent('storage', { key: 'cartUpdated' }));
                
                // Redirect to basket after success
                setTimeout(() => {
                    window.location.href = '/basket';
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
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (

        <>
            <PageHeader
                title="Year 3: EALING 2024 – 2025"
                // subtitle="Find the perfect course for your child"
                breadcrumbs={breadcrumbs}
            />
            <Box sx={{ py: 8, px: { xs: 2, md: 6 }, }}>
                <Container sx={containerStyles} >

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
                            // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                            borderTop: "3px solid blue"
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <IconButton sx={{ color: "#7b1fa2" }}>
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography sx={{ fontSize: "14px", fontWeight: 500, color: "#1f2937" }}>
                                Year 3: EALING 2024 – 2025
                            </Typography>
                        </Box>
                        <Link to="/single-product-page" style={{ textDecoration: "none" }} >
                            <Button
                                variant="contained"
                                sx={{
                                    background: "linear-gradient(90deg, #4450A5 0%, #EF2A1E 100%)",
                                    color: "#fff",
                                    fontWeight: 600,
                                    padding: "8px 16px",
                                    borderRadius: "10px",
                                    textTransform: "none",
                                    // "&:hover": {
                                    //     background: "linear-gradient(to right, #ff4b2b, #ff416c)",
                                    // },
                                }}
                            >
                                View Cart
                            </Button></Link>
                    </Box>

                    {/* Product Content */}
                    <Grid container spacing={4} alignItems="center">
                        {/* Left Image Section */}
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    backgroundColor: "#fff",
                                    padding: 3,
                                    // borderRadius: "12px",
                                    // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Box
                                    component="img"
                                    src="/assets/images/product-img.png"
                                    alt="Wonder Math Book"
                                    sx={{
                                        width: "100%",
                                        maxWidth: "300px",
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
                                    Year 3:   <Box
                                        component="span"
                                        sx={spainColor}
                                    >EALING 2024 – 2025</Box>
                                </Typography>

                                {/* Time Badge */}
                                <Chip
                                    label="Sat 9.00am-10.45am"
                                    sx={{
                                        backgroundColor: "#e0e7ff",
                                        color: "#4f46e5",
                                        fontWeight: 600,
                                        mb: 2,
                                        padding: "8px 16px",
                                        fontSize: "14px",
                                    }}
                                />

                                {/* Description */}
                                <Typography sx={{ color: "#6b7280", mb: 2, fontSize: "14px" }}>
                                    Non-refundable registration fee (one-off)
                                </Typography>

                                {/* Price */}
                                <Typography
                                    sx={{
                                        color: "#d32f2f",
                                        fontWeight: "bold",
                                        fontSize: "24px",
                                        mb: 3,
                                    }}
                                >
                                    £100.00
                                </Typography>

                                {/* Add to Cart Button */}
                                <Button
                                    disableElevation
                                    onClick={handleAddToCart}
                                    disabled={loading || !cartData}
                                    sx={{
                                        ...button,
                                        '&:disabled': {
                                            bgcolor: '#ccc',
                                            color: '#666'
                                        }
                                    }}
                                >
                                    {loading ? 'Adding to Cart...' : 'Add to Cart'}
                                    <Box
                                        sx={icon}
                                    >
                                        <ArrowForwardIcon sx={{ fontSize: 20, color: loading ? '#666' : '#EF2A1E' }} />
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

export default AddToCartComponent;
