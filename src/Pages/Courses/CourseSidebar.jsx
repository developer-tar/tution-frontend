
import React from "react";
import { Box, Typography, Button, Card, CardContent, CardMedia } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { button, icon } from "../style";

export default function CourseSidebar({ data }) {
  return (
    <Box sx={{ px: 3, py: 4 }}>
      <Card sx={{ backgroundColor: "#fff", borderRadius: 4, boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)", overflow: "hidden", p: "2%" }}>
        <CardMedia
          component="img"
          height="200px"
          image={data.image}
          alt={data.name}
        />

        <CardContent sx={{ textAlign: "left", py: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            {data.name}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Price: ₹{data.price}
          </Typography>
          <Button disableElevation sx={button}>
            View Timetable
            <Box sx={icon}>
              <ArrowForwardIcon sx={{ fontSize: 20, color: '#EF2A1E' }} />
            </Box>
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
