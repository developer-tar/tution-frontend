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

const testimonials = [
  {
    name: "Marsha Miskarado",
    role: "Eaton-Sur-Child Parent via Case.io",
    quote:
      "Exam helped my son secure a place at WIM boys! We loved the mock exams with unique content.",
    avatar: "/assets/images/testimonial-img.png",
  },
  {
    name: "Marsha Miskarado",
    role: "Eaton-Sur-Child Parent via Case.io",
    quote:
      "Exam helped my son secure a place at WIM boys! We loved the mock exams with unique content.",
      avatar: "/assets/images/testimonial-img.png",
  },
  {
    name: "Marsha Miskarado",
    role: "Eaton-Sur-Child Parent via Case.io",
    quote:
      "Exam helped my son secure a place at WIM boys! We loved the mock exams with unique content.",
      avatar: "/assets/images/testimonial-img.png",
  },
];

export default function TestimonialsSection() {
  return (
    <Box sx={{ py: 10, px: 3, backgroundColor: "#fff" }}>
        <Container sx={containerStyles}>
      {/* Testimonials Heading */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Chip
          label="TESTIMONIALS"
          sx={{ 
            backgroundColor: "#E6E7FF",
            color: "#5C60EF",
            fontWeight: 600,
            mb: 1,
          }}
        />
        <Typography variant="h4" sx={h2}>
          Real Results.{" "}
          <Box component="span" sx={spainColor}>
            Real
         
        
            Confidence
          </Box>
        </Typography>
      </Box>

      {/* Testimonial Cards */}
      <Grid container spacing={4} justifyContent="center">
        {testimonials.map((item, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              elevation={0}
              sx={{
                backgroundColor: "#f9f9ff",
                borderRadius: 4,
                p: 3,
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar src={item.avatar} alt={item.name} />
                <Box sx={{ ml: 2 }}>
                  <Typography sx={{ fontWeight: "bold" }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.role}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: "#444", mb: 2 }}>
                {item.quote}
              </Typography>
              <Rating value={5} readOnly size="small" />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Exam Types */}
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Exam types we cover in our strategic <br /> approach to 11 Plus
          success
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 6,
            flexWrap: "wrap",
            mt: 2,
          }}
        >
          <img
            src="/assets/images/exam-logo-1.svg"
            alt="GL Assessment"
           
          />
          <img
           src="/assets/images/exam-logo-2.svg"
            alt="CEM"
           
          />
          <img
           src="/assets/images/exam-logo-3.svg"
            alt="ISEB"
           
          />
        </Box>
      </Box>
      </Container>
    </Box>
  );
}
