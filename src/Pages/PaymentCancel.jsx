import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link, useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={10}>
          <Card 
            sx={{ 
              textAlign: 'center', 
              p: 3,
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)'
            }}
          >
            <CardContent>
              {/* Cancel Icon */}
              <Box sx={{ mb: 2 }}>
                <CancelIcon 
                  sx={{ 
                    fontSize: 60, 
                    color: '#f44336',
                    filter: 'drop-shadow(0 4px 8px rgba(244,67,54,0.3))'
                  }} 
                />
              </Box>

              {/* Oops Message */}
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#d32f2f',
                  mb: 1,
                  fontSize: { xs: '1.5rem', md: '2rem' }
                }}
              >
                Oops!
              </Typography>

              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#666', 
                  mb: 2,
                  fontSize: { xs: '1rem', md: '1.25rem' }
                }}
              >
                Payment Cancelled
              </Typography>

              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#555', 
                  mb: 2,
                  fontSize: { xs: '0.85rem', md: '0.95rem' },
                  lineHeight: 1.5
                }}
              >
                😔 Your payment was cancelled or interrupted. Don't worry, 
                no charges have been made to your account.
              </Typography>

              {/* Helpful Message */}
              <Box sx={{ mb: 3, p: 2, bgcolor: '#fff3e0', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: '#e65100', fontWeight: 500, fontSize: '0.8rem' }}>
                  💡 <strong>What happened?</strong> The payment process was cancelled. 
                  Your cart items are still saved and you can try again anytime.
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="medium"
                  startIcon={<ArrowBackIcon />}
                  onClick={handleGoBack}
                  sx={{
                    background: 'linear-gradient(90deg, #4450A5 0%, #EF2A1E 100%)',
                    color: 'white',
                    fontWeight: 600,
                    borderRadius: '20px',
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    boxShadow: '0 4px 15px rgba(68,80,165,0.3)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(68,80,165,0.4)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Go Back
                </Button>

                <Button
                  variant="outlined"
                  size="medium"
                  component={Link}
                  to="/basket"
                  startIcon={<ShoppingCartIcon />}
                  sx={{
                    borderColor: '#ff9800',
                    color: '#ff9800',
                    fontWeight: 600,
                    borderRadius: '20px',
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    '&:hover': {
                      borderColor: '#f57c00',
                      color: '#f57c00',
                      transform: 'translateY(-2px)',
                      backgroundColor: 'rgba(255,152,0,0.04)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  View Cart
                </Button>

                <Button
                  variant="text"
                  size="medium"
                  component={Link}
                  to="/"
                  sx={{
                    color: '#666',
                    fontWeight: 600,
                    borderRadius: '20px',
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    '&:hover': {
                      color: '#4450A5',
                      backgroundColor: 'rgba(68,80,165,0.04)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Home
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PaymentCancel;
