import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Grid, Typography } from '@mui/material';
import CourseHeader from './Courses/CourseHeader';
import CourseContent from './Courses/CourseContent';
import CourseSidebar from './Courses/CourseSidebar';
import ExamTypes from './Courses/ExamTypes';
import CourseBenefitsSection from './Courses/CourseBenefitsSection';
import Year3FormatsSection from './Courses/Year3FormatsSection';
import PricingPlansSection from './Courses/PricingPlansSection';
import CourseListSection from './Courses/CourseListSection';
import { containerStyles } from './style';
import api from "../api";
import LoadingProgress from '../components/LoadingProgress';
// import CommonSkeleton from '../components/CommonSkeleton'; 

// function for course 

const Course = () => {
  const { slug } = useParams();
  const [courseData, setCourseData] = useState(null);
  // const [loading, setLoading] = useState(true); // Commented out - using global loading now
  const [apiLoading, setApiLoading] = useState(true); // For API calls only
  const [filters, setFilters] = useState(null);

  useEffect(() => {
    setApiLoading(true); // Reset loading state when slug changes
    
    const fetchCourse = async () => {
      const startTime = Date.now();
      
      try {
        const res = await api.get(`${slug}`); 
        console.log('resdta',res.data);
        if (res.data.success && res.data.data.length > 0) {
          setCourseData(res.data.data[0]);
        } else {
          setCourseData(null);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        setCourseData(null);
      } finally {
        setApiLoading(false); // API call finished
        // Commented out individual loading - now handled globally
        // const elapsedTime = Date.now() - startTime;
        // const minLoadingTime = 2000; // 2 seconds
        // 
        // if (elapsedTime < minLoadingTime) {
        //   setTimeout(() => {
        //     setLoading(false);
        //   }, minLoadingTime - elapsedTime);
        // } else {
        //   setLoading(false);
        // }
      }
    };

    fetchCourse();
  }, [slug]);

  // Commented out individual loading - now handled globally in App.js
  // if (loading) {
  //   return (
  //     <Box sx={{ width: '100%', minHeight: '100vh' }}>
  //       <LoadingProgress 
  //         message="Loading course details..."
  //         subMessage="Please wait while we fetch the course information"
  //         height={4}
  //         color="blue"
  //         sx={{ py: 10 }}
  //       />
  //     </Box>
  //   );
  // }

  // Show skeleton content while API loads, then show "not found" if no data
  if (apiLoading) {
    return (
      <Box sx={{ backgroundColor: '#ffffff', pb: 10 }}>
        {/* Skeleton Header */}
        <Box sx={{ 
          height: '200px', 
          bgcolor: '#f5f5f5', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            Loading course...
          </Typography>
        </Box>
        
        {/* Skeleton Content */}
        <Container sx={containerStyles}>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={8}>
              <Box sx={{ height: '300px', bgcolor: '#f9f9f9', borderRadius: 2 }}></Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ height: '200px', bgcolor: '#f9f9f9', borderRadius: 2 }}></Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (!courseData) {
    return (
      <Box sx={{ py: 10, textAlign: 'center', minHeight: '60vh' }}>
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

      <PricingPlansSection data={courseData} filters={filters} />
      <Year3FormatsSection data={courseData} />
      <CourseListSection data={courseData} onFiltersChange={setFilters} />
      <ExamTypes />
      <CourseBenefitsSection />
    </Box>
  );
};

export default Course;
