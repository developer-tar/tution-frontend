// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline, LinearProgress, Box } from "@mui/material";
import { Provider } from "react-redux"; // ✅ Redux Provider
import { store } from "./redux/store";  // ✅ Your Redux store

import Navbar from "./Pages/Navbar";
import AppRoutes from "./routes";
import Footer from "./Pages/Footer";
import theme from "./Pages/theme";

// Component to handle route loading
function AppWithLoading() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show loading when route changes
    setLoading(true);
    
    // Smooth scroll to top when route changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Smooth transition to disable scroll
    document.body.style.transition = 'all 0.3s ease';
    document.body.style.overflow = 'hidden';
    
    // Hide loading after minimum 2 seconds
    const timer = setTimeout(() => {
      // Smooth transition to re-enable scroll
      document.body.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        setLoading(false);
        document.body.style.overflow = 'unset';
        // Remove transition after animation
        setTimeout(() => {
          document.body.style.transition = '';
        }, 300);
      }, 100);
    }, 2000);

    return () => {
      clearTimeout(timer);
      // Cleanup: ensure scroll is re-enabled
      document.body.style.overflow = 'unset';
      document.body.style.transition = '';
    };
  }, [location.pathname]);

  return (
    <>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1400, backgroundColor: 'white' }}>
        <Navbar />
        {/* Global Loading Progress Bar - Sticky with navbar */}
        {loading && (
          <LinearProgress 
            sx={{ 
              height: 4,
              backgroundColor: '#e3f2fd',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#1976d2'
              },
              animation: 'fadeIn 0.3s ease-in-out',
              '@keyframes fadeIn': {
                from: { opacity: 0 },
                to: { opacity: 1 }
              }
            }} 
          />
        )}
      </Box>
      {/* Loading Overlay - Prevents scroll during loading */}
      {loading && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          zIndex: 1350,
          pointerEvents: 'none',
          animation: 'fadeIn 0.3s ease-in-out',
          '@keyframes fadeIn': {
            from: { opacity: 0 },
            to: { opacity: 1 }
          }
        }} />
      )}
      <AppRoutes />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Provider store={store}> {/* ✅ Wrap your entire app in Redux provider */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppWithLoading />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
