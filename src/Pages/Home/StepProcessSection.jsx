import React from "react";
import { Box, Typography, Grid, Card, CardContent, CardMedia ,Container} from "@mui/material";
import { containerStyles, h2, spainColor } from "../style";

const steps = [
  {
    title: "Free Assessment",
    desc: "Online diagnostic test",
    img: "/assets/images/infographic-1.svg",
  },
  {
    title: "Personalised Plan",
    desc: "Tailored timetable and resources",
    img: "/assets/images/personal-2.svg",
  },
  {
    title: "Live Tuition",
    desc: "Small groups or 1:1",
    img: "/assets/images/smartphone-3.svg",
  },
  {
    title: "Mock & Review",
    desc: "Regular exams & progress reports",
    img: "/assets/images/server-4.svg",
  },
];

export default function StepProcessSection() {
  return (
    <Box sx={{ py: 10, px: 3, backgroundColor: "#F9F9FF" }}>
        <Container sx={containerStyles}>
      {/* Section Heading */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="caption"
          sx={{
            backgroundColor: "#E6E7FF",
            px: 2,
            py: 0.5,
            borderRadius: 20,
            fontWeight: 600,
            color: "#5C60EF",
          }}
        >
          HOW IT WORKS
        </Typography>
        <Typography variant="h4" sx={h2}>
          Our Simple{" "}
          <Box component="span" sx={spainColor}>
            4-Step
          </Box>{" "}
          <Box component="span" sx={spainColor}>
            Process
          </Box>
        </Typography>
      </Box>

      {/* Step Cards */}
      <Grid container spacing={4} justifyContent="center">
        {steps.map((item, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                p: 3,
                background: "#fff",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                textAlign: "center",
                height: "100%",
              }}
            >
              <CardMedia
                component="img"
                image={item.img}
                alt={item.title}
                sx={{ width: 70, mx: "auto", mb: 2 }}
              />
              <CardContent sx={{ p: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: "#555" }}>
                  {item.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      </Container>
    </Box>
  );
}
