import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import api from '../../api';
import PageHeader from '../PageHeader';
import { containerStyles } from '../style';
import CommonSkeleton from '../../components/CommonSkeleton';

const MyPaperPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "My Purchases", path: "/student/paper/purchases" },
  ];

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoading(true);
        const response = await api.get('/student/paper/my-purchases');
        
        if (response.data.success) {
          setPurchases(response.data.data || []);
        } else {
          throw new Error(response.data.message || 'Failed to fetch purchases');
        }
      } catch (err) {
        console.error('Error fetching purchases:', err);
        setError(err.response?.data?.message || 'Failed to load purchases');
        setSnackbar({
          open: true,
          message: err.response?.data?.message || 'Failed to load purchases',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <>
        <PageHeader title="My Paper Purchases" breadcrumbs={breadcrumbs} />
        <Box sx={{ py: 8 }}>
          <Container sx={containerStyles}>
            <CommonSkeleton type="table" rows={5} cols={8} />
          </Container>
        </Box>
      </>
    );
  }

  return (
    <>
      <PageHeader title="My Paper Purchases" subtitle="Detailed view of all your paper purchases" breadcrumbs={breadcrumbs} />
      <Box sx={{ py: 8 }}>
        <Container sx={containerStyles}>
          {error && purchases.length === 0 ? (
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            </Card>
          ) : purchases.length === 0 ? (
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                No purchases found
              </Typography>
            </Card>
          ) : (
            <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#F9F9FF" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>Paper Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Format</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Duration</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Marks</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Score</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Purchased By</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Student</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {purchases.map((purchase) => {
                    const statusInfo = getStatusLabel(purchase.status);
                    return (
                      <TableRow key={purchase.purchase_id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {purchase.image && (
                              <img
                                src={purchase.image}
                                alt={purchase.paper_name}
                                style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                              />
                            )}
                            <Typography sx={{ fontWeight: 500 }}>
                              {purchase.paper_name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{purchase.category || '—'}</TableCell>
                        <TableCell>{purchase.format || '—'}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTimeIcon sx={{ fontSize: 16, color: '#666' }} />
                            <Typography>{purchase.duration_minutes} min</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AssessmentIcon sx={{ fontSize: 16, color: '#666' }} />
                            <Typography>{purchase.total_marks}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {purchase.score !== null && purchase.score !== undefined ? (
                            <Typography sx={{ fontWeight: 600, color: purchase.score >= 70 ? 'success.main' : purchase.score >= 50 ? 'warning.main' : 'error.main' }}>
                              {purchase.score.toFixed(1)}
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
                          <Chip
                            label={purchase.purchased_by === 'parent' ? 'Parent' : 'Student'}
                            size="small"
                            color={purchase.purchased_by === 'parent' ? 'primary' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          {purchase.student_name ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <PersonIcon sx={{ fontSize: 16, color: '#666' }} />
                              <Typography variant="body2">
                                {purchase.student_name}
                                {purchase.student_email && (
                                  <Typography variant="caption" display="block" color="text.secondary">
                                    {purchase.student_email}
                                  </Typography>
                                )}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography color="text.secondary">—</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(purchase.purchased_at).toLocaleDateString()}
                          </Typography>
                          {purchase.started_at && (
                            <Typography variant="caption" display="block" color="text.secondary">
                              Started: {new Date(purchase.started_at).toLocaleDateString()}
                            </Typography>
                          )}
                          {purchase.completed_at && (
                            <Typography variant="caption" display="block" color="text.secondary">
                              Completed: {new Date(purchase.completed_at).toLocaleDateString()}
                            </Typography>
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

export default MyPaperPurchases;







