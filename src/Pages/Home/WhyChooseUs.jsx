import React from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,Container
} from "@mui/material";
import { button, containerStyles, h2, icon, spainColor } from "../style";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function WhyChooseUs() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ py: 8, px: 3, backgroundColor: "#fff" }}>
        <Container sx={containerStyles}>
      <Grid container spacing={4} alignItems="center">
        {/* LEFT IMAGES SECTION */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <img
                      src="/assets/images/whychoose-img.png" // Replace with your uploaded images
                      alt="Character"
                      style={{  height: "auto" }}
                    />
          </Box>
        </Grid>

        {/* RIGHT TEXT SECTION */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={h2}>
            Why{" "}
            <Box component="span" sx={spainColor}>
              Families
            </Box>{" "}
            <Box component="span" sx={spainColor}>
              Choose
            </Box>{" "}
            Us
          </Typography>

          <Typography variant="body1" sx={{ mb: 4, color: "#555" }}>
            Trusted by Thousands of Families for Over a Decade
            <br />
            We combine expert teaching, original materials, and personalised support to give your child the best chance of 11+ success.
          </Typography>

          <Grid container spacing={2}>
            {[
              {
                number: "01",
                title: "Expert Tutors",
                desc: "Qualified UK teachers with 10+ years’ 11+ experience.",
              },
              {
                number: "02",
                title: "Original Resources",
                desc: "Proprietary papers and practice tests.",
              },
              {
                number: "03",
                title: "Small Classes",
                desc: "Max 9 pupils for personalized attention.",
              },
              {
                number: "04",
                title: "Mock Exams & Reporting",
                desc: "Real-time feedback for students and parents.",
              },
            ].map((item) => (
              <Grid item xs={12} sm={6} key={item.number}>
                <Card sx={{ height: "100%", background: "#f5f5f5", borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                      {item.number} &nbsp; {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: "#444" }}>
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
<Box sx={{py:5}}>
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
    </Button></Box>
        </Grid>
      </Grid>
      </Container>
  
    </Box>
  );
}
