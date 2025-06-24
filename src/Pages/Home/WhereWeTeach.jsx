import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,Container
} from "@mui/material";
import { containerStyles, h2, spainColor } from "../style";

const formats = [
  {
    title: "In-Person",
    desc: "Locations: Ealing, Kingston, New Malden, Slough, Wimbledon",
    img: "/assets/images/where-1.png",
  },
  {
    title: "Online Live",
    desc: "Interactive classes via Zoom",
    img: "/assets/images/where-2.png",
  },
  {
    title: "On-Demand",
    desc: "Self-paced modules",
    img: "/assets/images/where-3.png",
  },
];

export default function WhereWeTeach() {
  return (
    <Box sx={{ py: 10, px: 3, backgroundColor: "#fff" }}>
        <Container sx={containerStyles}>
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
          LOCATIONS & FORMATS SECTION
        </Typography>
        <Typography
          variant="h4"
          sx={h2}
        >
          Where and{" "}
          <Box component="span" sx={spainColor}>
            How
          </Box>{" "}
          <Box component="span" sx={spainColor}>
            We Teach
          </Box>
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {formats.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "0 6px 24px rgba(0,0,0,0.04)",
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={item.img}
                alt={item.title}
              />
              <CardContent>
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
