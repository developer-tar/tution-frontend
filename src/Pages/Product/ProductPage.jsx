import React from "react";
import { Box, Button, Grid, Typography, Chip } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PageHeader from "../PageHeader";
import { Container } from "@mui/system";
import { button, containerStyles, icon, spainColor } from "../style";
import { Link } from "react-router-dom";

export default function ProductPage() {

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Courses", path: "/courses" },
    { label: " Year 3 Weekly 24", path: "/" },
    { label: "Year 3: EALING 2024 - 2025", path: "/" },
  ];
  return (
    <>
      <PageHeader
        title="Year 3: EALING 2024 – 2025"
        // subtitle="Find the perfect course for your child"
        breadcrumbs={breadcrumbs}
      />

      <Box sx={{ py: 8, px: { xs: 2, md: 6 }, }}>
        <Container sx={containerStyles} >
          {/* Product Content */}
          <Grid container spacing={4} alignItems="center">
            {/* Left Image Section */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  padding: 3,
                  borderRadius: "10px",
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
                    height: "auto", borderRadius: "8px"
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
                <Link to="/add-to-cart" style={{ textDecoration: "none" }} >
                  <Button
                    disableElevation
                    sx={button}
                  >
                    Add to Cart
                    <Box
                      sx={icon}
                    >
                      <ArrowForwardIcon sx={{ fontSize: 20, color: '#EF2A1E' }} />
                    </Box>
                  </Button></Link>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
