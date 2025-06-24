import React from "react";
import { Box, Button, Grid, TextField, Typography, Link } from "@mui/material";

export default function OrderSummary() {
  return (
    <Box
      sx={{
        backgroundColor: "#F9F9FF",
        padding: 3,
        borderRadius: "5px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
        mb: 3,
      }}
    >
      {/* Order Summary */}
      <Typography sx={{ fontWeight: 600, mb: 2, color: "#1f2937", fontSize: "16px" }}>
        Your Order
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 1,
          fontSize: "14px",
          color: "#6b7280",
        }}
      >
        <Typography>Product</Typography>
        <Typography>Subtotal</Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          fontSize: "14px",
          color: "#1f2937",
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 500 }}>Year 3: EALING 2024 - 2025 × 2</Typography>
          <Typography sx={{ fontSize: "12px", color: "#6b7280" }}>Sat 9:00am-10:45am</Typography>
        </Box>
        <Typography sx={{ fontWeight: 600 }}>£200.00</Typography>
      </Box>

      <Box sx={{ borderTop: "1px solid #e0e0e0", pt: 2, mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1,
            fontSize: "14px",
            color: "#1f2937",
          }}
        >
          <Typography>Total</Typography>
          <Typography sx={{ fontWeight: 600, color: "#d32f2f" }}>£200.00</Typography>
        </Box>
      </Box>

      {/* Coupon Section */}
      <Box sx={{ mb: 2 }}>
        <Typography sx={{ fontSize: "14px", color: "#1f2937", mb: 1 }}>
          Have a coupon?{" "}
          <Link href="#" sx={{ color: "#7b1fa2", textDecoration: "none" }}>
            Click here to enter your coupon code
          </Link>
        </Typography>

        <Typography sx={{ fontSize: "12px", color: "#6b7280", mb: 1 }}>
          If you have a coupon code, please apply it below.
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
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
      </Box>
    </Box>
  );
}
