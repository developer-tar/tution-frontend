import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Grid,
  Chip,
  useMediaQuery,
  useTheme,Container
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { containerStyles, h2 } from "../style";


const faqs = [
  {
    question: "What is the ideal class size?",
    answer:
      "You can run Histudy easily. Any School, University, College can be use this Histudy education template for their educational purpose. A university can be success you. Run their online learning management system by Histudy education template any where and time.",
  },
  {
    question: "When should my child start 11+ preparation?",
    answer: "",
  },
  {
    question: "How do online and on-demand differ?",
    answer: "",
  },
  {
    question: "How can I get the customer support?",
    answer: "",
  },
  {
    question: "Do you offer one-to-one tuition?",
    answer: "",
  },
  {
    question: "What if my child misses a class?",
    answer: "",
  },
];

export default function FAQSection() {
  const [expanded, setExpanded] = useState("panel0");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (panel) => (_, isExpanded) =>
    setExpanded(isExpanded ? panel : false);

  return (
    <Box sx={{ py: 10, px: 3, backgroundColor: "#fff" }}>
        <Container sx={containerStyles}>
      {/* Section Heading */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Chip
          label="FAQ"
          sx={{
            backgroundColor: "#E6E7FF",
            color: "#5C60EF",
            fontWeight: 600,
            mb: 1,
          }}
        />
        <Typography variant="h4" sx={h2}>
          Frequently Asked{" "}
         
            Questions
         
        </Typography>
      </Box>

      {/* FAQ Accordions */}
      <Grid container spacing={4}>
        {faqs.map((faq, index) => (
          <Grid key={index} item xs={12} md={6}>
            <Accordion
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              elevation={0}
              sx={{
                borderRadius: 3,
                backgroundColor: "#F9F9FF",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#3c3c3c" }} />}
              >
                <Typography sx={{ fontWeight: 600 }}>{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" sx={{ color: "#555" }}>
                  {faq.answer || "Answer content can be updated here as needed."}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>
      </Container>
    </Box>
  );
}
