import React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import { containerStyles, h2, spainColor } from "../style";

const partners = [
  { img: "/assets/images/brand-2-logo-1.svg", label: "Sunshine Schools" },
  { img: "/assets/images/brand-2-logo-2.svg", label: "AcademyPro" },
  { img: "/assets/images/brand-2-logo-3.svg", label: "Academics" },
  { img: "/assets/images/brand-2-logo-4.svg", label: "Knowledge" },
  { img: "/assets/images/brand-2-logo-5.svg", label: "Learning" },
  { img: "/assets/images/brand-2-logo-6.svg", label: "SuperStar" },
  { img: "/assets/images/brand-2-logo-5.svg", label: "Bright Learning" },
  { img: "/assets/images/brand-2-logo-8.svg", label: "Bright Learning" },
];

export default function LearnWithSection() {
  return (
    <Box sx={{ py: 10, backgroundColor: "#fff" }}>
      <Container sx={containerStyles}>
        <Grid container spacing={4} alignItems="center">

          {/* Left Content */}
          <Grid item xs={12} md={5}>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  backgroundColor: "#E6E7FF",
                  px: 2,
                  py: 0.5,
                  borderRadius: 20,
                  fontWeight: 600,
                  color: "#5C60EF",
                  mb: 2,
                  display: "inline-block",
                }}
              >
                PARTNERS
              </Typography>

              <Typography variant="h2" sx={h2}>
                Who will{" "}
                <Box component="span" sx={spainColor}>
                  You Learn With?
                </Box>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#555",
                  lineHeight: 1.7,
                }}
              >
                Discover the top partners and instructors brands here to elevate your skills.
              </Typography>
            </Box>
          </Grid>

          {/* Partner Logos */}
          <Grid item xs={12} md={7}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(4, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                gap: {
                  xs: 2,
                  sm: 3,
                  md: 4,
                },
              }}
            >
              {partners.map((partner, index) => (
                <Box
                  key={index}
                  sx={{
                    textAlign: "center",
                    p: {
                      xs: 1,
                      sm: 2,
                    },
                    transition: "0.3s",
                    "&:hover": {
                      boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  <img
                    src={partner.img}
                    alt={partner.label}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "contain",
                      marginBottom: "10px",
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: "#555",
                      fontSize: {
                        xs: "12px",
                        sm: "14px",
                        md: "14px",
                        lg: "16px",
                      },
                    }}
                  >
                    {partner.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
