import React from "react";
import { Box, Button, Container, Grid, TextField, Typography } from "@mui/material";
import { containerStyles } from "./style";
import PageHeader from "./PageHeader";
import BillingDetails from "./Checkout/BillingDetails";
import AdditionalInfo from "./Checkout/AdditionalInfo";
import OrderSummary from "./Checkout/OrderSummary";
import PaymentSection from "./Checkout/PaymentSection";

export default function CheckoutPage() {

    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Courses", path: "/course-list" },
        { label: " Year 3 Weekly 24", path: "/" },
        { label: "Year 3: EALING 2024 - 2025", path: "/" },
    ];

  return (
    <>
      <PageHeader
                title="Checkout"
                // subtitle="Find the perfect course for your child"
                breadcrumbs={breadcrumbs}
            />
    <Box sx={{ py: 8, px: { xs: 2, md: 6 },  }}>
        <Container sx={containerStyles} >
      <Typography
        sx={{
          color: "#000000",
          fontSize: "14px",
          mb: 4,
          textAlign: "left",
        }}
      >
        <b>Please Note : </b> if you are signing up for weekly tuition (not intensive courses), an Examberry team member will call you after registration to set up direct debit details.
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <BillingDetails />
          <AdditionalInfo />
        </Grid>

        <Grid item xs={12} md={4}>
          <OrderSummary />
          <PaymentSection />
        </Grid>
      </Grid>
      </Container>
    </Box>
    </>
  );
}
