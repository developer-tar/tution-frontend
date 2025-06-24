
import React from 'react';
import {
  Box,
  Breadcrumbs,
  Link,
  Typography,
  Chip,
  Grid,
  Button,
  Container
} from '@mui/material';

import { containerStyles, h2 } from '../style';


export default function CourseHeader({ data }) {
  return (
    <Box
      component="section"
      sx={{
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 3, sm: 5, md: 7 },
        backgroundImage: `url("/assets/images/page-header-bg.png")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container sx={containerStyles}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <img src="assets/images/home-vector.png" alt="" />
          <Link underline="hover" color="inherit" href="#">Courses</Link>
          <Typography color="text.primary">{data.name}</Typography>
        </Breadcrumbs>

        <Chip
          label={data.name}
          sx={{
            mt: 2,
            bgcolor: '#E3E8FF',
            color: '#1A237E',
            fontWeight: 'bold',
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}
        />

        <Typography variant="h4" sx={h2}>{data.name}</Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>School Year</Typography>
            <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>{data.academicyear}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Course Length</Typography>
            <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>{data.start_end_date} ({data.weeks_count} weeks)</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Location</Typography>
            <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>{data.locations.join(', ')}</Typography>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" sx={{ borderRadius: '999px', textTransform: 'none', px: { xs: 2, sm: 3 }, py: { xs: 0.5, sm: 1 }, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Current Year ({data.academicyear})
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
