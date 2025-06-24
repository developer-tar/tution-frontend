import React from "react";
import { Box, Container, Typography, Breadcrumbs, Link, useMediaQuery, useTheme } from "@mui/material";

export default function AboutUsSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        py: 8,
        px: 3,
        background: "linear-gradient(90deg, #f4f6ff, #fdf2f3)",
        display: "flex",
        alignItems: "center",
        minHeight: "250px",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: "600px" }}>
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 2 }} separator="›" aria-label="breadcrumb">
            <Link underline="hover" href="/" sx={{ fontSize: 14, color: "#555" }}>
              Home
            </Link>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>About Us</Typography>
          </Breadcrumbs>

          {/* Heading and Subheading */}
          <Typography
            variant={isMobile ? "h5" : "h3"}
            sx={{
              fontWeight: 700,
              mb: 1,
              color: "#3c3c3c",
            }}
          >
            About Us
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: 16,
              color: "#555",
              lineHeight: 1.6,
            }}
          >
            We have a wide range of courses to help you achieve your goals.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
