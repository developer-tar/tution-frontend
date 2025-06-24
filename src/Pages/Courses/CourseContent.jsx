

import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { button, containerStyles, icon } from '../style';

export default function CourseContent({ data }) {
  return (
    <Box sx={{ py: 4 }}>
      <Container sx={containerStyles}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: { xs: '1.25rem', sm: '1.5rem' }, mb: 2 }}>
          About Course
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>{data.description}</Typography>

        <Box component="ul" sx={{ listStyleType: 'disc', pl: 2, mb: 4, '& li': { mb: 1.5, fontSize: { xs: '0.875rem', sm: '1rem' }, lineHeight: 1.6 } }}>
          {data.features.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.125rem' }, mb: 1.5 }}>
          Subjects Covered:
        </Typography>

        <Typography sx={{ mb: 4, fontSize: { xs: '0.875rem', sm: '1rem' }, color: 'text.primary' }}>
          {data.subjects.join(', ')}
        </Typography>

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
