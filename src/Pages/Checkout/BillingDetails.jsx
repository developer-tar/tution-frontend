import React from "react";
import { Box, Checkbox, FormControlLabel, Grid, TextField, Typography } from "@mui/material";

const fields = [
  { label: "Email Address", placeholder: "your@mail.com", fullWidth: true },
  { label: "First Name *", placeholder: "Full Name" },
  { label: "Last Name *", placeholder: "Last Name" },
  { label: "Country / Region *", placeholder: "Country / Region" },
  { label: "Street Address *", placeholder: "Street address" },
  { label: "Town / City *", placeholder: "Town / City" },
  { label: "County (optional)", placeholder: "Full Name" },
  { label: "Postcode *", placeholder: "Postcode" },
  { label: "Phone *", placeholder: "Phone" },
  { label: "Second Phone (in case of emergencies) *", placeholder: "Phone Number" },
  { label: "Child’s First Name *", placeholder: "Child’s first name" },
  { label: "Child’s Last Name", placeholder: "Child’s last name" },
  { label: "Child’s Gender *", placeholder: "Child’s gender" },
  { label: "Child’s Date of Birth *", placeholder: "Child’s date of birth" },
  { 
    label: "Does your child have any medical issues or allergies?", 
    placeholder: "Details (optional)", 
    fullWidth: true 
  },
];

export default function BillingDetails() {
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
      <Typography sx={{ fontWeight: 600, mb: 2, color: "#1f2937", fontSize: "16px" }}>
        Billing & Student Details
      </Typography>

      <Grid container spacing={2}>
        {fields.map((field, index) => (
          <Grid 
            item 
            xs={12} 
            md={field.fullWidth ? 12 : 6} 
            key={index}
          >
            <Box sx={{ mb: 1 }}>
              <Typography sx={{ mb: 0.5, fontSize: "14px", color: "#6b7280" }}>
                {field.label}
              </Typography>
              <TextField
                fullWidth
                placeholder={field.placeholder}
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
          </Grid>
        ))}
      </Grid>

      {/* Subscribe Checkbox */}
      <Box sx={{ mt: 2 }}>
        <FormControlLabel
          control={<Checkbox />}
          label="Subscribe to our newsletter"
          sx={{
            color: "#1f2937",
            "& .MuiCheckbox-root": {
              color: "#7b1fa2",
            },
          }}
        />
      </Box>
    </Box>
  );
}
