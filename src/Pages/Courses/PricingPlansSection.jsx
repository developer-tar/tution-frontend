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

export default function PricingPlansSection({ data, filters }) {
    const navigate = useNavigate();

    const handlePlanClick = (plan) => {
        // Get price_id from price_according_to_mode based on selected plan
        let priceId = null;
        if (data.price_according_to_mode && 
            data.price_according_to_mode[plan.mode] && 
            data.price_according_to_mode[plan.mode][plan.duration]) {
            priceId = data.price_according_to_mode[plan.mode][plan.duration].price_id;
        }

        // Store plan data in localStorage for signup page
        const cartData = {
            courseData: data,
            selectedPlan: plan,
            courseName: data.name,
            courseSlug: data.slug,
            selectedMode: plan.mode,
            selectedDuration: plan.duration,
            selectedPrice: plan.price,
            selectedPriceId: priceId,
            timestamp: Date.now()
        };

        localStorage.setItem('courseCartData', JSON.stringify(cartData));

        // Navigate to signup page
        navigate('/signup');
    };

    if (!data || !data.price_according_to_mode) {
        console.warn('PricingPlansSection: Missing data or price_according_to_mode', {
            hasData: !!data,
            hasPricing: !!(data && data.price_according_to_mode),
            dataKeys: data ? Object.keys(data) : []
        });
        return (
            <Box component="section" sx={{ bgcolor: '#f8f9fa', py: { xs: 4, sm: 6, md: 8 } }}>
                <Container sx={containerStyles}>
                    <Box textAlign="center">
                        <Typography variant="h6">Pricing information unavailable</Typography>
                        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                            Pricing plans for this course are not available at the moment. Please contact us for more information.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        );
    }

    // Show all plans initially or filter based on applied filters
    const getAllPricingPlans = () => {
        const allPlans = [];
        
        // Check if price_according_to_mode exists and has data
        if (!data.price_according_to_mode || typeof data.price_according_to_mode !== 'object') {
            console.warn('price_according_to_mode is missing or invalid:', data.price_according_to_mode);
            return allPlans;
        }
        
        Object.entries(data.price_according_to_mode).forEach(([mode, pricing]) => {
            // Skip if pricing is not an object
            if (!pricing || typeof pricing !== 'object') {
                return;
            }
            
            // Apply filters if provided
            if (filters && filters.format && filters.format !== 'All Formats' && filters.format !== mode) {
                return;
            }
            
            Object.entries(pricing).forEach(([duration, details]) => {
                // Skip if details is not an object or missing price
                if (!details || typeof details !== 'object' || !details.price) {
                    return;
                }
                
                // Apply installment filter if provided
                if (filters && filters.installment && filters.installment !== 'All Installment' && filters.installment !== duration) {
                    return;
                }
                
                allPlans.push({
                    mode,
                    duration,
                    price: details.price,
                    priceId: details.price_id,
                    savings: duration === '6 MONTHS' ? 'SAVING 30%' : '',
                    period: duration === 'MONTHLY' ? 'per month' : `for ${duration.toLowerCase()}`,
                    buttonText: duration === '6 MONTHS' ? 'FIXED PERIOD' : duration === 'MONTHLY' ? 'FLEXIBLE' : 'FIXED PERIOD'
                });
            });
        });
        
        return allPlans;
    };

    const pricingPlans = getAllPricingPlans();

    if (pricingPlans.length === 0) {
        // Check if filters are applied
        const hasActiveFilters = filters && (filters.format !== 'All Formats' || filters.installment !== 'All Installment');
        
        return (
            <Box component="section" sx={{ bgcolor: '#f8f9fa', py: { xs: 4, sm: 6, md: 8 } }}>
                <Container sx={containerStyles}>
                    <Box textAlign="center">
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            {hasActiveFilters ? 'No plans match your filters' : 'No pricing plans available'}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                            {hasActiveFilters 
                                ? 'Try adjusting your filter selections to see more options.' 
                                : 'Pricing information for this course is currently unavailable. Please contact us for more details.'}
                        </Typography>
                    </Box>
                </Container>
            </Box>
        );
    }

    const getCardColor = (index) => {
        const colors = ['#FF6B35', '#4A90E2', '#50C878', '#9B59B6'];
        return colors[index % colors.length];
    };

    return (
        <Box component="section" sx={{ bgcolor: '#f8f9fa', py: { xs: 3, sm: 4, md: 5 } }}>
            <Container sx={containerStyles}>
                <Box textAlign="center" mb={3}>
                    <Typography variant="h2" sx={h2}>
                        Our {data.name} Platform{' '}
                        <Box component="span" sx={spainColor}>
                            Packages
                        </Box>
                    </Typography>
                </Box>


                {/* {pricingPlans.length === 1 ? (
                    <Box display="flex" justifyContent="center">
                        <Card elevation={3} sx={{ borderRadius: 3, backgroundColor: '#fff', maxWidth: 400, width: '100%', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 40px rgba(0,0,0,0.15)' } }}>
                            {pricingPlans.map((plan, index) => (
                                <Box key={`${plan.mode}-${plan.duration}`}>
                                    <Box sx={{ bgcolor: getCardColor(index), color: '#fff', py: 3, px: 3, textAlign: 'center' }}>
                                        <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 0.5 }}>{data.name}</Typography>
                                        <Typography sx={{ fontSize: '0.9rem', opacity: 0.95 }}>{plan.duration.toLowerCase()} - {plan.mode}</Typography>
                                    </Box>
                                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography sx={{ fontWeight: 800, fontSize: '3rem', color: getCardColor(index), mb: 1 }}>{plan.price}</Typography>
                                        {plan.savings && <Box sx={{ bgcolor: '#ff4444', color: 'white', px: 2, py: 0.5, borderRadius: 2, fontSize: '0.75rem', fontWeight: 600, display: 'inline-block', mb: 2 }}>{plan.savings}</Box>}
                                        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 3 }}></Typography>
                                        <Button 
                                            variant="contained" 
                                            size="large" 
                                            onClick={() => handlePlanClick(plan)}
                                            sx={{ 
                                                bgcolor: getCardColor(index), 
                                                color: 'white', 
                                                fontWeight: 700, 
                                                px: 4, 
                                                py: 1.5, 
                                                borderRadius: 3, 
                                                textTransform: 'uppercase', 
                                                '&:hover': { 
                                                    bgcolor: getCardColor(index), 
                                                    transform: 'translateY(-2px)' 
                                                },
                                                '&:disabled': {
                                                    bgcolor: '#ccc'
                                                }
                                            }}
                                        >
                                            {plan.buttonText}
                                        </Button>
                                    </CardContent>
                                </Box>
                            ))}
                        </Card>
                    </Box>
                ) : (
                    <Grid container spacing={4} justifyContent="center">
                        {pricingPlans.map((plan, index) => (
                            <Grid item xs={12} sm={6} md={6} key={`${plan.mode}-${plan.duration}`}>
                                <Card elevation={3} sx={{ borderRadius: 3, backgroundColor: '#fff', height: '100%', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 40px rgba(0,0,0,0.15)' } }}>
                                    <Box sx={{ bgcolor: getCardColor(index), color: '#fff', py: 3, px: 3, textAlign: 'center' }}>
                                        <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 0.5 }}>{data.name}</Typography>
                                        <Typography sx={{ fontSize: '0.9rem', opacity: 0.95 }}>{plan.duration.toLowerCase()} - {plan.mode}</Typography>
                                    </Box>
                                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography sx={{ fontWeight: 800, fontSize: '3rem', color: getCardColor(index), mb: 1 }}>{plan.price}</Typography>
                                        {plan.savings && <Box sx={{ bgcolor: '#ff4444', color: 'white', px: 2, py: 0.5, borderRadius: 2, fontSize: '0.75rem', fontWeight: 600, display: 'inline-block', mb: 2 }}>{plan.savings}</Box>}
                                        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 3 }}></Typography>
                                        <Button 
                                            variant="contained" 
                                            size="large" 
                                            onClick={() => handlePlanClick(plan)}
                                            sx={{ 
                                                bgcolor: getCardColor(index), 
                                                color: 'white', 
                                                fontWeight: 700, 
                                                px: 4, 
                                                py: 1.5, 
                                                borderRadius: 3, 
                                                textTransform: 'uppercase', 
                                                '&:hover': { 
                                                    bgcolor: getCardColor(index), 
                                                    transform: 'translateY(-2px)' 
                                                },
                                                '&:disabled': {
                                                    bgcolor: '#ccc'
                                                }
                                            }}
                                        >
                                            {plan.buttonText}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )} */}
            </Container>
        </Box>
    );
}
