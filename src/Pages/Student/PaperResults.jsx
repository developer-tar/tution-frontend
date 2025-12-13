import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  LinearProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HomeIcon from '@mui/icons-material/Home';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../api';
import PageHeader from '../PageHeader';
import { containerStyles } from '../style';

const PaperResults = () => {
  const { purchaseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [results, setResults] = useState(location.state?.results || null);
  const [loading, setLoading] = useState(!results);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "My Papers", path: "/student/my-papers" },
    { label: "Results", path: "#" },
  ];

  useEffect(() => {
    // If results weren't passed via navigation state, fetch them
    if (!results && purchaseId) {
      const fetchResults = async () => {
        try {
          setLoading(true);
          // Note: This assumes an endpoint exists to fetch results
          // You may need to adjust this based on actual API structure
          // const response = await api.get(`/student/paper/${purchaseId}/results`);
          // setResults(response.data.data);
        } catch (err) {
          console.error('Error fetching results:', err);
          setSnackbar({
            open: true,
            message: 'Failed to load results',
            severity: 'error'
          });
        } finally {
          setLoading(false);
        }
      };

      fetchResults();
    }
  }, [purchaseId, results]);

  const getScoreColor = (percentage) => {
    if (percentage >= 70) return 'success.main';
    if (percentage >= 50) return 'warning.main';
    return 'error.main';
  };

  const getScoreLabel = (percentage) => {
    if (percentage >= 70) return 'Excellent';
    if (percentage >= 50) return 'Good';
    return 'Needs Improvement';
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <>
        <PageHeader title="Loading Results..." breadcrumbs={breadcrumbs} />
        <Box sx={{ py: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (!results) {
    return (
      <>
        <PageHeader title="Results Not Available" breadcrumbs={breadcrumbs} />
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            Results not found
          </Typography>
          <Button variant="contained" onClick={() => navigate('/student/my-papers')}>
            Back to My Papers
          </Button>
        </Box>
      </>
    );
  }

  const percentage = results.percentage || (results.score && results.total_marks ? (results.score / results.total_marks) * 100 : 0);

  return (
    <>
      <PageHeader title="Exam Results" breadcrumbs={breadcrumbs} />
      <Box sx={{ py: 8 }}>
        <Container sx={containerStyles}>
          <Grid container spacing={3}>
            {/* Results Summary Card */}
            <Grid item xs={12}>
              <Card sx={{ p: 4, textAlign: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                <CardContent>
                  <CheckCircleIcon sx={{ fontSize: 80, color: getScoreColor(percentage), mb: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {getScoreLabel(percentage)}
                  </Typography>
                  <Typography variant="h2" sx={{ fontWeight: 700, color: getScoreColor(percentage), mb: 2 }}>
                    {percentage.toFixed(1)}%
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 3 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Score
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {results.score?.toFixed(1) || 'N/A'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total Marks
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {results.total_marks || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Detailed Results */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssessmentIcon />
                    Performance Breakdown
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Overall Score</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {results.score?.toFixed(1)} / {results.total_marks}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getScoreColor(percentage),
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    You scored {results.score?.toFixed(1)} out of {results.total_marks} total marks.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Next Steps */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Next Steps
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {percentage >= 70
                      ? "Great job! You've performed excellently. Continue practicing to maintain your high standards."
                      : percentage >= 50
                      ? "Good effort! Review the areas where you struggled and practice more to improve your score."
                      : "Don't worry! Use this as a learning opportunity. Review the questions and focus on areas that need improvement."}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/student/my-papers')}
                      sx={{ textTransform: 'none', borderRadius: '20px' }}
                    >
                      View My Papers
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<HomeIcon />}
                      onClick={() => navigate('/papers')}
                      sx={{ textTransform: 'none', borderRadius: '20px' }}
                    >
                      Browse More Papers
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
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

export default PaperResults;







