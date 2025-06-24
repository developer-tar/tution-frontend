// src/components/Year3FormatsSection.jsx
import React from 'react';
import {
    Box,
    Grid,
    Typography,
    Button,
    Card,
    CardContent,
    Container,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { button, containerStyles, h2, icon, spainColor } from '../style';
import { Link } from 'react-router-dom';

const formats = [
    {
        key: 'inperson',
        title: 'In-Person: Group',
        subtitle: 'Max. class size of 9',
        headerBg: '#3944BC',
        price: '£1,465',
        details: [
            '£100 registration fee and 7× £195 monthly payments (Sibling discount: £70 off)',
            'All exclusive coursework resources included',
            'Cover maths and English',
            'Builds a foundation for Year 4',
            '1 hour 45 mins of weekly teaching',
            'Small size classes (maximum of 9 children in each class)',
            'Priority booking for Year 4',
            '1–2 hours of homework per week',
            'Regular recap and review to consolidate knowledge',
            'Educational games and activities to aid learning',
            'Answers provided for all classwork and homework questions',
        ],
    },
    {
        key: 'online',
        title: 'Online: Group',
        subtitle: 'Max. class size of 9',
        headerBg: '#D6232A',
        price: '£1,465',
        details: [
            '£100 registration fee and 7× £195 monthly payments (Sibling discount: £70 off)',
            'All-inclusive 37 week course (September to July)',
            'Cover maths and English',
            'Builds a foundation for Year 4',
            '1 hour 45 mins of weekly teaching',
            'Small size classes (maximum of 9 children in each class)',
            'Priority booking for Year 4',
            '1–2 hours of homework per week',
            'Regular recap and review to consolidate knowledge',
            'Educational games and activities to aid learning',
            'Answers provided for all classwork and homework questions',
        ],
    },
];

export default function Year3FormatsSection() {
    return (
        <Box component="section" sx={{ bgcolor: '#fff', px: { xs: 2, sm: 4, md: 6 }, py: { xs: 4, sm: 6, md: 8 } }}>
            <Container sx={containerStyles}>

                {/* Top Image/Text Pairs */}
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box component="img"
                            src="/assets/images/year-img1.png"
                            alt="Child studying"
                            sx={{ width: '100%', borderRadius: 2 }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                            Give your child a head start
                        </Typography>
                        <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: 'text.secondary' }}>
                            The course also provides a strong foundation for the Year 4 course, which then leads up to the preparation for 11+ entrance exams.
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6} order={{ xs: 3, md: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                            Specialist teaching
                        </Typography>
                        <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: 'text.secondary' }}>
                            The Year 3 Course covers the KS2 syllabus in a fun and engaging style, enabling pupils to consolidate the core literacy and numeracy skills needed for confidence in their day-to-day school life.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} order={{ xs: 2, md: 4 }}>
                        <Box component="img"
                            src="/assets/images/year-img2.png"
                            alt="Tutor and child"
                            sx={{ width: '100%', borderRadius: 2 }}
                        />
                    </Grid>
                </Grid>

                {/* Section Title */}
                <Box textAlign="center" mt={{ xs: 4, sm: 6 }}>
                    <Typography variant="h2" sx={h2}>
                        Year 3 Course{' '}
                        <Box
                            component="span"
                            sx={spainColor}
                        >
                            Formats 2024-25
                        </Box>
                    </Typography>
                    <Typography sx={{ mt: 1, fontSize: { xs: '0.9rem', sm: '1rem' }, color: 'text.secondary' }}>
                        Find the best style for your child’s way of learning!
                    </Typography>
                </Box>

                {/* Pricing Cards */}
                <Grid container spacing={4} mt={{ xs: 2, sm: 4 }}>
                    {formats.map((f) => (
                        <Grid item xs={12} sm={6} key={f.key}>
                            <Card elevation={0} sx={{ borderRadius: 2 ,backgroundColor:"#F6F6FD"}}>
                                {/* Header */}
                                <Box sx={{ bgcolor: f.headerBg, color: '#fff', py: 1.5, px: 3, borderTopLeftRadius: 8, borderTopRightRadius: 8 ,textAlign:"center"}}>
                                    <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                        {f.title}
                                    </Typography>
                                    <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                                        {f.subtitle}
                                    </Typography>
                                </Box>

                                <CardContent sx={{ pt: 2 }}>
                                    {/* Price */}
                                    <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
                                        {f.price}
                                    </Typography>

                                    {/* Details */}
                                    <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 1 }}>
                                        {f.details.map((d, i) => (
                                            <Box component="li" key={i} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                                                <CheckCircleOutlineIcon sx={{ color: f.headerBg, mr: 1, mt: '2px', fontSize: 20 }} />
                                                <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, lineHeight: 1.4 }}>
                                                    {d}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>

                                    {/* Button */}
                                    <Box sx={{display:"flex",justifyContent:"center"}}>
                                         <Link to="/add-to-cart" style={{textDecoration:"none"}} >
                                    <Button
                                        disableElevation
                                        sx={button}
                                    >
                                        Register Now
                                        <Box
                                            sx={icon}
                                        >
                                            <ArrowForwardIcon sx={{ fontSize: 20, color: '#EF2A1E' }} />
                                        </Box>
                                    </Button>
                                    </Link></Box>

                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
