import React from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Divider, Container
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { button, containerStyles, icon } from "./style";

export default function Footer() {
  return (
    <Box sx={{ mt: "15%", bgcolor: "#0e0e23", color: "#fff", pt: 6 }}>
      <Container sx={containerStyles}>
        {/* Subscription Box */}
        <Box
          sx={{
            background: "linear-gradient(90deg, #f2efff, #fce3f3)",
            color: "#000",
            mx: 3,
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-around",
            alignItems: "center",
            gap: 3,
            mt: "-12%"
          }}
        >
          {/* Text and Input */}
          <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "column" },
            // justifyContent: "space-between",
          }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              Subscribe to our <span style={{ color: "#D6232A" }}>email</span>{" "}
              list for our latest updates!
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                mt: 2,
              }}
            >
              <TextField placeholder="Name" size="small" fullWidth />
              <TextField placeholder="Email" size="small" fullWidth />

            </Box>
            <Box sx={{display:"flex",justifyContent:"flex-start",py:2}}>
            <Button
              disableElevation
              sx={button}
            >
              Submit
              <Box
                sx={icon}
              >
                <ArrowForwardIcon sx={{ fontSize: 20, color: '#EF2A1E' }} />
              </Box>
            </Button></Box>
          </Box>

          {/* Image */}
          <Box sx={{ flexShrink: 0 }}>
            <img
              src="/assets/images/email-img.png" // Replace with your image
              alt="Subscribe Icon"
              style={{ maxWidth: 120, height: "auto" }}
            />
          </Box>
        </Box>

        {/* Footer Links */}
        <Grid container spacing={4} sx={{ mt: 6, px: 4, pb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Dummy Logo
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "#aaa" }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6">Useful Links</Typography>
            {["Courses", "Term Dates", "Locations", "Schools Info", "Mocks", "Contact Us"].map(
              (text) => (
                <Typography key={text} variant="body2" sx={{ mt: 1, color: "#aaa" }}>
                  {text}
                </Typography>
              )
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6">Legal</Typography>
            {["Privacy Policy", "Terms & Conditions"].map((text) => (
              <Typography key={text} variant="body2" sx={{ mt: 1, color: "#aaa" }}>
                {text}
              </Typography>
            ))}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6">Get Contact</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "#aaa" }}>
              Phone: (406) 555-0120
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "#aaa" }}>
              Email: ubeliste@example.com
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "#aaa" }}>
              Location: North America, USA
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: "#444" }} />
        <Box
          sx={{
            textAlign: "center",
            py: 2,
            fontSize: 12,
            color: "#888",
            px: 2,
          }}
        >
          ©2025. All rights reserved by <span style={{ color: "#aaa" }}>@website</span> &nbsp; | &nbsp;
          Terms of service | Privacy Policy | Subscription | Login & Register
        </Box>
      </Container>
    </Box>
  );
}
