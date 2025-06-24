import React from "react";
import { Box, Container, Grid, Typography, Button } from "@mui/material";   
import { button, containerStyles, h2, icon } from "../style";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function AboutUs() {
  return (
    <Box sx={{ py: 10, backgroundColor: "#fff" }}>
      <Container sx={containerStyles}>
        <Grid container spacing={4} alignItems="center">
          
          {/* Left Content */}
          <Grid item xs={12} md={6}>
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
                PROFILE
              </Typography>

              <Typography
                variant="h2"
                sx={h2}
              >
                About US
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#555",
                  lineHeight: 1.7,
                  mb: 4,
                }}
              >
                Trusted by Thousands of Families for Over a Decade. We are a
                group of experienced education specialists providing outstanding
                preparation for the exams and school assessments.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#555",
                  lineHeight: 1.7,
                  mb: 4,
                }}
              >
                With years of experience and proven success, our courses are
                expertly designed to build academic skills, boost exam
                confidence, and ensure every child reaches their potential.
              </Typography>

               <Button
                   disableElevation
                   sx={button}
                 >
                   See Our Success Rates
                   <Box
                     sx={icon}
                   >
                     <ArrowForwardIcon sx={{ fontSize: 20, color: '#EF2A1E' }} />
                   </Box>
                 </Button>
            </Box>
          </Grid>

          {/* Right Images */}
          <Grid item xs={12} md={6}>
          
              <Box
                component="img"
                src="assets/images/about-img.png"
                alt="About 3"
                sx={{
                  width: {xs:"100%",md:"auto"},
                //   height: "150px",
                //   objectFit: "cover",
                //   borderRadius: 3,
                //   gridColumn: "span 2",
                }}
              />
            
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
