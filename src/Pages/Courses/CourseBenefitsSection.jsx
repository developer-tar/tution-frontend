
import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { containerStyles, h2, spainColor } from '../style';

export default function CourseBenefitsSection() {
    const benefits = [
        {
            img: "/assets/images/infographic-1.svg",
            title: 'Original material',
            subtitle: 'All coursework resources included',
        },
        {
            img: "/assets/images/personal-2.svg",
            title: 'Fundamental 11+ learning',
            subtitle: 'Provides excellent basis for 11+ preparation',
        },
        {
            img: "/assets/images/smartphone-3.svg",
            title: 'Small class sizes',
            subtitle: 'Max. 10 children per class for personalised attention',
        },
        {
            img: "/assets/images/server-4.svg",
            title: 'Rapid improvement',
            subtitle: 'Focus on core literacy and numeracy skills',
        },
    ];

    return (
        <Box
            component="section"
            sx={{
                backgroundColor: '#F9F9FF',
                py: { xs: 4, sm: 6, md: 8 },
                px: { xs: 2, sm: 4, md: 6 },
            }}
        >
            <Container sx={containerStyles}>
                {/* Section Title */}
                <Box mb={4} sx={{textAlign:"center"}}>
                <Typography
                    variant="h2"
                    sx={h2}
                >
                    Key Course{' '}
                    <Box
                        component="span"
                        sx={spainColor}
                    >
                        Benefits
                    </Box>
                </Typography></Box>

                <Grid container spacing={4}>
                    {/* Left: 2x2 Benefit cards */}
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={2}>
                            {benefits.map((b, idx) => (
                                <Grid item xs={12} sm={6} key={idx}>
                                    <Box
                                        sx={{
                                            bgcolor: '#fff',
                                            borderRadius: '5px',
                                            p: 3,
                                            textAlign: 'center',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: 1,
                                        }}
                                    >
                                        <img src={b.img} alt="" />
                                        <Typography
                                            variant="subtitle1"
                                            sx={{ fontWeight: 'bold', mt: 2 }}
                                        >
                                            {b.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: 'text.secondary', mt: 1 }}
                                        >
                                            {b.subtitle}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                    {/* Right: Coursebook showcase */}
                    <Grid item xs={12} md={6} sx={{ mt: { xs: 4, md: 0 } }}>
                        <Box
                            sx={{
                                bgcolor: '#fff',
                                borderRadius: '5px',
                                p: 3,
                                position: 'relative',
                                textAlign: 'center',
                                boxShadow: 1,
                            }}
                        >
                            <Box sx={{ textAlign: 'center', mb: 2 }}>
                                    <Typography
                                        variant="button"
                                        sx={{ fontSize: '0.875rem', color: '#000' }}
                                    >
                                        English/Maths Coursebooks
                                    </Typography>
                                </Box>

                                {/* Coursebook images */}
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                                    <Box
                                        component="img"
                                        src="assets/images/key-img.png"
                                        alt="English Coursebook"
                                        sx={{
                                            width: { xs: 100, sm: 120, md: 140 },
                                            borderRadius: '8px',
                                            boxShadow: 2,
                                            transition: 'transform 0.3s ease',
                                            '&:hover': { transform: 'scale(1.05)' }
                                        }}
                                    />
                                    <Box
                                        component="img"
                                        src="assets/images/key-img.png"
                                        alt="Maths Coursebook"
                                        sx={{
                                            width: { xs: 100, sm: 120, md: 140 },
                                            borderRadius: '8px',
                                            boxShadow: 2,
                                            transition: 'transform 0.3s ease',
                                            '&:hover': { transform: 'scale(1.05)' }
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
