import React from "react";
import { Box, Grid, TextField, Typography } from "@mui/material";

const fields = [
  { label: "Current primary school *", placeholder: "Enter school name" },
  { label: "Special educational needs *", placeholder: "Enter special needs" },
  { label: "Targeted schools *", placeholder: "Targeted schools" },
  { label: "How did you hear about us? *", placeholder: "Please Select" },
  { label: "Order Notes (optional)", placeholder: "Enter additional notes", multiline: true, rows: 4 },
];

export default function AdditionalInfo() {
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
        Additional Information
      </Typography>

      <Grid container spacing={2}>
        {fields.map((field, index) => (
          <Grid item xs={12} key={index}>
            <Box sx={{ mb: 1 }}>
              <Typography sx={{ mb: 0.5, fontSize: "14px", color: "#6b7280" }}>
                {field.label}
              </Typography>
              <TextField
                fullWidth
                placeholder={field.placeholder}
                variant="outlined"
                multiline={field.multiline || false}
                rows={field.rows || 1}
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
    </Box>
  );
}
