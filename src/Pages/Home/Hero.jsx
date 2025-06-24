import React from "react";
import { Box, Typography, Button, Grid, useTheme, useMediaQuery, Avatar, Container } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { button, containerStyles, h1, icon, mainBr, spainColor } from "../style";
import { Link } from "react-router-dom";

export default function Hero() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        px: 4,
        py: { xs: 6, md: 12 },
        backgroundImage: `url("/assets/images/banner-bg.png")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        // backgroundPosition: "center",
        height: "auto",
      }}
    >
      <Container sx={containerStyles}>
        <Grid container alignItems="center" spacing={4}>
          {/* LEFT SECTION */}
          <Grid item xs={12} md={6}>
            <Box mb={2}>
              <Typography
                variant="caption"
                sx={{
                  background: "#1A2334",
                  px: 1.5,
                  py: 2,
                  borderRadius: 2,
                  fontWeight: 500,
                  fontSize: { md: "12px", lg: "16px" },
                  color: "#FFFFFF",
                  borderRadius: "50px"
                }}
              >
                🏆 The Leader in Online Learning
              </Typography>
            </Box>

            <Typography variant="h1" sx={h1}>
              Unlock Your{" "}   <Box component="br" sx={mainBr}></Box>
              <Box
                component="span"
                sx={spainColor}
              >
                Child’s
              </Box>{" "}
              <Box
                component="span"
                sx={spainColor}
              >
                Potential
              </Box>
              {" "}<Box component="br" sx={mainBr}></Box>
              for 11+ Success
            </Typography>

            <Typography variant="body1" sx={{ color: "#4B536A", mt: 2, mb: 4, fontSize: { xs: "12px", sm: "14px", md: "16px", lg: "18px" } }}>
              Expert 11+ Tuition in Maths, English & Reasoning <Box component="br" sx={mainBr}></Box> – Online & In-Centre Since 2009.
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
              <Link to="/course-view" style={{ textDecoration: "none" }} >
              <Button
                disableElevation
                sx={button}
              >
                Start Now
                <Box
                  sx={icon}
                >
                  <ArrowForwardIcon sx={{ fontSize: 20, color: '#EF2A1E' }} />
                </Box>
              </Button></Link>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                {/* Replace with your actual avatars */}
                <img
                  src="/assets/images/triple-img.png" // Replace with your uploaded image
                  alt="Character"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
                <Typography variant="body2" sx={{ ml: 1, fontSize: "16px", fontWeight: "bold", color: "#000000" }}>
                  1000+ <Box component="br" sx={mainBr}></Box>   <Box
                    component="span"
                    sx={{ fontSize: "14px", fontWeight: 400, color: "#4B536A" }}
                  >Google Reviews</Box>
                </Typography> <Box component="br" sx={mainBr}></Box>


              </Box>
            </Box>
          </Grid>

          {/* RIGHT SECTION */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: isMobile ? "center" : "center" }}>
              <img
                src="/assets/images/hero-right-img.png" // Replace with your uploaded image
                alt="Character"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
