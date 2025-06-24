import React from "react";
import { Box, Container, Grid, Typography, Card, CardContent, Avatar } from "@mui/material";
import { containerStyles, h2, spainColor } from "../style";

const teamMembers = [
  {
    name: "Annette Black",
    role: "Consultant",
    img: "/assets/images/meet1.png",
    bgColor: "#D9E6E1",
  },
  {
    name: "Kathryn Murphy",
    role: "Administrator",
    img: "/assets/images/meet2.png",
    bgColor: "#F5DBE7",
  },
  {
    name: "Leslie Alexander",
    role: "Instructor",
    img: "/assets/images/meet3.png",
    bgColor: "#D6E4F0",
  },
  {
    name: "Mina Holkase",
    role: "Course Partner",
    img: "/assets/images/meet4.png",
    bgColor: "#EFE3D8",
  },
];

export default function TeamSection() {
  return (
    <Box sx={{ py: 10, backgroundColor: "#F9F9FF" }}>
      <Container sx={containerStyles}>
        {/* Section Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="caption"
            sx={{
              backgroundColor: "#E6E7FF",
              px: 2,
              py: 0.5,
              borderRadius: 20,
              fontWeight: 600,
              color: "#5C60EF",
              mb: 1,
              display: "inline-block",
            }}
          >
            TEAM
          </Typography>
          <Typography variant="h2" sx={h2}>
            meet our{" "}
            <Box component="span" sx={spainColor}>
              team
            </Box>
          </Typography>
        </Box>

        {/* Team Cards */}
        <Grid container spacing={4}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
               <Box
                            component="img"
                            src={member.img}
                            alt="About 3"
                            sx={{
                            //   width: "100%",
                            //   height: "150px",
                            //   objectFit: "cover",
                            //   borderRadius: 3,
                            //   gridColumn: "span 2",
                            }}
                          />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
