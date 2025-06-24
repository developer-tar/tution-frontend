import React from 'react'
import WhyChooseUs from './Home/WhyChooseUs'
import ProgrammesSection from './Home/ProgrammesSection'
import WhereWeTeach from './Home/WhereWeTeach'
import StepProcessSection from './Home/StepProcessSection'
import FAQSection from './Home/FAQSection'
import FinalCTASection from './Home/FinalCTASection'
import TestimonialsSection from './Home/TestimonialsSection'
import Hero from './Home/Hero'

const Home = () => {
  return (
    <>
   <Hero />
   <WhyChooseUs />
   <ProgrammesSection />
   <WhereWeTeach />
   <StepProcessSection />
   <FAQSection />
   <FinalCTASection />
   <TestimonialsSection />
   </>
  )
}

export default Home