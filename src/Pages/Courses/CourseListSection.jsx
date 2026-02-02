import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Button,
    LinearProgress,
    Snackbar,
    Alert
} from '@mui/material';
import { containerStyles } from '../style';
import api from '../../api';
import { useDispatch } from 'react-redux';
import { addToCart, fetchCart } from '../../redux/slices/cartSlice';

export default function CourseListSection({ data, onFiltersChange }) {
    const dispatch = useDispatch();
    const [addingToCart, setAddingToCart] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleRegisterClick = async (course) => {
        console.log('Register Now clicked for course:', course);
        console.log('Course data:', data);

        // Determine mode based on location
        const isOnline = course.location?.toLowerCase() === 'online';
        const mode = isOnline ? 'Online' : 'In person';

        // Get price_id from price_according_to_mode
        let priceId = null;
        let selectedDuration = null;
        if (data.price_according_to_mode && data.price_according_to_mode[mode]) {
            const modeData = data.price_according_to_mode[mode];

            // Use the duration from the course object if available
            if (course.duration && modeData[course.duration]) {
                selectedDuration = course.duration;
                priceId = modeData[course.duration].price_id;
            } else {
                // Fallback to first available duration
                const firstDuration = Object.keys(modeData)[0];
                if (firstDuration && modeData[firstDuration]) {
                    selectedDuration = firstDuration;
                    priceId = modeData[firstDuration].price_id;
                }
            }
        }

        // Store course data in localStorage for signup page
        // Note: This does NOT clear the cart - cart items are preserved
        const cartData = {
            courseData: data,
            selectedCourse: course,
            courseName: data.name,
            courseSlug: data.slug,
            selectedLocation: course.location,
            selectedFee: course.fee,
            selectedDayTime: course.dayTime,
            selectedMode: mode,
            selectedDuration: selectedDuration || course.duration,
            selectedPriceId: priceId,
            timestamp: Date.now()
        };

        localStorage.setItem('courseCartData', JSON.stringify(cartData));

        // Add course to cart (always add, regardless of priceId - backend will handle it)
        // Check for course ID - use data.id or try to get from course object
        const courseId = data?.id || course?.id || data?.course_id || course?.course_id;

        if (courseId) {
            console.log('Adding course to cart, course ID:', courseId);
            setAddingToCart(true);
            try {
                // Check if user is logged in
                const token = localStorage.getItem('token');

                const payload = {
                    product_type: "course",
                    product_id: courseId,
                    quantity: 1,
                    price_id: priceId || null // Allow null price_id - backend will create it if needed
                };

                console.log('Cart payload:', payload);

                if (!token) {
                    // User is not logged in - add to guest cart
                    console.log('User not logged in, adding to guest cart');
                    const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
                    const existingItem = guestCart.find(
                        item => item.product_id === courseId && item.product_type === 'course'
                    );

                    if (existingItem) {
                        existingItem.quantity += 1;
                        console.log('Course already in cart, incrementing quantity');
                    } else {
                        // Parse price from fee string (e.g., "€50" -> 50)
                        let coursePrice = 0;
                        if (course.fee) {
                            const priceMatch = course.fee.toString().match(/[\d.]+/);
                            if (priceMatch) {
                                coursePrice = parseFloat(priceMatch[0]);
                            }
                        }

                        const newCartItem = {
                            ...payload,
                            course_name: data.name,
                            course_image: data.image || '/assets/images/product-img.png',
                            course_price: coursePrice,
                            course_fee: course.fee || '€0', // Keep original format for display
                            selectedMode: mode,
                            selectedDuration: selectedDuration || course.duration,
                        };
                        guestCart.push(newCartItem);
                        console.log('Added new course to guest cart:', newCartItem);
                    }

                    localStorage.setItem('guestCart', JSON.stringify(guestCart));
                    console.log('Guest cart saved to localStorage:', guestCart);

                    // Trigger guest cart update event to refresh navbar and cart display
                    window.dispatchEvent(new Event('guestCartUpdated'));

                    // Also trigger storage event for cross-tab updates
                    window.dispatchEvent(new StorageEvent('storage', {
                        key: 'guestCart',
                        newValue: JSON.stringify(guestCart)
                    }));

                    // Show success message
                    setSnackbar({
                        open: true,
                        message: 'Course added to cart successfully!',
                        severity: 'success'
                    });
                } else {
                    // User is logged in - add to server cart
                    console.log('User logged in, adding to server cart');
                    const result = await dispatch(addToCart(payload));
                    console.log('Add to cart result:', result);

                    if (addToCart.fulfilled.match(result)) {
                        // Fetch updated cart to refresh navbar and cart display
                        await dispatch(fetchCart());

                        // Trigger cart refresh in navbar
                        localStorage.setItem('cartUpdated', Date.now().toString());
                        window.dispatchEvent(new StorageEvent('storage', { key: 'cartUpdated' }));
                        window.dispatchEvent(new Event('cartUpdated'));

                        // Show success message
                        setSnackbar({
                            open: true,
                            message: 'Course added to cart successfully!',
                            severity: 'success'
                        });
                        console.log('Course successfully added to server cart');
                    } else {
                        console.error('Failed to add to cart:', result);
                        throw new Error(result.payload || 'Failed to add to cart');
                    }
                }
            } catch (error) {
                console.error('Error adding course to cart:', error);
                // Show error message but continue to signup page
                setSnackbar({
                    open: true,
                    message: 'Failed to add course to cart. You can still proceed.',
                    severity: 'warning'
                });
            } finally {
                setAddingToCart(false);

                // Navigate to signup page after cart operation completes
                setTimeout(() => {
                    console.log('Navigating to signup page');
                    // Verify cart was saved before navigating
                    const token = localStorage.getItem('token');
                    if (!token) {
                        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
                        console.log('Guest cart before navigation:', guestCart);
                        if (guestCart.length === 0) {
                            console.warn('Warning: Guest cart is empty before navigation');
                        }
                    }
                    window.location.href = '/signup';
                }, 1500); // Delay to ensure cart is saved and user sees the message
            }
        } else {
            // No course ID available - still try to add with available data
            console.warn('Course ID is missing. Course data:', data, 'Course object:', course);
            console.log('Attempting to add to cart without ID...');

            // Still try to add to cart even without ID - backend might handle it
            setAddingToCart(true);
            try {
                const token = localStorage.getItem('token');

                // Try to use course name or slug as identifier
                const fallbackId = data?.slug || course?.course || 'unknown';

                const payload = {
                    product_type: "course",
                    product_id: fallbackId,
                    quantity: 1,
                    price_id: priceId || null
                };

                if (!token) {
                    // Add to guest cart even without proper ID
                    const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
                    let coursePrice = 0;
                    if (course.fee) {
                        const priceMatch = course.fee.toString().match(/[\d.]+/);
                        if (priceMatch) {
                            coursePrice = parseFloat(priceMatch[0]);
                        }
                    }

                    guestCart.push({
                        ...payload,
                        course_name: data?.name || course?.course || 'Course',
                        course_image: data?.image || '/assets/images/product-img.png',
                        course_price: coursePrice,
                        course_fee: course.fee || '€0',
                        selectedMode: mode,
                        selectedDuration: selectedDuration || course.duration,
                    });

                    localStorage.setItem('guestCart', JSON.stringify(guestCart));
                    window.dispatchEvent(new Event('guestCartUpdated'));

                    setSnackbar({
                        open: true,
                        message: 'Course added to cart!',
                        severity: 'success'
                    });
                } else {
                    // Try to add to server cart
                    const result = await dispatch(addToCart(payload));
                    if (addToCart.fulfilled.match(result)) {
                        await dispatch(fetchCart());
                        setSnackbar({
                            open: true,
                            message: 'Course added to cart!',
                            severity: 'success'
                        });
                    }
                }
            } catch (error) {
                console.error('Error adding course without ID:', error);
                setSnackbar({
                    open: true,
                    message: 'Course information incomplete. Please contact support.',
                    severity: 'error'
                });
            } finally {
                setAddingToCart(false);
                setTimeout(() => {
                    window.location.href = '/signup';
                }, 1500);
            }
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };
    const [filters, setFilters] = useState({
        format: 'All Formats',
        location: 'All Locations',
        days: 'All Days',
        installment: 'All Installment'
    });

    const [filterOptions, setFilterOptions] = useState({
        formats: [], locations: [], days: [], installments: []
    });
    const [courseList, setCourseList] = useState([]);
    // const [filtersLoading, setFiltersLoading] = useState(false); // Commented out - using global loading
    // const [courseListLoading, setCourseListLoading] = useState(false); // Commented out - using global loading

    const isUpcoming = (startEndDate) => {
        if (!startEndDate) return false;
        const courseDate = new Date(startEndDate.split(' to ')[0]);
        return courseDate >= new Date();
    };

    useEffect(() => {
        fetchFilterOptions();
        if (data && data.locations) {
            generateCourseList();
        }
    }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchFilterOptions = async () => {
        if (!data) return;

        // setFiltersLoading(true); // Commented out - using global loading
        // const startTime = Date.now(); // Commented out - using global loading

        try {
            // Fetch filter options from common/data API
            const [locationsRes, daysRes, formatsRes, installmentsRes] = await Promise.all([
                api.get('/common/data?param=Locations'),
                api.get('/common/data?param=WeekDays'),
                api.get('/common/data?param=Modes'),
                api.get('/common/data?param=BillingPeriods')
            ]);

            // Helper function to extract values from API response
            const extractValues = (response, fallback) => {
                const items = response?.data?.data || fallback || [];
                return items.map(item => {
                    if (item && typeof item === 'object') {
                        return item.name || item.Name || item.value || item.Value || item;
                    }
                    return item;
                });
            };

            // Get installments from price_according_to_mode as fallback
            const fallbackInstallments = [];
            Object.values(data.price_according_to_mode || {}).forEach(modeData => {
                Object.keys(modeData || {}).forEach(duration => {
                    fallbackInstallments.push(duration);
                });
            });

            setFilterOptions({
                formats: extractValues(formatsRes, data.modes),
                locations: extractValues(locationsRes, data.locations?.map(loc => loc.name) || []),
                days: extractValues(daysRes),
                installments: extractValues(installmentsRes, [...new Set(fallbackInstallments)])
            });
        } catch (error) {
            console.error('Error fetching filter options:', error);
            // Fallback to data from course response
            const fallbackInstallments = [];
            Object.values(data.price_according_to_mode || {}).forEach(modeData => {
                Object.keys(modeData || {}).forEach(duration => {
                    fallbackInstallments.push(duration);
                });
            });

            setFilterOptions({
                formats: data.modes || ['Online', 'In person'],
                locations: data.locations?.map(loc => loc.name) || [],
                days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                installments: [...new Set(fallbackInstallments)]
            });
        } finally {
            // Commented out individual loading - now handled globally
            // const elapsedTime = Date.now() - startTime;
            // const minLoadingTime = 1500; // 1.5 seconds
            // 
            // if (elapsedTime < minLoadingTime) {
            //     setTimeout(() => {
            //         setFiltersLoading(false);
            //     }, minLoadingTime - elapsedTime);
            // } else {
            //     setFiltersLoading(false);
            // }
        }
    };

    const generateCourseList = () => {
        if (!data.locations) return;
        // setCourseListLoading(true); // Commented out - using global loading
        const courses = [];
        const isUpcomingCourse = isUpcoming(data.start_end_date);

        data.locations.forEach(location => {
            const locationName = location.name || 'Unknown';
            const isOnline = locationName.toLowerCase() === 'online';

            // Get pricing for this location type
            const modeKey = isOnline ? 'Online' : 'In person';
            const pricing = data.price_according_to_mode?.[modeKey];
            const price = pricing ? Object.values(pricing)[0]?.price || '€0' : '€0';

            if (location.slots && location.slots.length > 0) {
                // Add courses from slots
                location.slots.forEach(slot => {
                    // Get all pricing options for this mode
                    const allPricing = pricing || {};
                    Object.entries(allPricing).forEach(([duration, priceData]) => {
                        courses.push({
                            id: `${locationName}-${slot.class}-${slot.weekday}-${duration}`,
                            course: `${data.name || 'Year 3'}: ${slot.class.toUpperCase()} 2024`,
                            dayTime: `${slot.weekday}, ${slot.start_end_time}`,
                            location: locationName,
                            fee: priceData.price || price,
                            seatsLeft: slot.seat_left,
                            status: parseInt(slot.seat_left) > 0 ? 'Available' : 'Full',
                            isUpcoming: isUpcomingCourse,
                            startDate: data.start_end_date,
                            mode: modeKey,
                            duration: duration,
                            weekday: slot.weekday
                        });
                    });
                });
            } else {
                // Add flexible timing option for locations without specific slots
                const allPricing = pricing || {};
                Object.entries(allPricing).forEach(([duration, priceData]) => {
                    courses.push({
                        id: `${locationName}-flexible-${duration}`,
                        course: `${data.name || 'Year 3'}: FLEXIBLE TIMING`,
                        dayTime: 'Flexible Timing Available',
                        location: locationName,
                        fee: priceData.price || price,
                        seatsLeft: '5',
                        status: 'Available',
                        isUpcoming: isUpcomingCourse,
                        startDate: data.start_end_date,
                        mode: modeKey,
                        duration: duration,
                        weekday: 'Flexible'
                    });
                });
            }
        });

        // Sort: upcoming first, then by date
        courses.sort((a, b) => {
            if (a.isUpcoming && !b.isUpcoming) return -1;
            if (!a.isUpcoming && b.isUpcoming) return 1;
            return new Date(a.startDate) - new Date(b.startDate);
        });

        setCourseList(courses);

        // Commented out individual loading - now handled globally
        // setTimeout(() => {
        //     setCourseListLoading(false);
        // }, 1000);
    };

    const handleFilterChange = (filterType, value) => {
        const newFilters = { ...filters, [filterType]: value };
        setFilters(newFilters);
        if (onFiltersChange) onFiltersChange(newFilters);
    };

    const filteredCourses = courseList.filter(course => {
        // Format filter (Online/In person mode)
        const formatMatch = filters.format === 'All Formats' ||
            course.mode === filters.format;

        // Location filter
        const locationMatch = filters.location === 'All Locations' ||
            course.location.toLowerCase() === filters.location.toLowerCase();

        // Days filter (based on actual weekday from slots)
        const daysMatch = filters.days === 'All Days' ||
            course.weekday === filters.days;

        // Installment filter (based on duration from price_according_to_mode)
        const installmentMatch = filters.installment === 'All Installment' ||
            course.duration === filters.installment;

        return formatMatch && locationMatch && daysMatch && installmentMatch;
    });

    if (!data || !data.locations) {
        return (
            <Box component="section" sx={{ bgcolor: '#fff', py: { xs: 4, sm: 6, md: 8 } }}>
                <Container sx={containerStyles}>
                    <Box textAlign="center">
                        <Typography variant="h6">No Data Found</Typography>
                    </Box>
                </Container>
            </Box>
        );
    }

    const renderFilter = (label, value, options, type) => (
        <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
                <InputLabel>{label}</InputLabel>
                <Select value={value} label={label} onChange={(e) => handleFilterChange(type, e.target.value)}>
                    <MenuItem value={label}>{label}</MenuItem>
                    {options.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                </Select>
            </FormControl>
        </Grid>
    );

    const renderFilters = () => (
        <Grid container spacing={2} sx={{ mb: 3 }}>
            {renderFilter('All Formats', filters.format, filterOptions.formats, 'format')}
            {renderFilter('All Locations', filters.location, filterOptions.locations, 'location')}
            {renderFilter('All Days', filters.days, filterOptions.days, 'days')}
            {renderFilter('All Installment', filters.installment, filterOptions.installments, 'installment')}
        </Grid>
    );

    return (
        <Box component="section" data-section="course-list" sx={{ bgcolor: '#fff', py: { xs: 3, sm: 4, md: 5 } }}>
            <Container sx={containerStyles}>
                {/* Commented out individual loading - now handled globally */}
                {/* 
                {(filtersLoading || courseListLoading) && (
                    <Box sx={{ width: '100%', mb: 2 }}>
                        <LinearProgress 
                            sx={{ 
                                height: 3,
                                backgroundColor: '#e3f2fd',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#1976d2'
                                }
                            }} 
                        />
                        <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}>
                            {filtersLoading ? 'Loading filters...' : 'Loading course list...'}
                        </Typography>
                    </Box>
                )}
                */}

                {renderFilters()}

                {filteredCourses.length === 0 ? (
                    <Box textAlign="center" sx={{ py: 6 }}>
                        <Typography variant="h6" color="text.secondary">No Data Found</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {courseList.length === 0 ? 'No courses available for this location.' : 'No courses match your current filters.'}
                        </Typography>
                    </Box>
                ) : (
                    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Course</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Day & Time</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Fee</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredCourses.map((course) => (
                                    <TableRow key={course.id} hover>
                                        <TableCell>{course.course}</TableCell>
                                        <TableCell>{course.dayTime}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={course.location}
                                                size="small"
                                                color={course.location.toLowerCase() === 'online' ? 'primary' : 'secondary'}
                                                variant={course.location.toLowerCase() === 'wimbledon' ? 'outlined' : 'filled'}
                                                sx={{
                                                    textTransform: 'capitalize',
                                                    bgcolor: course.location.toLowerCase() === 'wimbledon' ? '#f3e5f5' : undefined,
                                                    color: course.location.toLowerCase() === 'wimbledon' ? '#7b1fa2' : undefined,
                                                    borderColor: course.location.toLowerCase() === 'wimbledon' ? '#7b1fa2' : undefined
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>{course.fee}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                disabled={course.status === 'Full' || addingToCart}
                                                onClick={() => handleRegisterClick(course)}
                                                sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
                                            >
                                                {addingToCart ? 'Adding...' : (course.status === 'Full' ? 'Full' : 'Register Now')}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>

            {/* Snackbar for cart notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
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
