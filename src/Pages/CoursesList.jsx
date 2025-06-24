
import React from 'react'
import PageHeader from './PageHeader';
import CourseTable from './Courses List/CourseTable';
import LearnSection from './Courses List/LearnSection';
import TargetedSchools from './Courses List/TargetedSchools';
import RegisterInterest from './Courses List/RegisterInterest';

const CoursesList = () => {
      const breadcrumbs = [
    { label: "Courses", path: "/course-view" },
  ];


  return (
  <>
    <PageHeader 
          title="Term-Time 11+ Courses" 
          subtitle="Find the perfect course for your child"
          breadcrumbs={breadcrumbs}
        />
        <CourseTable />
        <LearnSection />
        <TargetedSchools />
        <RegisterInterest />
  </>
  )
}

export default CoursesList