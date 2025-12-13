import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import PageHeader from '../PageHeader';
import { containerStyles } from '../style';
import CommonSkeleton from '../../components/CommonSkeleton';

const MyPapers = () => {
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "My Papers", path: "/student/my-papers" },
  ];

  useEffect(() => {
    const fetchMyPapers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/student/my-papers');
        
        if (response.data.success) {
          setPapers(response.data.data || []);
        } else {
          throw new Error(response.data.message || 'Failed to fetch papers');
        }
      } catch (err) {
        console.error('Error fetching my papers:', err);
        setError(err.response?.data?.message || 'Failed to load your papers');
        setSnackbar({
          open: true,
          message: err.response?.data?.message || 'Failed to load your papers',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMyPapers();
  }, []);

  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return { label: 'Not Started', color: 'default' };
      case 1:
        return { label: 'In Progress', color: 'warning' };
      case 2:
        return { label: 'Completed', color: 'success' };
      default:
        return { label: 'Unknown', color: 'default' };
    }
  };

  const handleStartPaper = async (paperId) => {
    try {
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
    }
  };

  const handleContinuePaper = (purchaseId) => {
    navigate(`/student/paper/${purchaseId}/take`);
  };

  const handleViewResults = (purchaseId) => {
    navigate(`/student/paper/${purchaseId}/results`);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <>
        <PageHeader title="My Papers" breadcrumbs={breadcrumbs} />
        <Box sx={{ py: 8 }}>
          <Container sx={containerStyles}>
            <CommonSkeleton type="table" rows={5} cols={6} />
          </Container>
        </Box>
      </>
    );
  }

  return (
    <>
      <PageHeader title="My Papers" subtitle="View and manage your purchased papers" breadcrumbs={breadcrumbs} />
      <Box sx={{ py: 8 }}>
        <Container sx={containerStyles}>
          {error && papers.length === 0 ? (
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
              <Button variant="contained" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </Card>
          ) : papers.length === 0 ? (
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                No papers purchased yet
              </Typography>
              <Button variant="contained" onClick={() => navigate('/papers')}>
                Browse Papers
              </Button>
            </Card>
          ) : (
            <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#F9F9FF" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>Paper Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Duration</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Total Marks</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Score</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Purchased</TableCell>
                    <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {papers.map((paper) => {
                    const statusInfo = getStatusLabel(paper.status);
                    return (
                      <TableRow key={paper.purchase_id}>
                        <TableCell>
                          <Typography sx={{ fontWeight: 500 }}>
                            {paper.paper_name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTimeIcon sx={{ fontSize: 16, color: '#666' }} />
                            <Typography>{paper.duration_minutes} min</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AssessmentIcon sx={{ fontSize: 16, color: '#666' }} />
                            <Typography>{paper.total_marks}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {paper.score !== null && paper.score !== undefined ? (
                            <Typography sx={{ fontWeight: 600, color: paper.score >= 70 ? 'success.main' : paper.score >= 50 ? 'warning.main' : 'error.main' }}>
                              {paper.score.toFixed(1)}
                            </Typography>
                          ) : (
                            <Typography color="text.secondary">—</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={statusInfo.label}
                            color={statusInfo.color}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(paper.purchased_at).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {paper.status === 0 && (
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<PlayArrowIcon />}
                              onClick={() => handleStartPaper(paper.paper_id)}
                              sx={{ textTransform: 'none', borderRadius: '20px' }}
                            >
                              Start Exam
                            </Button>
                          )}
                          {paper.status === 1 && (
                            <Button
                              variant="contained"
                              size="small"
                              color="warning"
                              startIcon={<PlayArrowIcon />}
                              onClick={() => handleContinuePaper(paper.purchase_id)}
                              sx={{ textTransform: 'none', borderRadius: '20px' }}
                            >
                              Continue
                            </Button>
                          )}
                          {paper.status === 2 && (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<CheckCircleIcon />}
                              onClick={() => handleViewResults(paper.purchase_id)}
                              sx={{ textTransform: 'none', borderRadius: '20px' }}
                            >
                              View Results
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
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

export default MyPapers;







