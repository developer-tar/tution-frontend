import React from "react";
import { Box, Container, Typography, Card, Avatar, Rating } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { containerStyles, h2, spainColor } from "../style";

const testimonials = [
  {
    name: "Marsha Miskarado",
    role: "Parent via Case.io",
    feedback: "Exam helped my son secure a place at Tiffin Boys’ with ease. The mock exams were a game-changer.",
    avatar: "/assets/images/user1.png",
  },
  {
    name: "John Doe",
    role: "Student",
    feedback: "Exam helped my son secure a place at Tiffin Boys’ with ease. The mock exams were a game-changer.",
    avatar: "/assets/images/user2.png",
  },
  {
    name: "Sarah Lee",
    role: "Instructor",
    feedback: "Exam helped my son secure a place at Tiffin Boys’ with ease. The mock exams were a game-changer.",
    avatar: "/assets/images/user3.png",
  },
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

export default function AboutTestimonial() {
  return (
    <Box sx={{ py: 10, backgroundColor: "#F9F9FF" }}>
      <Container sx={containerStyles}>
        {/* Header */}
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
            TESTIMONIALS
          </Typography>

          <Typography variant="h2" sx={h2}>
            Real Results.{" "}
          <Box component="span" sx={spainColor}>
              Real Confidence
            </Box>
          </Typography>
        </Box>

        {/* Slider */}
        <Slider {...sliderSettings}>
          {testimonials.map((item, index) => (
            <Box key={index} sx={{ px: 2 }}>
              <Card
                sx={{
                  p: 3,
                  backgroundColor: "#fff",
                  borderRadius: 3,
                  boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.05)",
                  textAlign: "left",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    src={item.avatar}
                    alt={item.name}
                    sx={{
                      width: 50,
                      height: 50,
                      mr: 2,
                    }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {item.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#777", fontSize: "14px" }}
                    >
                      {item.role}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#555",
                    fontSize: "14px",
                    mb: 2,
                  }}
                >
                  {item.feedback}
                </Typography>

                {/* Rating */}
                <Rating value={5} readOnly size="small" />
              </Card>
            </Box>
          ))}
        </Slider>
      </Container>
    </Box>
  );
}
