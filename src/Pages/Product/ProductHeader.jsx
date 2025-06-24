import React from "react";
import { Box, Typography, Breadcrumbs, Link, Container } from "@mui/material";
import { containerStyles } from "./style";

const PageHeader = ({ title, subtitle, breadcrumbs }) => {
  return (
    <Box
      sx={{
        py: 6,
        px: 3,
          backgroundImage: `url("/assets/images/page-header-bg.png")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        mb: 4,
      }}
    >
          <Container sx={containerStyles}>
      <Breadcrumbs  aria-label="breadcrumb" sx={{ mb: 2 }}>
        {breadcrumbs.map((item, index) => (
          <Link 
            key={index} 
            href={item.path} 
            underline="hover" 
            color={index === breadcrumbs.length - 1 ? "text.primary" : "inherit"}
          >
            {item.label}
          </Link>
        ))}
      </Breadcrumbs>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 1,
          color: "#3c3c3c",
        }}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography sx={{ color: "#555", fontSize: 16 }}>
          {subtitle}
        </Typography>
      )}
      </Container>
    </Box>
  );
};

export default PageHeader;
