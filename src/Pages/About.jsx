import React from 'react'
import AboutUsSection from './About/AboutUsSection'
import AboutUs from './About/AboutUs'
import TeamSection from './About/TeamSection'
import LearnWithSection from './About/LearnWithSection'
import AboutTestimonial from './About/AboutTestimonial'
import PageHeader from './PageHeader'

const About = () => {
   const breadcrumbs = [
   
    { label: "About Us", path: "/about" },
  ];

  return (
    <div>
     <PageHeader 
        title="About Us" 
        subtitle="We have a wide range of courses to help you achieve your goals."
        breadcrumbs={breadcrumbs}
      />
      <AboutUs />
      <TeamSection />
      <LearnWithSection />
      <AboutTestimonial />
    </div>
  )
}

export default About
