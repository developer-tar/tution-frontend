import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  Chip,
  Snackbar,
} from "@mui/material";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { h2, spainColor } from "./style";
import api from "../api";
import ParentLoginModal from "../components/ParentLoginModal";
import { useDispatch } from "react-redux";
import { addToCart, fetchCart } from "../redux/slices/cartSlice";

export default function SignUp() {
  const dispatch = useDispatch();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    // Parent Details
    parentEmail: "",
    parentFirstName: "",
    parentLastName: "",
    country: "",
    streetAddress: "",
    townCity: "",
    postcode: "",
    phone: "",
    // Children Details
    childFirstName: "",
    childLastName: "",
    childGender: "",
    childDateOfBirth: "",
    // Additional Information
    targetSchools: [],
    notes: "",
    // Payment
    cardNumber: "",
    expiryDate: "",
    securityCode: "",
    agreeToTerms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState([]);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [schools, setSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [phoneCode, setPhoneCode] = useState("+44");
  const [phoneNumberLength, setPhoneNumberLength] = useState(10);
  const [loadingPhoneCode, setLoadingPhoneCode] = useState(false);
  const [paperData, setPaperData] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' // 'success' or 'error'
  });

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const userDataStr = localStorage.getItem('userData');

      if (token && role) {
        setIsLoggedIn(true);
        if (userDataStr) {
          try {
            setUserData(JSON.parse(userDataStr));
          } catch (error) {
            console.error('Error parsing user data:', error);
          }
        }
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };

    checkLoginStatus();

    // Listen for storage changes (login/logout)
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'role' || e.key === 'userData') {
        checkLoginStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom events (for same-tab updates)
    window.addEventListener('login', checkLoginStatus);
    window.addEventListener('logout', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('login', checkLoginStatus);
      window.removeEventListener('logout', checkLoginStatus);
    };
  }, []);

  // Load course data from localStorage on component mount
  useEffect(() => {
    const savedCourseData = localStorage.getItem('courseCartData');
    if (savedCourseData) {
      try {
        const parsedData = JSON.parse(savedCourseData);
        setCourseData(parsedData);
      } catch (error) {
        console.error('Error parsing course data from localStorage:', error);
      }
    }
  }, []);

  // Fetch paper details if redirect path exists
  useEffect(() => {
    const fetchPaperFromRedirect = async () => {
      const redirectPath = sessionStorage.getItem('redirectAfterAuth');
      if (redirectPath && redirectPath.includes('/add-to-cart/paper/')) {
        const slug = redirectPath.split('/add-to-cart/paper/')[1];
        if (slug) {
          try {
            const response = await api.get(`/paper/${slug}/details`);
            if (response.data.success) {
              setPaperData(response.data.data);
            }
          } catch (error) {
            console.error('Error fetching paper details:', error);
          }
        }
      }
    };

    if (isLoggedIn) {
      fetchPaperFromRedirect();
    }
  }, [isLoggedIn]);

  // Sync guest cart to server
  const syncGuestCartToServer = async () => {
    try {
      const guestCart = localStorage.getItem('guestCart');
      if (!guestCart) return;

      const guestCartItems = JSON.parse(guestCart);
      if (guestCartItems.length === 0) return;

      // Add each item from guest cart to server cart
      for (const item of guestCartItems) {
        try {
          await dispatch(addToCart({
            product_type: item.product_type,
            product_id: item.product_id,
            quantity: item.quantity,
            price_id: item.price_id,
          })).unwrap();
        } catch (error) {
          console.error('Error adding item to cart:', error);
        }
      }

      // Clear guest cart after successful sync
      localStorage.removeItem('guestCart');

      // Fetch updated cart
      await dispatch(fetchCart());

      // Trigger event to update navbar and other components
      window.dispatchEvent(new Event('guestCartUpdated'));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error syncing guest cart:', error);
    }
  };

  // Handle login success - show payment details instead of redirecting immediately
  const handleLoginSuccess = async (responseData) => {
    // Update login status
    setIsLoggedIn(true);
    if (responseData?.data) {
      setUserData(responseData.data);
    }

    // Sync guest cart to server after login
    await syncGuestCartToServer();

    // Trigger custom event to update other components
    window.dispatchEvent(new Event('login'));

    // Don't redirect immediately - show payment details on this page
    // The user can proceed to payment from here
  };

  // Handle switch to register (close login modal)
  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
  };

  // Fetch regions and schools on component mount
  useEffect(() => {
    const fetchRegions = async () => {
      setLoadingRegions(true);
      try {
        const response = await api.get("/common/data?param=Regions");
        if (response.data && response.data.success) {
          const regionsData = response.data.data || [];
          setRegions(Array.isArray(regionsData) ? regionsData : []);
        }
      } catch (error) {
        console.error("Error fetching regions:", error);
        setRegions([]);
      } finally {
        setLoadingRegions(false);
      }
    };

    const fetchSchools = async () => {
      setLoadingSchools(true);
      try {
        const response = await api.get("/common/data?param=Schools");
        if (response.data && response.data.success) {
          const schoolsData = response.data.data || [];
          setSchools(Array.isArray(schoolsData) ? schoolsData : []);
        }
      } catch (error) {
        console.error("Error fetching schools:", error);
        setSchools([]);
      } finally {
        setLoadingSchools(false);
      }
    };

    const fetchCountryPhoneCode = async () => {
      setLoadingPhoneCode(true);
      try {
        const response = await api.get("/common/country-phone-code");
        if (response.data && response.data.success) {
          const phoneData = response.data.data || {};
          setPhoneCode(phoneData.phone_code || "+44");
          setPhoneNumberLength(phoneData.phone_number_length || 10);
        }
      } catch (error) {
        console.error("Error fetching country phone code:", error);
        // Keep default values on error
      } finally {
        setLoadingPhoneCode(false);
      }
    };

    fetchRegions();
    fetchSchools();
    fetchCountryPhoneCode();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (error) setError("");
  };

  const handleCardNumberChange = (e) => {
    const { value } = e.target;
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, '');

    // Limit to 16 digits
    const limitedDigits = digitsOnly.slice(0, 16);

    // Format as 4-digit groups separated by spaces
    const formatted = limitedDigits.replace(/(\d{4})(?=\d)/g, '$1 ');

    setFormData({
      ...formData,
      cardNumber: formatted,
    });
    if (error) setError("");
  };

  const handleExpiryDateChange = (e) => {
    const { value } = e.target;
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, '');

    // Limit to 4 digits
    const limitedDigits = digitsOnly.slice(0, 4);

    // Format as MM/YY
    let formatted = limitedDigits;
    if (limitedDigits.length >= 2) {
      formatted = limitedDigits.slice(0, 2) + '/' + limitedDigits.slice(2, 4);
    }

    setFormData({
      ...formData,
      expiryDate: formatted,
    });
    if (error) setError("");
  };

  const handleSecurityCodeChange = (e) => {
    const { value } = e.target;
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, '');

    // Limit to 4 digits (CVV can be 3 or 4 digits)
    const limitedDigits = digitsOnly.slice(0, 4);

    setFormData({
      ...formData,
      securityCode: limitedDigits,
    });
    if (error) setError("");
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, '');

    // Limit to phoneNumberLength digits
    const limitedDigits = digitsOnly.slice(0, phoneNumberLength);

    setFormData({
      ...formData,
      phone: limitedDigits,
    });
    if (error) setError("");
  };

  const validateForm = () => {
    // Validate parent fields
    if (
      !formData.parentEmail ||
      !formData.parentFirstName ||
      !formData.parentLastName ||
      !formData.country ||
      !formData.streetAddress ||
      !formData.townCity ||
      !formData.postcode ||
      !formData.phone
    ) {
      setError("Please fill all required parent details");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.parentEmail)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Validate phone number (based on country's phone number length)
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length !== phoneNumberLength) {
      setError(`Please enter a valid phone number (exactly ${phoneNumberLength} digits)`);
      return false;
    }

    // Validate postcode (basic validation - at least 5 characters)
    if (formData.postcode.trim().length < 5) {
      setError("Please enter a valid postcode");
      return false;
    }

    // Validate children fields
    if (
      !formData.childFirstName ||
      !formData.childLastName ||
      !formData.childGender ||
      !formData.childDateOfBirth
    ) {
      setError("Please fill all required children details");
      return false;
    }

    // Validate date of birth (should be in the past)
    if (formData.childDateOfBirth) {
      const birthDate = new Date(formData.childDateOfBirth);
      const today = new Date();
      if (birthDate >= today) {
        setError("Date of birth must be in the past");
        return false;
      }
    }

    // Validate payment - Card Number (should be 16 digits)
    const cardDigits = formData.cardNumber.replace(/\D/g, '');
    if (!formData.cardNumber || cardDigits.length !== 16) {
      setError("Please enter a valid card number (16 digits)");
      return false;
    }

    // Validate payment - Expiry Date (MM/YY format)
    if (!formData.expiryDate) {
      setError("Please enter card expiry date");
      return false;
    }
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(formData.expiryDate)) {
      setError("Please enter expiry date in MM/YY format (e.g., 12/25)");
      return false;
    }
    // Validate expiry date is not in the past
    const [month, year] = formData.expiryDate.split('/');
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const currentDate = new Date();
    if (expiryDate < currentDate) {
      setError("Card expiry date cannot be in the past");
      return false;
    }

    // Validate payment - Security Code (3-4 digits)
    const securityCodeDigits = formData.securityCode.replace(/\D/g, '');
    if (!formData.securityCode || securityCodeDigits.length < 3 || securityCodeDigits.length > 4) {
      setError("Please enter a valid security code (3-4 digits)");
      return false;
    }

    // Validate terms agreement
    if (!formData.agreeToTerms) {
      setError("Please agree to the terms and conditions");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      // Register both parent and student in one API call
      const registrationData = {
        parent_first_name: formData.parentFirstName,
        parent_last_name: formData.parentLastName,
        parent_email: formData.parentEmail,
        parent_country: formData.country,
        parent_street_address: formData.streetAddress,
        parent_town_city: formData.townCity,
        parent_postcode: formData.postcode,
        parent_phone: formData.phone,
        student_first_name: formData.childFirstName,
        student_last_name: formData.childLastName,
        student_gender: formData.childGender,
        student_date_of_birth: formData.childDateOfBirth,
        target_schools: Array.isArray(formData.targetSchools)
          ? formData.targetSchools.join(',')
          : formData.targetSchools,
        notes: formData.notes,
        // Include course name if available
        course_name: courseData?.courseName || courseData?.courseData?.name || null,
        // Payment details would be handled separately via payment gateway
      };

      const response = await api.post("/register/parent-student", registrationData);

      if (response.data.success) {
        // Store token if provided in response (verification email has been sent during registration)
        if (response.data.data?.access_token) {
          localStorage.setItem('token', response.data.data.access_token);
          localStorage.setItem('role', response.data.data.role || 'Parent');
          localStorage.setItem('userData', JSON.stringify({
            id: response.data.data.parent?.id,
            email: response.data.data.parent?.email,
            full_name: response.data.data.parent?.full_name,
            role: response.data.data.role || 'Parent'
          }));
        }

        // Sync guest cart to server after registration
        await syncGuestCartToServer();

        // If course data exists, process payment immediately
        if (courseData?.selectedPriceId && courseData?.courseData?.id && response.data.data?.access_token) {
          try {
            // Create checkout session for course registration
            const checkoutResponse = await api.post("/parent/course/checkout", {
              course_id: courseData.courseData.id,
              price_id: courseData.selectedPriceId,
            });

            if (checkoutResponse.data.success && checkoutResponse.data.data?.checkout_url) {
              // Redirect to Stripe checkout - after payment, user will be redirected to payment success page
              // Verification email has already been sent during registration
              window.location.href = checkoutResponse.data.data.checkout_url;
              return; // Exit early as we're redirecting
            }
            if (checkoutResponse.data.success && checkoutResponse.data.data?.no_payment_required) {
              // Registration fee was 0 - already complete
              sessionStorage.setItem('registrationData', JSON.stringify(response.data.data));
              window.location.href = "/registration-success";
              return;
            }
          } catch (paymentError) {
            console.error("Payment checkout error:", paymentError);
            // If payment fails, still show registration success
            // User can proceed to payment later
          }
        }

        // Navigate to registration success page with registration data
        // Verification email has been sent during registration
        // Store registration data in sessionStorage since we can't pass state with window.location.href
        sessionStorage.setItem('registrationData', JSON.stringify(response.data.data));
        window.location.href = "/registration-success";
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        setError(errorMessages.join(", "));
      } else {
        setError("Registration failed. Please try again.");
      }
      // Log full error for debugging
      console.error("Full error response:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // Handle proceed to payment
  const handleProceedToPayment = async () => {
    try {
      setLoading(true);
      setError("");

      // Send verification email to the email in the signup form
      let verificationEmailSent = false;
      if (formData.parentEmail) {
        try {
          const emailResponse = await api.post("/email/resend-verification", {
            email: formData.parentEmail
          });

          if (emailResponse.data.success) {
            verificationEmailSent = true;
          }
        } catch (emailError) {
          console.error("Failed to send verification email:", emailError);
          // Continue with payment even if email fails
        }
      }

      // Process payment - check if course data exists
      if (courseData?.courseData?.id) {
        try {
          // Get the correct Stripe price ID
          // Try multiple sources: selectedPriceId, selectedPlan.priceId, or from price_according_to_mode
          let stripePriceId = courseData.selectedPriceId;

          // If selectedPriceId is not available, empty, or not a Stripe price ID, try to get it from courseData structure
          if (!stripePriceId || stripePriceId === '' || stripePriceId === null ||
            (typeof stripePriceId === 'string' && !stripePriceId.startsWith('price_'))) {
            // Try to get from selectedPlan
            if (courseData.selectedPlan?.priceId) {
              stripePriceId = courseData.selectedPlan.priceId;
            }
            // Try to get from price_according_to_mode structure
            else if (courseData.courseData?.price_according_to_mode && courseData.selectedMode) {
              // Get duration from selectedDuration or fallback to selectedCourse.duration
              const duration = courseData.selectedDuration || courseData.selectedCourse?.duration;

              if (duration) {
                const modeData = courseData.courseData.price_according_to_mode[courseData.selectedMode];
                if (modeData && modeData[duration] && modeData[duration].price_id) {
                  const rawPriceId = modeData[duration].price_id;
                  // Validate that price_id is a valid Stripe price ID (starts with 'price_')
                  if (rawPriceId && typeof rawPriceId === 'string' && rawPriceId.startsWith('price_')) {
                    stripePriceId = rawPriceId;
                  }
                }
              }

              // If still not found, try first available duration for the selected mode
              if (!stripePriceId || stripePriceId === '' || stripePriceId === null ||
                (typeof stripePriceId === 'string' && !stripePriceId.startsWith('price_'))) {
                const modeData = courseData.courseData.price_according_to_mode[courseData.selectedMode];
                if (modeData) {
                  // Try all durations to find a valid Stripe price ID
                  for (const durationKey of Object.keys(modeData)) {
                    const rawPriceId = modeData[durationKey]?.price_id;
                    if (rawPriceId && typeof rawPriceId === 'string' && rawPriceId.startsWith('price_')) {
                      stripePriceId = rawPriceId;
                      break; // Use first valid Stripe price ID found
                    }
                  }
                }
              }
            }
          }

          // If still no valid price ID found, try to re-fetch course data from API
          if (!stripePriceId || stripePriceId === '' || stripePriceId === null || stripePriceId === undefined ||
            (typeof stripePriceId === 'string' && !stripePriceId.startsWith('price_'))) {

            // Re-fetch course data to get updated price IDs
            if (courseData.courseSlug || courseData.courseData?.slug) {
              try {
                const slug = courseData.courseSlug || courseData.courseData.slug;
                const courseResponse = await api.get(`/${slug}`);

                if (courseResponse.data.success && courseResponse.data.data && courseResponse.data.data.length > 0) {
                  const freshCourseData = courseResponse.data.data[0];

                  // Update courseData with fresh data
                  const updatedCourseData = {
                    ...courseData,
                    courseData: freshCourseData
                  };

                  // Try to get price ID from fresh data
                  if (updatedCourseData.courseData?.price_according_to_mode && courseData.selectedMode) {
                    const duration = courseData.selectedDuration || courseData.selectedCourse?.duration;
                    const modeData = updatedCourseData.courseData.price_according_to_mode[courseData.selectedMode];

                    if (duration && modeData && modeData[duration]?.price_id) {
                      const rawPriceId = modeData[duration].price_id;
                      if (rawPriceId && typeof rawPriceId === 'string' && rawPriceId.startsWith('price_')) {
                        stripePriceId = rawPriceId;
                      }
                    }

                    // If still not found, try all durations
                    if (!stripePriceId || !stripePriceId.startsWith('price_')) {
                      for (const durationKey of Object.keys(modeData || {})) {
                        const rawPriceId = modeData[durationKey]?.price_id;
                        if (rawPriceId && typeof rawPriceId === 'string' && rawPriceId.startsWith('price_')) {
                          stripePriceId = rawPriceId;
                          break;
                        }
                      }
                    }
                  }
                }
              } catch (fetchError) {
                console.error('Error re-fetching course data:', fetchError);
              }
            }
          }

          // If still no valid Stripe price ID, try to use the original selectedPriceId 
          // (even if invalid - backend will handle creating it)
          if (!stripePriceId || stripePriceId === '' || stripePriceId === null || stripePriceId === undefined ||
            (typeof stripePriceId === 'string' && !stripePriceId.startsWith('price_'))) {

            // Use the original selectedPriceId if available (backend will handle invalid ones)
            if (courseData.selectedPriceId) {
              stripePriceId = courseData.selectedPriceId;
              console.warn('Using potentially invalid price ID - backend will handle it:', stripePriceId);
            } else {
              console.error('Price ID is missing after all attempts:', {
                courseData,
                selectedPriceId: courseData.selectedPriceId,
                selectedPlan: courseData.selectedPlan,
                selectedMode: courseData.selectedMode,
                selectedDuration: courseData.selectedDuration,
                selectedCourse: courseData.selectedCourse
              });
              setSnackbar({
                open: true,
                message: 'Price information is missing. Please select the course again or contact support.',
                severity: 'error'
              });
              return;
            }
          }

          // If price ID is numeric or invalid format, log a warning but still send to backend
          // Backend will handle creating the proper Stripe price ID
          if (typeof stripePriceId === 'number' || (typeof stripePriceId === 'string' && /^\d+(\.\d+)?$/.test(stripePriceId))) {
            console.warn('Price ID is numeric/invalid format - backend will handle creating proper Stripe price:', {
              stripePriceId,
              type: typeof stripePriceId,
              courseData: {
                selectedPriceId: courseData.selectedPriceId,
                selectedMode: courseData.selectedMode,
                selectedDuration: courseData.selectedDuration,
                price_according_to_mode: courseData.courseData?.price_according_to_mode
              }
            });
            // Continue - backend will handle this
          } else if (!stripePriceId || !stripePriceId.toString().startsWith('price_')) {
            console.warn('Price ID does not start with "price_" - backend will attempt to resolve:', stripePriceId);
            // Continue - backend will handle this
          }

          console.log('Sending checkout request:', {
            course_id: courseData.courseData.id,
            price_id: stripePriceId,
            courseData: courseData
          });

          // Create checkout session for course registration
          const checkoutResponse = await api.post("/parent/course/checkout", {
            course_id: courseData.courseData.id,
            price_id: stripePriceId,
          });

          if (checkoutResponse.data.success && checkoutResponse.data.data?.checkout_url) {
            // Show success notification with verification email status
            const message = verificationEmailSent
              ? `Verification email sent to ${formData.parentEmail}. Redirecting to payment...`
              : 'Redirecting to payment...';

            setSnackbar({
              open: true,
              message: message,
              severity: 'success'
            });

            // Redirect to Stripe checkout - after payment, user will be redirected to payment success page
            setTimeout(() => {
              window.location.href = checkoutResponse.data.data.checkout_url;
            }, 2000);
            return; // Exit early as we're redirecting
          } else if (checkoutResponse.data.success && checkoutResponse.data.data?.no_payment_required) {
            setSnackbar({
              open: true,
              message: checkoutResponse.data.message || 'Registration complete.',
              severity: 'success'
            });
            setTimeout(() => {
              window.location.href = '/registration-success';
            }, 1500);
            return;
          } else {
            setSnackbar({
              open: true,
              message: checkoutResponse.data.message || 'Failed to process payment',
              severity: 'error'
            });
          }
        } catch (paymentError) {
          console.error("Payment checkout error:", paymentError);
          setSnackbar({
            open: true,
            message: paymentError.response?.data?.message || 'Payment processing failed. Please try again.',
            severity: 'error'
          });
        }
      } else {
        // No course data, just redirect
        const redirectPath = sessionStorage.getItem('redirectAfterAuth');
        if (redirectPath) {
          sessionStorage.removeItem('redirectAfterAuth');
          window.location.href = redirectPath;
        } else {
          window.location.href = '/papers';
        }
      }
    } catch (error) {
      console.error("Proceed to payment error:", error);
      setSnackbar({
        open: true,
        message: 'An error occurred. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle snackbar close
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5", py: 4 }}>
      <Box sx={{ maxWidth: "1400px", margin: "0 auto", px: { xs: 2, md: 4 } }}>
        <Grid container spacing={4}>
          {/* Left Part - Form Sections */}
          <Grid item xs={12} md={7}>
            <Box component="form" onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {/* Already have account section */}
              <Card sx={{ mb: 3, boxShadow: 2, backgroundColor: "#f8f9fa" }}>
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
                    <Typography
                      variant="body1"
                      sx={{ color: "#555", mb: 0 }}
                    >
                      Already have an account? Please login
                    </Typography>
                    <Button
                      component={Link}
                      to="/login"
                      variant="contained"
                      sx={{
                        background: "linear-gradient(90deg, #4450A5 0%, #EF2A1E 100%)",
                        color: "#fff",
                        padding: "10px 30px",
                        fontWeight: 600,
                        borderRadius: "30px",
                        fontSize: "16px",
                        textTransform: "none",
                        "&:hover": {
                          background: "linear-gradient(to right, #d32f2f, #7b1fa2)",
                        },
                      }}
                    >
                      Login
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Section 1: Parent Details */}
              <Card sx={{ mb: 3, boxShadow: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 3, color: "#1f2937" }}
                  >
                    1. Parent Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
                      >
                        Email Address *
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="your@mail.com"
                        variant="outlined"
                        name="parentEmail"
                        type="email"
                        value={formData.parentEmail}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
                      >
                        First Name *
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="First Name"
                        variant="outlined"
                        name="parentFirstName"
                        value={formData.parentFirstName}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
                      >
                        Last Name *
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Last Name"
                        variant="outlined"
                        name="parentLastName"
                        value={formData.parentLastName}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
                      >
                        Country/Region *
                      </Typography>
                      <FormControl fullWidth required>
                        <Select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          displayEmpty
                          disabled={loadingRegions}
                          sx={{
                            backgroundColor: "#fff",
                            borderRadius: "4px",
                          }}
                        >
                          <MenuItem value="">
                            {loadingRegions ? "Loading regions..." : "Select Country/Region"}
                          </MenuItem>
                          {regions.map((region) => (
                            <MenuItem key={region.id} value={region.name}>
                              {region.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
                      >
                        Street Address *
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Street Address"
                        variant="outlined"
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
                      >
                        Town/City *
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Town/City"
                        variant="outlined"
                        name="townCity"
                        value={formData.townCity}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
                      >
                        Postcode *
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Postcode"
                        variant="outlined"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
                      >
                        Phone *
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          disabled
                          value={phoneCode}
                          variant="outlined"
                          sx={{
                            width: '120px',
                            '& .MuiInputBase-input': {
                              backgroundColor: '#f5f5f5',
                              fontWeight: 500,
                            },
                          }}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                        <TextField
                          fullWidth
                          placeholder={`Phone Number (${phoneNumberLength} digits)`}
                          variant="outlined"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          inputProps={{
                            maxLength: phoneNumberLength,
                            inputMode: 'numeric',
                          }}
                          required
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Section 2: Children Details */}
              <Card sx={{ mb: 3, boxShadow: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 3, color: "#1f2937" }}
                  >
                    2. Children Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
                      >
                        First Name *
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Child's First Name"
                        variant="outlined"
                        name="childFirstName"
                        value={formData.childFirstName}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
                      >
                        Last Name *
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Child's Last Name"
                        variant="outlined"
                        name="childLastName"
                        value={formData.childLastName}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
                      >
                        Gender *
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          name="childGender"
                          value={formData.childGender}
                          onChange={handleChange}
                          displayEmpty
                          required
                        >
                          <MenuItem value="">Select Gender</MenuItem>
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
                      >
                        Date of Birth *
                      </Typography>
                      <TextField
                        fullWidth
                        type="date"
                        variant="outlined"
                        name="childDateOfBirth"
                        value={formData.childDateOfBirth}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Section 3: Additional Information */}
              <Card sx={{ mb: 3, boxShadow: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 3, color: "#1f2937" }}
                  >
                    3. Additional Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
                      >
                        Target Schools
                      </Typography>
                      <Autocomplete
                        multiple
                        options={schools}
                        getOptionLabel={(option) => option.name || ""}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        value={schools.filter((school) =>
                          formData.targetSchools.includes(school.id)
                        )}
                        onChange={(event, newValue) => {
                          setFormData({
                            ...formData,
                            targetSchools: newValue.map((school) => school.id),
                          });
                        }}
                        loading={loadingSchools}
                        disabled={loadingSchools}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select target schools (optional)"
                            variant="outlined"
                          />
                        )}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              label={option.name}
                              {...getTagProps({ index })}
                              key={option.id}
                            />
                          ))
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, fontWeight: 500, color: "text.secondary" }}
                      >
                        Notes
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Additional notes (optional)"
                        variant="outlined"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        multiline
                        rows={4}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          {/* Right Part - Order Summary & Payment */}
          <Grid item xs={12} md={5}>
            <Box sx={{ position: "sticky", top: 20 }}>
              {/* Order Summary */}
              <Card sx={{ mb: 3, boxShadow: 2 }}>
                <CardContent sx={{ p: 3, backgroundColor: "#F9F9FF" }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 2, color: "#1f2937" }}
                  >
                    Order Summary
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                      fontSize: "14px",
                      color: "#6b7280",
                    }}
                  >
                    <Typography>Product</Typography>
                    <Typography>Subtotal</Typography>
                  </Box>
                  {isLoggedIn && paperData ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        mb: 2,
                        fontSize: "14px",
                        color: "#1f2937",
                      }}
                    >
                      <Box sx={{ mb: 1 }}>
                        <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
                          {paperData.name}
                        </Typography>
                        {paperData.category && (
                          <Typography sx={{ fontSize: "12px", color: "#6b7280", mb: 0.5 }}>
                            Category: {paperData.category}
                          </Typography>
                        )}
                        {paperData.format && (
                          <Typography sx={{ fontSize: "12px", color: "#6b7280" }}>
                            Format: {paperData.format}
                          </Typography>
                        )}
                      </Box>
                      <Typography sx={{ fontWeight: 600, alignSelf: "flex-end", mt: 1 }}>
                        {paperData.currency || '€'}{paperData.price}
                      </Typography>
                    </Box>
                  ) : courseData ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        mb: 2,
                        fontSize: "14px",
                        color: "#1f2937",
                      }}
                    >
                      <Box sx={{ mb: 1 }}>
                        <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
                          {courseData.courseName || courseData.courseData?.name || "Course Registration"}
                        </Typography>
                        {courseData.selectedMode && (
                          <Typography sx={{ fontSize: "12px", color: "#6b7280", mb: 0.5 }}>
                            Mode: {courseData.selectedMode}
                          </Typography>
                        )}
                        {courseData.selectedDuration && (
                          <Typography sx={{ fontSize: "12px", color: "#6b7280" }}>
                            Duration: {courseData.selectedDuration}
                          </Typography>
                        )}
                      </Box>
                      <Typography sx={{ fontWeight: 600, alignSelf: "flex-end", mt: 1 }}>
                        {courseData.selectedRegistrationFee != null && Number(courseData.selectedRegistrationFee) >= 0
                          ? `${courseData.selectedRegistrationFeeCurrency || "€"}${Number(courseData.selectedRegistrationFee).toFixed(2)}`
                          : (courseData.selectedPrice || courseData.selectedPlan?.price || "£0.00")}
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                        fontSize: "14px",
                        color: "#1f2937",
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontWeight: 500 }}>
                          Course Registration
                        </Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 600 }}>£0.00</Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                      fontSize: "16px",
                      color: "#1f2937",
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>Total</Typography>
                    <Typography sx={{ fontWeight: 600, color: "#d32f2f" }}>
                      {isLoggedIn && paperData
                        ? `${paperData.currency || '€'}${paperData.price}`
                        : courseData
                          ? (courseData.selectedRegistrationFee != null && Number(courseData.selectedRegistrationFee) >= 0
                            ? `${courseData.selectedRegistrationFeeCurrency || "€"}${Number(courseData.selectedRegistrationFee).toFixed(2)}`
                            : (courseData.selectedPrice || courseData.selectedPlan?.price || "£0.00"))
                          : "£0.00"}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Payment Details */}
              <Card sx={{ mb: 3, boxShadow: 2 }}>
                <CardContent sx={{ p: 3, backgroundColor: "#F9F9FF" }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 2, color: "#1f2937" }}
                  >
                    Payment Details
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      sx={{ mb: 0.5, fontSize: "14px", color: "#6b7280" }}
                    >
                      Card Number *
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="1234 1234 1234 1234"
                      variant="outlined"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      inputProps={{
                        maxLength: 19, // 16 digits + 3 spaces
                      }}
                      required
                      sx={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-root": {
                          padding: "2px 5px",
                        },
                      }}
                    />
                  </Box>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography
                        sx={{ mb: 0.5, fontSize: "14px", color: "#6b7280" }}
                      >
                        Expiry Date *
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="MM/YY"
                        variant="outlined"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleExpiryDateChange}
                        inputProps={{
                          maxLength: 5, // MM/YY format
                        }}
                        required
                        sx={{
                          backgroundColor: "#fff",
                          borderRadius: "8px",
                          "& .MuiOutlinedInput-root": {
                            padding: "2px 5px",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        sx={{ mb: 0.5, fontSize: "14px", color: "#6b7280" }}
                      >
                        CVV *
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="123"
                        variant="outlined"
                        name="securityCode"
                        type="password"
                        value={formData.securityCode}
                        onChange={handleSecurityCodeChange}
                        inputProps={{
                          maxLength: 4, // CVV can be 3 or 4 digits
                        }}
                        required
                        sx={{
                          backgroundColor: "#fff",
                          borderRadius: "8px",
                          "& .MuiOutlinedInput-root": {
                            padding: "2px 5px",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Typography
                    sx={{ fontSize: "12px", color: "#6b7280", mb: 2 }}
                  >
                    Your personal data will be used to process your order,
                    support your experience through this website, and for other
                    purposes described in our privacy policy.
                  </Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.agreeToTerms}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            agreeToTerms: e.target.checked,
                          })
                        }
                        required
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: "14px", color: "#1f2937" }}>
                        I understand I will be called to set up direct debit (if
                        registering for weekly tuition) and have read and agree
                        to the website terms and conditions *
                      </Typography>
                    }
                    sx={{ alignItems: "flex-start" }}
                  />
                </CardContent>
              </Card>

              {/* Submit Button */}
              {!isLoggedIn && (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{
                    background: "linear-gradient(90deg, #4450A5 0%, #EF2A1E 100%)",
                    color: "#fff",
                    padding: "14px 0",
                    fontWeight: 600,
                    borderRadius: "30px",
                    fontSize: "16px",
                    textTransform: "none",
                    "&:hover": {
                      background: "linear-gradient(to right, #d32f2f, #7b1fa2)",
                    },
                  }}
                  endIcon={
                    <ArrowForwardIcon sx={{ fontSize: 20, color: "#fff" }} />
                  }
                >
                  {loading ? "Processing..." : "Complete Registration"}
                </Button>
              )}

              {isLoggedIn && (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleProceedToPayment}
                  disabled={loading}
                  sx={{
                    background: "linear-gradient(90deg, #4450A5 0%, #EF2A1E 100%)",
                    color: "#fff",
                    padding: "14px 0",
                    fontWeight: 600,
                    borderRadius: "30px",
                    fontSize: "16px",
                    textTransform: "none",
                    "&:hover": {
                      background: "linear-gradient(to right, #d32f2f, #7b1fa2)",
                    },
                  }}
                  endIcon={
                    <ArrowForwardIcon sx={{ fontSize: 20, color: "#fff" }} />
                  }
                >
                  {loading ? "Processing..." : "Proceed to Payment"}
                </Button>
              )}

              {/* Footer Link */}
              {!isLoggedIn && (
                <Typography
                  sx={{ textAlign: "center", color: "#555", mt: 2 }}
                >
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    style={{
                      color: "#D6232A",
                      fontWeight: 600,
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                  >
                    Sign in
                  </Link>
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Parent Login Modal */}
      <ParentLoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
        onSwitchToRegister={handleSwitchToRegister}
      />

      {/* Payment Success/Error Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
