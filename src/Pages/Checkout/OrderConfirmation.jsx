import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";

const bounce = keyframes`
  0%   { transform: scale(0.9); opacity: 0.8; }
  50%  { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

export default function OrderConfirmationPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #F9F9FF 0%, #ECECFE 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: "#fff",
          p: 5,
          borderRadius: 6,
          boxShadow: 4,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            animation: `${bounce} 0.6s ease`,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 80, color: "#7F56D9" }} />
        </Box>

        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: "#1f2937", mb: 1 }}
        >
          Order Placed Successfully!
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "#6b7280", mb: 4, px: 2 }}
        >
          We’ve received your order and sent a confirmation email. You can now relax and track your basket or return to the home page.
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#7F56D9",
              borderRadius: "30px",
              textTransform: "none",
              px: 4,
              py: 1.5,
              fontSize: "15px",
              "&:hover": { backgroundColor: "#6931D4" },
            }}
            onClick={() => navigate("/")}
          >
            Go to Home
          </Button>

          <Button
            variant="outlined"
            sx={{
              borderColor: "#7F56D9",
              color: "#7F56D9",
              borderRadius: "30px",
              textTransform: "none",
              px: 4,
              py: 1.5,
              fontSize: "15px",
              "&:hover": {
                backgroundColor: "#F3EBFF",
                borderColor: "#6931D4",
              },
            }}
            onClick={() => navigate("/basket")}
          >
            View Basket
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
