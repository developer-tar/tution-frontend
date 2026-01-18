import React from 'react';
import {
    Box,
    Grid,
    Typography,
    Button,
    Card,
    CardContent,
    Container,
    LinearProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { containerStyles, h2, spainColor } from '../style';

export default function Year3FormatsSection({ data }) {
    const navigate = useNavigate();

    const handleRegisterClick = (format) => {
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

        // Navigate to signup page
        navigate('/signup');
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
            priceId: firstPriceOption ? firstPriceOption.price_id : null,
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
                                        onClick={() => handleRegisterClick(f)}
                                        sx={{ bgcolor: f.headerBg, color: 'white', fontWeight: 700, px: 4, py: 1.5, borderRadius: 3, textTransform: 'uppercase', '&:hover': { bgcolor: f.headerBg, transform: 'translateY(-2px)' } }}
                                    >
                                        Register Now
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
