

import React from 'react';
import { Box, Typography, Button, Container, LinearProgress } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { button, containerStyles, icon } from '../style';

// content

export default function CourseContent({ data }) {
  if (!data) {
    return (
      <Box sx={{ py: 4 }}>
        <Container sx={containerStyles}>
          <Typography variant="h6">Course content unavailable</Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Course details are not available at the moment. Please try again later.
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container sx={containerStyles}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: { xs: '1.25rem', sm: '1.5rem' }, mb: 2 }}>
          About Course
        </Typography>

        <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
          {data.description || 'Course description not available.'}
        </Typography>

        {data.features && data.features.length > 0 && (
          <Box component="ul" sx={{ listStyleType: 'disc', pl: 2, mb: 4, '& li': { mb: 1.5, fontSize: { xs: '0.875rem', sm: '1rem' }, lineHeight: 1.6 } }}>
            {data.features.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </Box>
        )}

        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.125rem' }, mb: 1.5 }}>
          Subjects Covered:
        </Typography>

        <Typography sx={{ mb: 4, fontSize: { xs: '0.875rem', sm: '1rem' }, color: 'text.primary' }}>
          {data.subjects && data.subjects.length > 0 ? data.subjects.join(', ') : 'No subjects specified'}
        </Typography>

        {data.modes && data.modes.length > 0 && (
          <>
            <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.125rem' }, mb: 1.5 }}>
              Available Modes:
            </Typography>
            <Typography sx={{ mb: 4, fontSize: { xs: '0.875rem', sm: '1rem' }, color: 'text.primary' }}>
              {data.modes.join(', ')}
            </Typography>
          </>
        )}

        <Button disableElevation sx={button}>
          View full schools list
          <Box sx={icon}>
            <ArrowForwardIcon sx={{ fontSize: 20, color: '#EF2A1E' }} />
          </Box>
        </Button>
      </Container>
    </Box>
  );
}
