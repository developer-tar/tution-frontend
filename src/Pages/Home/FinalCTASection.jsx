import React from "react";
import { Box, Grid, Typography, Button,Container } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { button, containerStyles, h2, icon, spainColor } from "../style";

export default function FinalCTASection() {
  return (
    <Box
      sx={{
        pt: 10,
        pb: {xs:2,md:0},
        px: 3,
        background: "linear-gradient(90deg, #f4f6ff, #fdf2f3)",
        // borderTopLeftRadius: { md: "100px" },
        overflow: "hidden",
      }}
    >
        <Container sx={containerStyles}>
      <Grid
        container
        alignItems="center"
        spacing={4}
        sx={{ flexDirection: { xs: "column-reverse", md: "row" } }}
      >
        {/* Left Text Content */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h4"
            sx={h2}
          >
            Ready to Give Your{" "}
            <Box component="span" sx={spainColor}>
              Child
           
            the Competitive Edge? </Box>{" "}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: "#555" }}>
            Book a free assessment or request a call-back today.
          </Typography>
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
             </Button>
        </Grid>

        {/* Right Image */}
        <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
          <img
            src="/assets/images/readyToGive.png" // Replace with your own URL or asset
            alt="Child holding books"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </Grid>
      </Grid>
      </Container>
    </Box>
  );
}
