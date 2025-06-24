import React from "react";
import { Box, Button, Container, Grid, TextField, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { button, containerStyles, icon } from "../style";

export default function RegisterInterest() {
    return (
        <Box sx={{ py: 8, px: { xs: 2, md: 6 }, backgroundColor: "#F6F6FD" }}>
            <Container sx={containerStyles} >
                <Grid container spacing={4} alignItems="center">
                    {/* Left Form Section */}
                    <Grid item xs={12} md={7}>
                        <Box sx={{ maxWidth: "600px" }}>
                            {/* Badge */}
                            <Box
                                sx={{
                                    backgroundColor: "#e0e7ff",
                                    color: "#4f46e5",
                                    fontSize: "12px",
                                    padding: "4px 16px",
                                    borderRadius: "20px",
                                    fontWeight: 600,
                                    display: "inline-block",
                                    mb: 2,
                                }}
                            >
                                LIMITED PLACES AVAILABLE
                            </Box>

                            {/* Heading */}
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    color: "#1f2937",
                                    mb: 1,
                                    fontSize: { xs: "28px", md: "36px" },
                                }}
                            >
                                Register your interest
                            </Typography>

                            <Typography sx={{ color: "#6b7280", mb: 3, fontSize: "14px" }}>
                                Enter your details to receive further information
                            </Typography>

                            {/* Form */}
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Box>
                                        <Typography sx={{ mb: 1, fontSize: "14px", color: "#6b7280" }}>
                                            Parent/Guardian Name
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="Full Name"
                                            variant="outlined"
                                            sx={{
                                                backgroundColor: "#fff",
                                                borderRadius: "8px",
                                                "& .MuiOutlinedInput-root": {
                                                    padding: "2px 5px",
                                                },
                                            }}
                                        />
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Box>
                                        <Typography sx={{ mb: 1, fontSize: "14px", color: "#6b7280" }}>
                                            Child’s Name
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="Full Name"
                                            variant="outlined"
                                            sx={{
                                                backgroundColor: "#fff",
                                                borderRadius: "8px",
                                                "& .MuiOutlinedInput-root": {
                                                    padding: "2px 5px",
                                                },
                                            }}
                                        />
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box>
                                        <Typography sx={{ mb: 1, fontSize: "14px", color: "#6b7280" }}>
                                            Email Address
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="your@mail.com"
                                            variant="outlined"
                                            sx={{
                                                backgroundColor: "#fff",
                                                borderRadius: "8px",
                                                "& .MuiOutlinedInput-root": {
                                                    padding: "2px 5px",
                                                },
                                            }}
                                        />
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box>
                                        <Typography sx={{ mb: 1, fontSize: "14px", color: "#6b7280" }}>
                                            Phone Number
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="Your Phone Number"
                                            variant="outlined"
                                            sx={{
                                                backgroundColor: "#fff",
                                                borderRadius: "8px",
                                                "& .MuiOutlinedInput-root": {
                                                    padding: "2px 5px",
                                                },
                                            }}
                                        />
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Box>
                                        <Typography sx={{ mb: 1, fontSize: "14px", color: "#6b7280" }}>
                                            Current School
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="School name"
                                            variant="outlined"
                                            sx={{
                                                backgroundColor: "#fff",
                                                borderRadius: "8px",
                                                "& .MuiOutlinedInput-root": {
                                                    padding: "2px 5px",
                                                },
                                            }}
                                        />
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Box>
                                        <Typography sx={{ mb: 1, fontSize: "14px", color: "#6b7280" }}>
                                            Current School Year
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="e.g., Year 3"
                                            variant="outlined"
                                            sx={{
                                                backgroundColor: "#fff",
                                                borderRadius: "8px",
                                                "& .MuiOutlinedInput-root": {
                                                    padding: "2px 5px",
                                                },
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* Privacy Policy */}
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    color: "#6b7280",
                                    mt: 2,
                                }}
                            >
                                By registering, you agree to our{" "}
                                <span style={{ color: "#4f46e5", cursor: "pointer" }}>
                                    Terms and Privacy Policy
                                </span>
                            </Typography>

                            {/* Submit Button */}
                     <Box sx={{ py:2}}>
                            <Button
                                disableElevation
                                sx={button}
                            >
                                Register Now
                                <Box
                                    sx={icon}
                                >
                                    <ArrowForwardIcon sx={{ fontSize: 20, color: '#EF2A1E' }} />
                                </Box>
                            </Button></Box>
                        </Box>
                    </Grid>

                    {/* Right Image Section */}
                    <Grid item xs={12} md={5} sx={{ display: "flex", justifyContent: "center" }}>
                        <Box
                            component="img"
                            src="/assets/images/hero-right-img.png"
                            alt="Character"
                            sx={{
                                width: "100%",
                                maxWidth: "650px",
                                height: "auto",
                            }}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
