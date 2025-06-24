import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Rating,Container
} from "@mui/material";
import { containerStyles, h2, spainColor } from "../style";



export default function ExamTypes() {
  return (
    <Box sx={{ py: 10, px: 3, backgroundColor: "#fff" }}>
        <Container sx={containerStyles}>
  

      {/* Exam Types */}
      <Box sx={{ textAlign: "left", mt: 8 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Exam types we prepared for include  :
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "left",
            gap: 6,
            flexWrap: "wrap",
            mt: 2,
          }}
        >
          <img
            src="/assets/images/exam-logo-1.svg"
            alt="GL Assessment" style={{ filter: 'grayscale(100%)' }}
           
          />
          <img
           src="/assets/images/exam-logo-2.svg"
            alt="CEM" style={{ filter: 'grayscale(100%)' }}
           
          />
          <img
           src="/assets/images/exam-logo-3.svg"
            alt="ISEB" style={{ filter: 'grayscale(100%)' }}
           
          />
        </Box>
      </Box>
      </Container>
    </Box>
  );
}
