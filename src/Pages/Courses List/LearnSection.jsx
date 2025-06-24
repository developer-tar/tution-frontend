

import React, { useState } from "react";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { containerStyles, h2, spainColor } from "../style";

const learnData = [
  {
    label: "Dynamic Storytelling",
    content: [
      "Plot development: Learn how to craft engaging storylines.",
      "Character creation: Understand how to build realistic, relatable characters.",
      "Setting & theme: Discover how to establish immersive settings and compelling themes.",
    ],
  },
  {
    label: "Impactful Persuasion",
    content: [
      "Master persuasive techniques to influence readers.",
      "Craft compelling arguments with strong evidence.",
      "Develop persuasive storytelling skills.",
    ],
  },
  {
    label: "Vocabulary Expansion",
    content: [
      "Learn new words to enhance writing quality.",
      "Implement vocabulary in storytelling.",
      "Practice word association and synonyms.",
    ],
  },
  {
    label: "Imagination Ignition",
    content: [
      "Develop creative thinking strategies.",
      "Explore storytelling through imaginative prompts.",
      "Create unique plots and settings.",
    ],
  },
  {
    label: "SPaG Mastery",
    content: [
      "Improve spelling, punctuation, and grammar.",
      "Practice editing and proofreading skills.",
      "Learn how to maintain writing consistency.",
    ],
  },
];

export default function LearnSection() {
  const [selected, setSelected] = useState(0);

  return (
   <Box sx={{ py: 8,  backgroundColor: "#F9F9FF",textAlign:"center" }}>
        <Container sx={containerStyles}>
      {/* Heading */}
      <Typography
        variant="h4"
        sx={h2}
      >
        What will{" "}
         <Box
                       component="span"
                       sx={spainColor}
                     >my child{" "}
       learn?</Box>
      </Typography>

      <Grid container spacing={4} sx={{pt:2}}>
        {/* Left Sidebar */}
        <Grid item xs={12} md={4} >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              maxWidth: "300px",
              mx: "auto",
            }}
          >
            {learnData.map((item, index) => (
              <Button
                key={index}
                onClick={() => setSelected(index)}
                sx={{
                  backgroundColor: selected === index ? "#0d47a1" : "#fff",
                  color: selected === index ? "#fff" : "#0d47a1",
                  fontWeight: selected === index ? "600" : "500",
                  borderRadius: "12px",
                  boxShadow: selected === index ? "0px 4px 10px rgba(0, 0, 0, 0.1)" : "none",
                  padding: "12px 16px",
                  textAlign: "left",
                  textTransform: "none",
                  fontSize: "14px",
                  border: "1px solid #d1d5db",
                  "&:hover": {
                    backgroundColor: selected === index ? "#0d47a1" : "#f0f0f0",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Grid>

        {/* Right Content Area */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{
            
              borderRadius: "12px",
              padding: 3,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
              minHeight: "200px",
              textAlign:"left",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "600", color: "#0d47a1", mb: 2 }}
            >
              {learnData[selected].label}
            </Typography>

            <Box sx={{ ml: 1 }}>
              {learnData[selected].content.map((text, idx) => (
                <Typography
                  key={idx}
                  sx={{
                    mb: 1,
                    fontSize: "14px",
                    color: "#555",
                    lineHeight: "1.6",
                  }}
                >
                  {text}
                </Typography>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
      </Container>
    </Box>
  );
}
