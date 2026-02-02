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
  TextField,
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
  const [fetchError, setFetchError] = useState(null);
  const timerRef = useRef(null);

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "My Papers", path: "/student/my-papers" },
    { label: "Take Exam", path: "#" },
  ];

  useEffect(() => {
    const fetchPaperData = async () => {
      if (!purchaseId) return;
      setFetchError(null);
      try {
        setLoading(true);
        const response = await api.get(`/student/paper/${purchaseId}/questions`);
        if (response.data?.success && response.data?.data) {
          const { duration_minutes, total_marks, questions: qList } = response.data.data;
          const duration = duration_minutes ?? 120;
          setTimeRemaining(duration * 60);
          setPaperData({ duration_minutes: duration, total_marks: total_marks ?? 0 });
          setQuestions(Array.isArray(qList) ? qList : []);
        } else {
          setQuestions([]);
          setTimeRemaining(120 * 60);
          setPaperData({ duration_minutes: 120 });
        }
      } catch (err) {
        console.error('Error fetching paper questions:', err);
        const msg = err.response?.data?.message || 'Failed to load exam questions.';
        setFetchError(msg);
        setSnackbar({ open: true, message: msg, severity: 'error' });
        setQuestions([]);
        setTimeRemaining(120 * 60);
        setPaperData({ duration_minutes: 120 });
      } finally {
        setLoading(false);
      }
    };

    fetchPaperData();
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
    const unansweredQuestions = questions.filter((q) => !isQuestionAnswered(q));

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
      const answersArray = questions.map((q) => {
        const val = answers[q.id];
        const qt = (q.question_type || '').toLowerCase();
        const isTextType = ['short_answer', 'essay', 'short answer', 'text'].some((t) => qt.includes(t));
        const payload = { question_id: parseInt(q.id, 10) };
        if (isTextType) {
          payload.answer_text = typeof val === 'string' ? val : '';
        } else {
          payload.option_id = typeof val === 'string' && val.includes('_o') ? val : parseInt(val, 10);
        }
        return payload;
      });

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

  const isQuestionAnswered = (q) => {
    const val = answers[q.id];
    const qt = (q.question_type || '').toLowerCase();
    const isTextType = ['short_answer', 'essay', 'short answer', 'text'].some((t) => qt.includes(t));
    if (isTextType) return val != null && typeof val === 'string' && val.trim().length > 0;
    return val != null && val !== '';
  };
  const answeredCount = questions.filter(isQuestionAnswered).length;

  const isMultipleChoice = (q) => {
    const qt = (q.question_type || '').toLowerCase();
    if (['short_answer', 'essay', 'short answer', 'text'].some((t) => qt.includes(t))) return false;
    return true;
  };

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

  if (fetchError) {
    return (
      <>
        <PageHeader title="Could not load exam" breadcrumbs={breadcrumbs} />
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            {fetchError}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/student/my-papers')}>
            Back to My Papers
          </Button>
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

              {currentQuestion && isMultipleChoice(currentQuestion) ? (
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend">Select your answer:</FormLabel>
                  <RadioGroup
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  >
                    {(currentQuestion.options || []).map((option) => (
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
              ) : currentQuestion ? (
                <Box>
                  <FormLabel component="legend" sx={{ display: 'block', mb: 1 }}>
                    {((currentQuestion.question_type || '').toLowerCase().includes('essay') ? 'Write your answer:' : 'Your answer:')}
                  </FormLabel>
                  <TextField
                    fullWidth
                    multiline={(currentQuestion.question_type || '').toLowerCase().includes('essay')}
                    minRows={(currentQuestion.question_type || '').toLowerCase().includes('essay') ? 6 : 1}
                    maxRows={(currentQuestion.question_type || '').toLowerCase().includes('essay') ? 20 : 4}
                    placeholder={(currentQuestion.question_type || '').toLowerCase().includes('essay') ? 'Type your essay here...' : 'Type your answer here...'}
                    value={answers[currentQuestion.id] ?? ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    variant="outlined"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              ) : null}
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

