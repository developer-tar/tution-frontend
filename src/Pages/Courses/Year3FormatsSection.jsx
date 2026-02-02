import React, { useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    Button,
    Card,
    CardContent,
    Container,
    LinearProgress,
    Snackbar,
    Alert
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addToCart, fetchCart } from '../../redux/slices/cartSlice';
import { containerStyles, h2, spainColor } from '../style';

export default function Year3FormatsSection({ data }) {
    const dispatch = useDispatch();
    const [addingToCart, setAddingToCart] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleRegisterClick = async (format) => {
        console.log('Register Now clicked for format:', format);
        console.log('Course data:', data);

        // Store course data in localStorage for signup page
        const cartData = {
            courseData: data,
            courseName: data.name,
            courseSlug: data.slug,
            selectedMode: format.mode,
            selectedDuration: format.duration,
            selectedPrice: format.price,
            selectedPriceId: format.priceId,
            timestamp: Date.now()
        };

        localStorage.setItem('courseCartData', JSON.stringify(cartData));
        console.log('Course data saved to localStorage:', cartData);

        // Get course ID
        const courseId = data?.id || data?.course_id;
        console.log('Course ID found:', courseId);
        console.log('Format priceId:', format.priceId);
        console.log('Price according to mode:', data.price_according_to_mode);

        // Try to get a valid price_id if format.priceId is null or invalid
        let priceId = format.priceId;
        if (!priceId || (typeof priceId === 'string' && !priceId.startsWith('price_'))) {
            console.log('Price ID is null or invalid, trying to find valid one...');
            // Try to get from price_according_to_mode structure
            if (data.price_according_to_mode && format.mode) {
                const modeData = data.price_according_to_mode[format.mode];
                if (modeData) {
                    // Try selected duration first
                    if (format.duration && modeData[format.duration]?.price_id) {
                        const rawPriceId = modeData[format.duration].price_id;
                        if (rawPriceId && typeof rawPriceId === 'string' && rawPriceId.startsWith('price_')) {
                            priceId = rawPriceId;
                            console.log('Found valid price_id from selected duration:', priceId);
                        }
                    }

                    // If still not found, try all durations
                    if (!priceId || !priceId.startsWith('price_')) {
                        for (const durationKey of Object.keys(modeData)) {
                            const rawPriceId = modeData[durationKey]?.price_id;
                            if (rawPriceId && typeof rawPriceId === 'string' && rawPriceId.startsWith('price_')) {
                                priceId = rawPriceId;
                                console.log('Found valid price_id from duration:', durationKey, priceId);
                                break;
                            }
                        }
                    }
                }
            }
        }

        console.log('Final price_id to use:', priceId);
        console.log('Is price_id valid?', priceId && typeof priceId === 'string' && priceId.startsWith('price_'));

        if (!priceId || (typeof priceId === 'string' && !priceId.startsWith('price_'))) {
            console.error('❌ No valid Stripe price_id found!');
            console.error('Available price data:', {
                formatPriceId: format.priceId,
                mode: format.mode,
                duration: format.duration,
                priceAccordingToMode: data.price_according_to_mode
            });
            setSnackbar({
                open: true,
                message: 'Price information is missing. Please contact support.',
                severity: 'error'
            });
            setAddingToCart(false);
            return;
        }

        if (courseId) {
            console.log('Adding course to cart, course ID:', courseId);
            setAddingToCart(true);
            try {
                const token = localStorage.getItem('token');
                const payload = {
                    product_type: "course",
                    product_id: courseId,
                    quantity: 1,
                    price_id: priceId
                };

                console.log('Cart payload:', payload);
                console.log('User token exists:', !!token);
                console.log('Calling API: POST /api/cart/add');

                // Call API for both logged-in and guest users
                const result = await dispatch(addToCart(payload));
                console.log('Add to cart API response:', result);

                if (addToCart.fulfilled.match(result)) {
                    console.log('✅ Course added to cart successfully via API');

                    if (token) {
                        // Logged-in user: fetch updated cart from server
                        console.log('Fetching updated cart from server...');
                        await dispatch(fetchCart());
                        localStorage.setItem('cartUpdated', Date.now().toString());
                        window.dispatchEvent(new StorageEvent('storage', { key: 'cartUpdated' }));
                        window.dispatchEvent(new Event('cartUpdated'));
                        console.log('✅ Cart updated and synced');
                    } else {
                        // Guest user: also update localStorage for frontend display
                        console.log('Guest user - updating localStorage for display');
                        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
                        const existingItem = guestCart.find(
                            item => item.product_id === courseId && item.product_type === 'course'
                        );

                        if (existingItem) {
                            existingItem.quantity += 1;
                            console.log('Course already in guest cart, incrementing quantity');
                        } else {
                            // Parse price from format.price string (e.g., "£1,465" -> 1465)
                            let coursePrice = 0;
                            if (format.price) {
                                const priceMatch = format.price.toString().replace(/[£,]/g, '').match(/[\d.]+/);
                                if (priceMatch) {
                                    coursePrice = parseFloat(priceMatch[0]);
                                }
                            }

                            const newCartItem = {
                                ...payload,
                                course_name: data.name,
                                course_image: data.image || '/assets/images/product-img.png',
                                course_price: coursePrice,
                                course_fee: format.price || '£0',
                                selectedMode: format.mode,
                                selectedDuration: format.duration,
                            };
                            guestCart.push(newCartItem);
                            console.log('Added new course to guest cart:', newCartItem);
                        }

                        localStorage.setItem('guestCart', JSON.stringify(guestCart));
                        console.log('Guest cart saved to localStorage:', guestCart);

                        // Trigger guest cart update event to refresh navbar and cart display
                        window.dispatchEvent(new Event('guestCartUpdated'));
                        window.dispatchEvent(new StorageEvent('storage', {
                            key: 'guestCart',
                            newValue: JSON.stringify(guestCart)
                        }));
                        console.log('✅ Guest cart updated in localStorage');
                    }

                    // Show success message
                    setSnackbar({
                        open: true,
                        message: 'Course added to cart successfully!',
                        severity: 'success'
                    });

                    // Navigate to signup page after a short delay
                    setTimeout(() => {
                        console.log('Navigating to signup page');
                        window.location.href = '/signup';
                    }, 1500);
                } else {
                    console.error('❌ Failed to add to cart:', result.payload || result.error);
                    setSnackbar({
                        open: true,
                        message: 'Failed to add course to cart. You can still proceed.',
                        severity: 'warning'
                    });
                    setTimeout(() => {
                        window.location.href = '/signup';
                    }, 1500);
                }
            } catch (error) {
                console.error('❌ Error adding course to cart:', error);
                setSnackbar({
                    open: true,
                    message: 'Failed to add course to cart. You can still proceed.',
                    severity: 'warning'
                });
                setTimeout(() => {
                    window.location.href = '/signup';
                }, 1500);
            } finally {
                setAddingToCart(false);
            }
        } else {
            console.error('❌ Course ID is missing!');
            setSnackbar({
                open: true,
                message: 'Course information is missing. Please try again.',
                severity: 'error'
            });
            setTimeout(() => {
                window.location.href = '/signup';
            }, 1500);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    // Check if data is missing or invalid
    if (!data) {
        console.warn('Year3FormatsSection: Missing course data');
        return (
            <Box component="section" sx={{ bgcolor: '#fff', px: { xs: 2, sm: 4, md: 6 }, py: { xs: 4, sm: 6, md: 8 } }}>
                <Container sx={containerStyles}>
                    <Box textAlign="center" sx={{ py: 5 }}>
                        <Typography variant="h6">Course information unavailable</Typography>
                        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                            Course details are not available at the moment. Please try again later.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        );
    }

    // Check if modes data is missing or empty
    if (!Array.isArray(data.modes) || data.modes.length === 0) {
        console.warn('Year3FormatsSection: Missing or empty modes array', {
            hasModes: Array.isArray(data.modes),
            modesLength: data.modes?.length,
            dataKeys: Object.keys(data)
        });
        return (
            <Box component="section" sx={{ bgcolor: '#fff', px: { xs: 2, sm: 4, md: 6 }, py: { xs: 4, sm: 6, md: 8 } }}>
                <Container sx={containerStyles}>
                    <Box textAlign="center" sx={{ py: 5 }}>
                        <Typography variant="h6">No course formats available</Typography>
                        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                            Course formats for this course are not available at the moment. Please contact us for more information.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        );
    }


    const formats = data.modes.map((mode, idx) => {
        // Get pricing for this mode
        const pricing = data.price_according_to_mode?.[mode];
        const duration = pricing ? Object.keys(pricing)[0] : null;
        const firstPriceOption = pricing && duration ? pricing[duration] : null;
        const price = firstPriceOption ? firstPriceOption.price : '£1,465';

        // Get price_id - try to find a valid Stripe price ID (starts with 'price_')
        let priceId = null;
        if (firstPriceOption?.price_id) {
            // Check if it's a valid Stripe price ID
            if (typeof firstPriceOption.price_id === 'string' && firstPriceOption.price_id.startsWith('price_')) {
                priceId = firstPriceOption.price_id;
            }
        }

        // If no valid price_id found, try all durations for this mode
        if (!priceId && pricing) {
            for (const durationKey of Object.keys(pricing)) {
                const priceOption = pricing[durationKey];
                if (priceOption?.price_id &&
                    typeof priceOption.price_id === 'string' &&
                    priceOption.price_id.startsWith('price_')) {
                    priceId = priceOption.price_id;
                    break; // Use first valid Stripe price ID found
                }
            }
        }

        // Get mode-specific features
        const modeFeatures = mode === 'Online'
            ? data.online_mode_features || data.features || []
            : data.in_person_mode_features || data.features || [];

        return {
            key: `${mode.toLowerCase().replace(/\s/g, '')}-${idx}`,
            title: `${mode}: Group`,
            subtitle: mode === 'Online' ? 'Flexible Learning' : 'Max. class size of 9',
            headerBg: idx % 2 === 0 ? '#3944BC' : '#D6232A',
            price: price,
            features: modeFeatures,
            mode: mode,
            duration: duration,
            priceId: priceId,
        };
    });

    return (
        <Box component="section" sx={{ bgcolor: '#fff', px: { xs: 2, sm: 4, md: 6 }, py: { xs: 4, sm: 6, md: 8 } }}>
            <Container sx={containerStyles}>
                {/* Image/Text Block */}
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box component="img" src="/assets/images/year-img1.png" alt="Child studying" sx={{ width: '100%', borderRadius: 2 }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                            {data.name || 'Course'} Overview
                        </Typography>
                        <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: 'text.secondary' }}>
                            {data.description ? data.description.substring(0, 150) + '...' : 'This course provides comprehensive learning experience for students.'}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6} order={{ xs: 3, md: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                            Subjects Covered
                        </Typography>
                        <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: 'text.secondary' }}>
                            {data.subjects && data.subjects.length > 0 ? `This course covers: ${data.subjects.join(', ')}.` : 'Comprehensive subject coverage designed for academic excellence.'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} order={{ xs: 2, md: 4 }}>
                        <Box component="img" src="/assets/images/year-img2.png" alt="Tutor and child" sx={{ width: '100%', borderRadius: 2 }} />
                    </Grid>
                </Grid>

                {/* Section Heading */}
                <Box textAlign="center" mt={{ xs: 4, sm: 6 }}>
                    <Typography variant="h2" sx={h2}>
                        {data.name || 'Course'} Formats{' '}
                        <Box component="span" sx={spainColor}>
                            {data.acdemicyear || '2025-2026'}
                        </Box>
                    </Typography>
                    <Typography sx={{ mt: 1, fontSize: { xs: '0.9rem', sm: '1rem' }, color: 'text.secondary' }}>
                        {data.start_end_date ? `Course Duration: ${data.start_end_date} (${data.weeks_count || 0} weeks)` : 'Find the best style for your child\'s way of learning!'}
                    </Typography>
                </Box>

                {/* Format Cards */}
                <Grid container spacing={4} justifyContent="center">
                    {formats.map((f, index) => (
                        <Grid item xs={12} sm={6} md={6} key={f.key}>
                            <Card elevation={3} sx={{ borderRadius: 3, backgroundColor: '#fff', height: '100%', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 40px rgba(0,0,0,0.15)' } }}>
                                <Box sx={{ bgcolor: f.headerBg, color: '#fff', py: 3, px: 3, textAlign: 'center' }}>
                                    <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 0.5 }}>Year 3</Typography>
                                    <Typography sx={{ fontSize: '0.9rem', opacity: 0.95 }}>{f.title}</Typography>
                                </Box>
                                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography sx={{ fontWeight: 800, fontSize: '3rem', color: f.headerBg, mb: 1 }}>{f.price}</Typography>
                                    <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 3 }}>{f.subtitle}</Typography>
                                    <Box sx={{ mb: 3 }}>
                                        {f.features.map((feature, i) => (
                                            <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                                                <span style={{ color: f.headerBg, marginRight: '8px', fontSize: '18px' }}>✓</span>
                                                <Typography sx={{ fontSize: '0.875rem', textAlign: 'left' }}>{feature}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        disabled={addingToCart}
                                        onClick={() => handleRegisterClick(f)}
                                        sx={{ bgcolor: f.headerBg, color: 'white', fontWeight: 700, px: 4, py: 1.5, borderRadius: 3, textTransform: 'uppercase', '&:hover': { bgcolor: f.headerBg, transform: 'translateY(-2px)' }, '&:disabled': { opacity: 0.7 } }}
                                    >
                                        {addingToCart ? 'Adding...' : 'Register Now'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
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
