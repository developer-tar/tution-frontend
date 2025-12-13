import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  CircularProgress,
  Snackbar,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import PageHeader from '../PageHeader';
import { containerStyles } from '../style';

const TakePaper = () => {
  const { purchaseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [paperData, setPaperData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const timerRef = useRef(null);

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "My Papers", path: "/student/my-papers" },
    { label: "Take Exam", path: "#" },
  ];

  useEffect(() => {
    // Fetch paper questions and data
    // Note: API endpoint to fetch questions is not specified in API docs
    // This may need to be: GET /api/student/paper/{purchaseId}/questions
    // Or questions may be included in purchase data
    const fetchPaperData = async () => {
      try {
        setLoading(true);
        
        // Try to fetch purchase data first to get paper info
        try {
          const purchaseResponse = await api.get(`/student/paper/my-purchases`);
          const purchase = purchaseResponse.data?.data?.find(p => p.purchase_id === parseInt(purchaseId));
          
          if (purchase) {
            // Set duration from purchase data
            const duration = purchase.duration_minutes || 120;
            setTimeRemaining(duration * 60);
            setPaperData({ duration_minutes: duration });
            
            // TODO: Fetch questions - endpoint not specified in API docs
            // Possible endpoints:
            // - GET /api/student/paper/{purchaseId}/questions
            // - GET /api/paper/{paperId}/questions
            // - Questions may be in purchase data
            // For now, set empty questions array - will need backend endpoint
            setQuestions([]);
          } else {
            throw new Error('Purchase not found');
          }
        } catch (err) {
          // Fallback: Set default values
          setTimeRemaining(120 * 60);
          setPaperData({ duration_minutes: 120 });
          setQuestions([]);
        }
      } catch (err) {
        console.error('Error fetching paper data:', err);
        setSnackbar({
          open: true,
          message: 'Failed to load exam questions',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    if (purchaseId) {
      fetchPaperData();
    }
  }, [purchaseId]);

  useEffect(() => {
    // Timer countdown
    if (timeRemaining > 0 && !loading) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeRemaining, loading]);

  const handleTimeUp = () => {
    setSnackbar({
      open: true,
      message: 'Time is up! Submitting your exam...',
      severity: 'warning'
    });
    setTimeout(() => {
      handleSubmit();
    }, 2000);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate all questions are answered
    const unansweredQuestions = questions.filter(
      (q) => !answers[q.id]
    );

    if (unansweredQuestions.length > 0) {
      setSnackbar({
        open: true,
        message: `Please answer all questions. ${unansweredQuestions.length} question(s) remaining.`,
        severity: 'warning'
      });
      return;
    }

    setSubmitting(true);
    try {
      const answersArray = Object.entries(answers).map(([question_id, option_id]) => ({
        question_id: parseInt(question_id),
        option_id: parseInt(option_id),
      }));

      const response = await api.post(`/student/paper/${purchaseId}/submit`, {
        answers: answersArray,
      });

      if (response.data.success) {
        // Navigate to results page
        navigate(`/student/paper/${purchaseId}/results`, {
          state: { results: response.data.data },
        });
      } else {
        throw new Error(response.data.message || 'Failed to submit paper');
      }
    } catch (err) {
      console.error('Error submitting paper:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to submit paper',
        severity: 'error'
      });
      setSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const answeredCount = Object.keys(answers).length;

  if (loading) {
    return (
      <>
        <PageHeader title="Loading Exam..." breadcrumbs={breadcrumbs} />
        <Box sx={{ py: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (questions.length === 0) {
    return (
      <>
        <PageHeader title="No Questions Available" breadcrumbs={breadcrumbs} />
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            No questions found for this paper
          </Typography>
          <Button variant="contained" onClick={() => navigate('/student/my-papers')}>
            Back to My Papers
          </Button>
        </Box>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Take Exam" breadcrumbs={breadcrumbs} />
      <Box sx={{ py: 4 }}>
        <Container sx={containerStyles}>
          {/* Timer and Progress Bar */}
          <Card sx={{ mb: 3, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon color={timeRemaining < 300 ? 'error' : 'primary'} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: timeRemaining < 300 ? 'error.main' : 'inherit' }}>
                  {formatTime(timeRemaining)}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {answeredCount} of {questions.length} answered
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </Typography>
          </Card>

          {/* Question Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                {currentQuestion?.question_text || `Question ${currentQuestionIndex + 1}`}
              </Typography>

              <FormControl component="fieldset">
                <FormLabel component="legend">Select your answer:</FormLabel>
                <RadioGroup
                  value={answers[currentQuestion?.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion?.id, e.target.value)}
                >
                  {currentQuestion?.options?.map((option) => (
                    <FormControlLabel
                      key={option.id}
                      value={option.id}
                      control={<Radio />}
                      label={option.option_text}
                      sx={{
                        mb: 1,
                        p: 1,
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              sx={{ textTransform: 'none', borderRadius: '20px' }}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              onClick={handleNext}
              disabled={currentQuestionIndex === questions.length - 1}
              sx={{ textTransform: 'none', borderRadius: '20px' }}
            >
              Next
            </Button>
          </Box>

          {/* Submit Button */}
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => setShowSubmitDialog(true)}
              disabled={submitting || answeredCount < questions.length}
              sx={{ textTransform: 'none', borderRadius: '20px', px: 4, py: 1.5 }}
            >
              {submitting ? 'Submitting...' : 'Submit Exam'}
            </Button>
            {answeredCount < questions.length && (
              <Typography variant="caption" color="warning.main" display="block" sx={{ mt: 1 }}>
                Please answer all {questions.length} questions before submitting
              </Typography>
            )}
          </Box>
        </Container>
      </Box>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onClose={() => setShowSubmitDialog(false)}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit your exam? You have answered {answeredCount} out of {questions.length} questions.
            {answeredCount < questions.length && (
              <Typography component="span" color="warning.main" display="block" sx={{ mt: 1 }}>
                You have {questions.length - answeredCount} unanswered question(s).
              </Typography>
            )}
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSubmitDialog(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ textTransform: 'none' }}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

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

export default TakePaper;

