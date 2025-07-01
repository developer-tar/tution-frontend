import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Grid, Typography } from '@mui/material';
import CourseHeader from './Courses/CourseHeader';
import CourseContent from './Courses/CourseContent';
import CourseSidebar from './Courses/CourseSidebar';
import ExamTypes from './Courses/ExamTypes';
import CourseBenefitsSection from './Courses/CourseBenefitsSection';
import Year3FormatsSection from './Courses/Year3FormatsSection';
import { containerStyles } from './style';
import api from "../api";
import CommonSkeleton from '../components/CommonSkeleton'; 

const Course = () => {
  const { slug } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`${slug}`); 
        if (res.data.success && res.data.data.length > 0) {
          setCourseData(res.data.data[0]);
        } else {
          setCourseData(null);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        setCourseData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  if (loading) {
    return (
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <CommonSkeleton type="card" rows={3} height={50} />
        <Typography variant="body1" sx={{ mt: 3 }}>
          Loading course details...
        </Typography>
      </Box>
    );
  }

  if (!courseData) {
    return (
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h6">Course not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#ffffff', pb: 10 }}>
      <CourseHeader data={courseData} />

      <Container sx={containerStyles}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <CourseContent data={courseData} />
          </Grid>
          <Grid item xs={12} md={4}>
            <CourseSidebar data={courseData} />
          </Grid>
        </Grid>
      </Container>

      <ExamTypes />
      <CourseBenefitsSection />
      <Year3FormatsSection data={courseData} />
    </Box>
  );
};

export default Course;
