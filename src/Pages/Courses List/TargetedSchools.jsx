import React from "react";
import { Box, Grid, Typography, Divider, Container } from "@mui/material";
import { containerStyles, h1, spainColor } from "../style";

const grammarSchools = [
  "Aylesbury Grammar School",
  "Aylesbury High School",
  "Beaconsfield High School",
  "Burnham Grammar School",
  "Chesham Grammar School",
  "Dame Alice Queen’s",
  "Dr Challoner’s Grammar School (Boys)",
  "Dr Challoner’s High School (Girls)",
  "Greenshaw High School",
  "Herschel Grammar School",
  "John Hampden Grammar",
  "Kendrick School",
  "The Latymer School",
  "Langley Grammar School",
  "Nonsuch High School for Girls",
  "Queen Elizabeth’s School",
  "St Bernard’s Catholic Grammar School",
  "Sutton Grammar School",
  "Sir Henry Floyd Grammar School",
  "Sir William Borlase’s Grammar School",
  "Royal Grammar School",
  "Royal Latin School",
  "Tiffin School",
  "Tiffin Girls’ School",
  "Upton Court Grammar School",
  "Wallington County Grammar School",
  "Wallington High School for Girls",
  "Watford Grammar School for Girls",
  "Wilson’s School",
];

const independentSchools = [
  "Channing School",
  "City of London School",
  "City of London School for Girls",
  "Emanuel School",
  "Epsom College",
  "Francis Holland School (Sloane Square)",
  "Francis Holland School (Regent’s Park)",
  "Godolphin and Latymer School",
  "Hampton School",
  "Ibstock Place",
  "King’s College School (Wimbledon)",
  "Kingston Grammar School",
  "Lady Eleanor Holles",
  "Latymer Upper School",
  "Merchant Taylors’ School",
  "More House School",
  "North London Collegiate School",
  "Northwood College for Girls",
  "Notting Hill and Ealing High School",
  "Putney High School",
  "Queen’s College London",
  "Queen’s Gate School",
  "South Hampstead High School",
  "St Augustine’s Priory",
  "St Benedict’s School",
  "St Catherine’s School",
  "St Helen’s School",
  "St James Senior Boys’ School",
  "St James Senior Girls’ School",
  "St Margaret’s School",
  "St Paul’s Juniors",
  "St Paul’s Girls’ School",
  "Surbiton High School",
  "Sutton High School",
  "Westminster Under School",
  "Wimbledon High School",
  "Wycombe Abbey",
];

export default function TargetedSchools() {
  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 6 }, }}>
      <Container sx={containerStyles}>
        {/* Heading Section */}
        <Typography
          variant="h4"
          sx={{ ...h1, textAlign: "center" }}
        >
          Fully prepare your{" "}
          <Box
            component="span"
            sx={spainColor}
          >child for their{" "}<br/>
            targeted </Box>  <Box
              component="span"
              sx={spainColor}
            >schools</Box>
        </Typography>

        <Typography
          sx={{
            textAlign: "center",
            mb: 4,
            fontSize: "16px",
            color: "#555",
            maxWidth: "800px",
            mx: "auto",
          }}
        >
          Our course will prepare your child for the following schools that use a
          creative writing task as part of their 11 Plus entrance exam. This list
          is not exhaustive and our course prepares for all writing tasks in 11+
          exams. Contact us if your targeted school is relevant.
        </Typography>

        <Grid container spacing={4}>
          {/* Grammar Schools Column */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: "#F6F6FD",
                padding: "24px", height: "100%", borderRadius: "10px"

              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  color: "#d32f2f",
                  fontSize: "18px",
                  borderLeft: "5px solid #d32f2f",
                  pl: 2
                }}
              >
                Grammar Schools
              </Typography>

              {grammarSchools.map((school, index) => (
                <Typography key={index} sx={{ fontSize: "15px", mb: 1, color: "#555" }}>
                  {school}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Independent Schools Column */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: "#F6F6FD",
                padding: "24px", height: "100%", borderRadius: "10px"

              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  color: "#7b1fa2",
                  fontSize: "18px",
                  borderLeft: "5px solid #7b1fa2", pl: 2
                }}
              >
                Independent Schools
              </Typography>

              {independentSchools.map((school, index) => (
                <Typography key={index} sx={{ fontSize: "15px", mb: 1, color: "#555" }}>
                  {school}
                </Typography>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
