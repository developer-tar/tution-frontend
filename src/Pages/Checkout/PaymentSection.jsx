import React from "react";
import { Box, Button, Checkbox, FormControlLabel, Grid, TextField, Typography } from "@mui/material";

export default function PaymentSection() {
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
      {/* Title */}
      <Typography sx={{ fontWeight: 600, mb: 2, color: "#1f2937", fontSize: "16px" }}>
        Credit/Debit Cards via Stripe
      </Typography>

      {/* Card Number */}
      <Box sx={{ mb: 2 }}>
        <Typography sx={{ mb: 0.5, fontSize: "14px", color: "#6b7280" }}>Card number</Typography>
        <TextField
          fullWidth
          placeholder="1234 1234 1234 1234"
          variant="outlined"
          sx={{
            backgroundColor: "#f5f7ff",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
               padding: "2px 5px",
            },
          }}
        />
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Expiry Date */}
        <Grid item xs={12} md={6}>
          <Typography sx={{ mb: 0.5, fontSize: "14px", color: "#6b7280" }}>Expiry date</Typography>
          <TextField
            fullWidth
            placeholder="MM / YY"
            variant="outlined"
            sx={{
              backgroundColor: "#f5f7ff",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                 padding: "2px 5px",
              },
            }}
          />
        </Grid>

        {/* Security Code */}
        <Grid item xs={12} md={6}>
          <Typography sx={{ mb: 0.5, fontSize: "14px", color: "#6b7280" }}>Security code</Typography>
          <TextField
            fullWidth
            placeholder="123"
            variant="outlined"
            sx={{
              backgroundColor: "#f5f7ff",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                 padding: "2px 5px",
              },
            }}
          />
        </Grid>
      </Grid>

      {/* Privacy Notice */}
      <Typography sx={{ fontSize: "12px", color: "#6b7280", mb: 2 }}>
        Your personal data will be used to process your order, support your experience through this website, 
        and for other purposes described in our privacy policy.
      </Typography>

      {/* Agreement Checkbox */}
      <FormControlLabel
        control={<Checkbox sx={{ color: "#7b1fa2" }} />}
        label={
          <Typography sx={{ fontSize: "14px", color: "#1f2937" }}>
            I understand I will be called to set up direct debit (if registering for weekly tuition) 
            and have read and agree to the website terms and conditions *
          </Typography>
        }
        sx={{
          mb: 3,
          alignItems: "flex-start",
        }}
      />

      {/* Place Order Button */}
      <Button
        variant="contained"
        sx={{
          background: "linear-gradient(90deg, #4450A5 0%, #EF2A1E 100%)",
          color: "#fff",
          padding: "12px 0",
          fontWeight: 600,
          borderRadius: "30px",
          width: "100%",
          "&:hover": {
            background: "linear-gradient(to right, #d32f2f, #7b1fa2)",
          },
        }}
      >
        Place order
      </Button>
    </Box>
  );
}
