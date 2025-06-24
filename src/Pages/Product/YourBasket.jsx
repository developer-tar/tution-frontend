import React from "react";
import { Box, Button, Grid, Typography, TextField, Container } from "@mui/material";
import { containerStyles } from "../style";
import PageHeader from "../PageHeader";
import { Link } from "react-router-dom";


export default function YourBasket() {

    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Courses", path: "/course-list" },
        { label: " Year 3 Weekly 24", path: "/" },
        { label: "Year 3: EALING 2024 - 2025", path: "/" },
    ];

    return (
        <>
            <PageHeader
                title="Your Basket"
                // subtitle="Find the perfect course for your child"
                breadcrumbs={breadcrumbs}
            />
            <Box sx={{ py: 6, px: { xs: 2, md: 6 }, }}>
                <Container sx={containerStyles}>
                    <Grid container spacing={4}>
                        {/* Product List and Coupon Section */}
                        <Grid item xs={12} md={8}>
                            {/* Product List */}
                            <Box
                                sx={{
                                    backgroundColor: "#F9F9FF",
                                    padding: 3,
                                    borderRadius: "5px",
                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                                    mb: 3,
                                }}
                            >
                                <Grid container alignItems="center" spacing={2}>
                                    {/* Product Image */}
                                    <Grid item xs={3}>
                                        <Box
                                            component="img"
                                            src="/assets/images/product-img.png"
                                            alt="Product"
                                            sx={{
                                                width: "80px",
                                                height: "auto",
                                                borderRadius: "8px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </Grid>

                                    {/* Product Info */}
                                    <Grid item xs={3}>
                                        <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "#1f2937" }}>
                                            Year 3: EALING 2024 - 2025
                                        </Typography>
                                        <Typography sx={{ fontSize: "12px", color: "#6b7280" }}>
                                            Sat 9.00am-10.45am
                                        </Typography>
                                    </Grid>

                                    {/* Price */}
                                    <Grid item xs={2}>
                                        <Typography sx={{ fontSize: "14px", color: "#1f2937" }}>£100.00</Typography>
                                    </Grid>

                                    {/* Quantity */}
                                    <Grid item xs={2}>
                                        <Typography sx={{ fontSize: "14px", color: "#1f2937" }}>1</Typography>
                                    </Grid>

                                    {/* Subtotal */}
                                    <Grid item xs={2}>
                                        <Typography sx={{ fontSize: "14px", fontWeight: 600, color: "#d32f2f" }}>
                                            £200.00
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Coupon Section */}
                            <Box
                                sx={{
                                    backgroundColor: "#F9F9FF",
                                    padding: 2,
                                    borderRadius: "5px",
                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                                    display: "flex",
                                    gap: 2,
                                    alignItems: "center",
                                }}
                            >
                                <TextField
                                    fullWidth
                                    placeholder="Coupon Code"
                                    variant="outlined"
                                    sx={{
                                        backgroundColor: "#f5f7ff",
                                        borderRadius: "8px",
                                        "& .MuiOutlinedInput-root": {
                                            padding: "2px 5px",
                                        },
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    sx={{
                                        background: "linear-gradient(90deg, #4450A5 0%, #EF2A1E 100%)",
                                        color: "#fff",
                                        padding: "8px 14px",
                                        fontWeight: 600,
                                        borderRadius: "30px",
                                        textTransform: "none",
                                        // "&:hover": {
                                        //     background: "linear-gradient(to right, #ff4b2b, #ff416c)",
                                        // },
                                    }}
                                >
                                    Apply Coupon
                                </Button>
                            </Box>
                        </Grid>

                        {/* Basket Totals Section */}
                        <Grid item xs={12} md={4}>
                            <Box
                                sx={{
                                    backgroundColor: "#F9F9FF",
                                    padding: 3,
                                    borderRadius: "5px",
                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: "16px",
                                        color: "#1f2937",
                                        mb: 2,
                                    }}
                                >
                                    Basket Totals
                                </Typography>

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mb: 3,
                                    }}
                                >
                                    <Typography sx={{ fontSize: "14px", color: "#6b7280" }}>Total:</Typography>
                                    <Typography sx={{ fontSize: "16px", fontWeight: 600, color: "#d32f2f" }}>
                                        £200.00
                                    </Typography>
                                </Box>
                                <Link to="/checkout" style={{ textDecoration: "none" }} >
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{
                                            background: "linear-gradient(90deg, #4450A5 0%, #EF2A1E 100%)",
                                            color: "#fff",
                                            padding: "12px 0",
                                            fontWeight: 600,
                                            borderRadius: "30px",
                                            textTransform: "none",
                                            "&:hover": {
                                                background: "linear-gradient(to right, #d32f2f, #7b1fa2)",
                                            },
                                        }}
                                    >
                                        Proceed to Checkout
                                    </Button></Link>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
}
