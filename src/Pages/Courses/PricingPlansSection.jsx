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
import { containerStyles, h2, spainColor } from '../style';

export default function PricingPlansSection({ data, filters }) {

    const handlePlanClick = (plan) => {
        
        // Get price_id from price_according_to_mode based on selected plan
        let priceId = null;
        if (data.price_according_to_mode && 
            data.price_according_to_mode[plan.mode] && 
            data.price_according_to_mode[plan.mode][plan.duration]) {
            priceId = data.price_according_to_mode[plan.mode][plan.duration].price_id;
        }
        
        
        // Store plan data in localStorage for add-to-cart page
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
        
        // Navigate to add-to-cart page
        window.location.href = '/add-to-cart';
    };

    if (!data || !data.price_according_to_mode) {
        return (
            <Box component="section" sx={{ bgcolor: '#f8f9fa', py: { xs: 4, sm: 6, md: 8 } }}>
                <Container sx={containerStyles}>
                    {/* Loading Progress Bar for missing data */}
                    <LinearProgress 
                        sx={{ 
                            height: 3,
                            backgroundColor: '#e3f2fd',
                            mb: 3,
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: '#1976d2'
                            }
                        }} 
                    />
                    {/* Commented out gradient version */}
                    {/* 
                    <LinearProgress 
                        sx={{ 
                            height: 3,
                            backgroundColor: '#f0f0f0',
                            mb: 3,
                            '& .MuiLinearProgress-bar': {
                                backgroundImage: 'linear-gradient(90deg, #4450A5 0%, #EF2A1E 100%)'
                            }
                        }} 
                    />
                    */}
                    <Box textAlign="center">
                        <Typography variant="h6">Loading pricing plans...</Typography>
                        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                            Please wait while we fetch the pricing information
                        </Typography>
                        {/* Commented out original no data message */}
                        {/* <Typography variant="h6">No Data Found</Typography> */}
                    </Box>
                </Container>
            </Box>
        );
    }

    // Show all plans initially or filter based on applied filters
    const getAllPricingPlans = () => {
        const allPlans = [];
        
        Object.entries(data.price_according_to_mode).forEach(([mode, pricing]) => {
            // Apply filters if provided
            if (filters && filters.format !== 'All Formats' && filters.format !== mode) {
                return;
            }
            
            Object.entries(pricing).forEach(([duration, details]) => {
                // Apply installment filter if provided
                if (filters && filters.installment !== 'All Installment' && filters.installment !== duration) {
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
        return (
            <Box component="section" sx={{ bgcolor: '#f8f9fa', py: { xs: 4, sm: 6, md: 8 } }}>
                <Container sx={containerStyles}>
                    {/* Loading Progress Bar for filtered results */}
                    <LinearProgress 
                        sx={{ 
                            height: 3,
                            backgroundColor: '#e3f2fd',
                            mb: 3,
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: '#1976d2'
                            }
                        }} 
                    />
                    {/* Commented out gradient version */}
                    {/* 
                    <LinearProgress 
                        sx={{ 
                            height: 3,
                            backgroundColor: '#f0f0f0',
                            mb: 3,
                            '& .MuiLinearProgress-bar': {
                                backgroundImage: 'linear-gradient(90deg, #4450A5 0%, #EF2A1E 100%)'
                            }
                        }} 
                    />
                    */}
                    <Box textAlign="center">
                        <Typography variant="h6">Loading filtered plans...</Typography>
                        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                            Applying your selected filters
                        </Typography>
                        {/* Commented out original no data message */}
                        {/* <Typography variant="h6">No Data Found</Typography> */}
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
                        Our Year 3 Platform{' '}
                        <Box component="span" sx={spainColor}>
                            Packages
                        </Box>
                    </Typography>
                </Box>


                {pricingPlans.length === 1 ? (
                    <Box display="flex" justifyContent="center">
                        <Card elevation={3} sx={{ borderRadius: 3, backgroundColor: '#fff', maxWidth: 400, width: '100%', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 40px rgba(0,0,0,0.15)' } }}>
                            {pricingPlans.map((plan, index) => (
                                <Box key={`${plan.mode}-${plan.duration}`}>
                                    <Box sx={{ bgcolor: getCardColor(index), color: '#fff', py: 3, px: 3, textAlign: 'center' }}>
                                        <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 0.5 }}>Year 3</Typography>
                                        <Typography sx={{ fontSize: '0.9rem', opacity: 0.95 }}>{plan.duration.toLowerCase()} - {plan.mode}</Typography>
                                    </Box>
                                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography sx={{ fontWeight: 800, fontSize: '3rem', color: getCardColor(index), mb: 1 }}>{plan.price}</Typography>
                                        {plan.savings && <Box sx={{ bgcolor: '#ff4444', color: 'white', px: 2, py: 0.5, borderRadius: 2, fontSize: '0.75rem', fontWeight: 600, display: 'inline-block', mb: 2 }}>{plan.savings}</Box>}
                                        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 3 }}>{plan.mode === 'Online' ? 'SAVING 30% on the monthly subscription' : 'Minimum period one month. Cancel anytime subscription'}</Typography>
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
                                        <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 0.5 }}>Year 3</Typography>
                                        <Typography sx={{ fontSize: '0.9rem', opacity: 0.95 }}>{plan.duration.toLowerCase()} - {plan.mode}</Typography>
                                    </Box>
                                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography sx={{ fontWeight: 800, fontSize: '3rem', color: getCardColor(index), mb: 1 }}>{plan.price}</Typography>
                                        {plan.savings && <Box sx={{ bgcolor: '#ff4444', color: 'white', px: 2, py: 0.5, borderRadius: 2, fontSize: '0.75rem', fontWeight: 600, display: 'inline-block', mb: 2 }}>{plan.savings}</Box>}
                                        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 3 }}>{plan.mode === 'Online' ? 'SAVING 30% on the monthly subscription' : 'Minimum period one month. Cancel anytime subscription'}</Typography>
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
                )}
            </Container>
        </Box>
    );
}
