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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const RegistrationSuccess = () => {
  const location = useLocation();
  const registrationData = location.state?.registrationData || null;

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
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            }}
          >
            <CardContent>
              {/* Success Icon */}
              <Box sx={{ mb: 2 }}>
                <CheckCircleIcon 
                  sx={{ 
                    fontSize: 60, 
                    color: '#4caf50',
                    filter: 'drop-shadow(0 4px 8px rgba(76,175,80,0.3))'
                  }} 
                />
              </Box>

              {/* Success Message */}
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#2e7d32',
                  mb: 1,
                  fontSize: { xs: '1.5rem', md: '2rem' }
                }}
              >
                Registration Successful!
              </Typography>

              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#666', 
                  mb: 3,
                  fontSize: { xs: '0.9rem', md: '1rem' }
                }}
              >
                🎉 Congratulations! Your registration has been completed successfully.
              </Typography>

              {/* Email Verification Section */}
              <Box 
                sx={{ 
                  mb: 3, 
                  p: 2, 
                  bgcolor: '#e3f2fd', 
                  borderRadius: 2,
                  border: '1px solid #90caf9'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                  <EmailIcon sx={{ color: '#1976d2', mr: 1 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#1976d2',
                      fontSize: { xs: '1rem', md: '1.25rem' }
                    }}
                  >
                    Verification Email Sent
                  </Typography>
                </Box>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#555', 
                    mb: 1,
                    fontSize: { xs: '0.85rem', md: '0.95rem' }
                  }}
                >
                  We've sent verification emails to:
                </Typography>
                
                {registrationData?.parent?.email && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#1976d2',
                      fontWeight: 500,
                      mb: 0.5,
                      fontSize: { xs: '0.85rem', md: '0.95rem' }
                    }}
                  >
                    📧 Parent: {registrationData.parent.email}
                  </Typography>
                )}
                
                {registrationData?.student?.email && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#1976d2',
                      fontWeight: 500,
                      mb: 1,
                      fontSize: { xs: '0.85rem', md: '0.95rem' }
                    }}
                  >
                    📧 Student: {registrationData.student.email}
                  </Typography>
                )}

                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#555', 
                    mt: 2,
                    fontSize: { xs: '0.85rem', md: '0.95rem' }
                  }}
                >
                  Please check your email inbox and click the verification link to activate your account.
                </Typography>
              </Box>

              {/* Next Steps Section */}
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#1976d2',
                    mb: 1,
                    fontSize: { xs: '1rem', md: '1.25rem' }
                  }}
                >
                  Next Steps
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#555', 
                    mb: 2,
                    fontSize: { xs: '0.85rem', md: '0.95rem' }
                  }}
                >
                  1. Check your email and verify your account<br/>
                  2. Login with your credentials<br/>
                  3. Complete your profile and start learning
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="medium"
                  component={Link}
                  to="/login"
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
                  Go to Login
                </Button>
                <Button
                  variant="outlined"
                  size="medium"
                  component={Link}
                  to="/"
                  sx={{
                    borderColor: '#4450A5',
                    color: '#4450A5',
                    fontWeight: 600,
                    borderRadius: '20px',
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    '&:hover': {
                      borderColor: '#EF2A1E',
                      color: '#EF2A1E',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Back to Home
                </Button>
              </Box>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RegistrationSuccess;

