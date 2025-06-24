import React, { useState } from "react";
import { Box, Grid, Typography, TextField, Button, Link } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { h2, spainColor } from "./style";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        setError(""); // Reset error
        alert("Signed up successfully!");
        // Redirect to dashboard or login page
      }, 2000);
    }
  };

  return (
    <Box>
      <Grid container sx={{ boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)", borderRadius: 4 }}>
        {/* Left Section */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundImage: `url("/assets/images/signup-bg.png")`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Box>
            <img
              src="/assets/images/hero-right-img.png"
              alt="Character"
              style={{ margin: "0 auto", display: "block" }}
            />
          </Box>
        </Grid>

        {/* Right Section */}
        <Grid item xs={12} md={6} sx={{ backgroundColor: "#fff", py: 8, px: 6 }}>
          {/* Logo */}
          <Box sx={{ mb: 4, textAlign: "left" }}>
            <img src="assets/images/logo.svg" alt="Logo" />
          </Box>

          {/* Title */}
          <Typography variant="h5" sx={h2}>
            <Box component="span" sx={spainColor}>
              Getting Started
            </Box>
          </Typography>

          {/* Signup Form */}
          <Box component="form" sx={{ display: "grid", gap: 2, mb: 4 }}>
            {error && (
              <Typography sx={{ color: "red", fontSize: "14px", mb: 2, textAlign: "center" }}>
                {error}
              </Typography>
            )}

            {/* Name group */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 2 }}>
              {/* First Name field */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}>
                  First Name
                </Typography>
                <TextField
                  fullWidth
                  placeholder="First Name"
                  variant="outlined"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Box>

              {/* Last Name field */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}>
                  Last Name
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Last Name"
                  variant="outlined"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Box>
            </Box>

            {/* Email */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}>
                Email
              </Typography>
              <TextField
                fullWidth
                placeholder="Email"
                variant="outlined"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Box>

            {/* Password */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}>
                Password
              </Typography>
              <TextField
                fullWidth
                placeholder="Password"
                type="password"
                variant="outlined"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Box>

            {/* Confirm Password */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}>
                Confirm Password
              </Typography>
              <TextField
                fullWidth
                placeholder="Confirm Password"
                type="password"
                variant="outlined"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </Box>

            {/* Signup button */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#5C60EF",
                textTransform: "none",
                py: 1.5,
                borderRadius: "30px",
                fontWeight: 600,
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": { backgroundColor: "#4B51CC" },
              }}
              endIcon={
                <Box
                  sx={{
                    backgroundColor: "#D6232A",
                    borderRadius: "50%",
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ml: 1,
                  }}
                >
                  <ArrowForwardIcon sx={{ fontSize: 16, color: "#fff" }} />
                </Box>
              }
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Signing up..." : "Signup"}
            </Button>
          </Box>

          {/* Footer Link */}
          <Typography sx={{ textAlign: "center", color: "#555" }}>
            Already have an account?{" "}
            <Link href="/login" sx={{ color: "#D6232A", fontWeight: 600 }}>
              Sign in
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
