import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import PageHeader from '../PageHeader';
import { containerStyles } from '../style';

const StartPaper = () => {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "My Papers", path: "/student/my-papers" },
    { label: "Start Paper", path: "#" },
  ];

  useEffect(() => {
    // Auto-start the paper when component mounts
    handleStartPaper();
  }, [paperId]);

  const handleStartPaper = async () => {
    if (!paperId) {
      setSnackbar({
        open: true,
        message: 'Paper ID is missing',
        severity: 'error'
      });
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(`/student/paper/${paperId}/start`);
      
      if (response.data.success) {
        // Navigate to take exam page
        navigate(`/student/paper/${response.data.data.purchase_id}/take`);
      } else {
        throw new Error(response.data.message || 'Failed to start paper');
      }
    } catch (err) {
      console.error('Error starting paper:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to start paper',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <>
        <PageHeader title="Starting Paper..." breadcrumbs={breadcrumbs} />
        <Box sx={{ py: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography>Preparing your exam...</Typography>
          </Box>
        </Box>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Start Paper" breadcrumbs={breadcrumbs} />
      <Box sx={{ py: 8 }}>
        <Container sx={containerStyles}>
          <Card sx={{ maxWidth: 600, mx: 'auto', p: 4 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Ready to Start?
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                Click the button below to begin your exam. Once started, the timer will begin.
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrowIcon />}
                onClick={handleStartPaper}
                sx={{ textTransform: 'none', borderRadius: '20px', px: 4, py: 1.5 }}
              >
                Start Exam
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default StartPaper;







