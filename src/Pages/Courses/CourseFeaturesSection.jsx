import React from 'react';
import {
    Box,
    Grid,
    Typography,
    Container,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { containerStyles, h2, spainColor } from '../style';

export default function CourseFeaturesSection({ data }) {
    if (!data) {
        return null;
    }

    const onlineFeatures = data.online_mode_features || [];
    const inPersonFeatures = data.in_person_mode_features || [];
    const generalFeatures = data.features || [];

    return (
        <Box component="section" sx={{ bgcolor: '#f8f9fa', py: { xs: 4, sm: 6, md: 8 } }}>
            <Container sx={containerStyles}>
                <Box textAlign="center" mb={4}>
                    <Typography variant="h2" sx={h2}>
                        Course{' '}
                        <Box component="span" sx={spainColor}>
                            Features
                        </Box>
                    </Typography>
                </Box>

                {/* Mode-specific features side by side */}
                {(onlineFeatures.length > 0 || inPersonFeatures.length > 0) && (
                    <Grid container spacing={4} sx={{ mb: 6 }}>
                        {onlineFeatures.length > 0 && (
                            <Grid item xs={12} md={6}>
                                <Card elevation={0} sx={{ height: '100%', bgcolor: '#fff' }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                fontWeight: 600, 
                                                mb: 2,
                                                color: '#1976d2',
                                                textAlign: 'center'
                                            }}
                                        >
                                            Online Mode Features
                                        </Typography>
                                        <List sx={{ p: 0 }}>
                                            {onlineFeatures.map((feature, index) => (
                                                <ListItem key={index} sx={{ px: 0, py: 1 }}>
                                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                                        <CheckCircleOutlineIcon 
                                                            sx={{ color: '#1976d2', fontSize: 20 }} 
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText 
                                                        primary={feature}
                                                        sx={{ 
                                                            '& .MuiListItemText-primary': {
                                                                fontSize: '0.875rem',
                                                                lineHeight: 1.5
                                                            }
                                                        }}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}

                        {inPersonFeatures.length > 0 && (
                            <Grid item xs={12} md={6}>
                                <Card elevation={0} sx={{ height: '100%', bgcolor: '#fff' }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                fontWeight: 600, 
                                                mb: 2,
                                                color: '#d32f2f',
                                                textAlign: 'center'
                                            }}
                                        >
                                            In-Person Mode Features
                                        </Typography>
                                        <List sx={{ p: 0 }}>
                                            {inPersonFeatures.map((feature, index) => (
                                                <ListItem key={index} sx={{ px: 0, py: 1 }}>
                                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                                        <CheckCircleOutlineIcon 
                                                            sx={{ color: '#d32f2f', fontSize: 20 }} 
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText 
                                                        primary={feature}
                                                        sx={{ 
                                                            '& .MuiListItemText-primary': {
                                                                fontSize: '0.875rem',
                                                                lineHeight: 1.5
                                                            }
                                                        }}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}
                    </Grid>
                )}

                {/* General course features */}
                {generalFeatures.length > 0 && (
                    <Box>
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                fontWeight: 600, 
                                mb: 3,
                                textAlign: 'center',
                                color: '#333'
                            }}
                        >
                            Course Highlights
                        </Typography>
                        <Grid container spacing={2}>
                            {generalFeatures.map((feature, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <Card elevation={0} sx={{ bgcolor: '#fff', height: '100%' }}>
                                        <CardContent sx={{ p: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                <CheckCircleOutlineIcon 
                                                    sx={{ 
                                                        color: '#4caf50', 
                                                        mr: 1, 
                                                        mt: 0.5,
                                                        fontSize: 20 
                                                    }} 
                                                />
                                                <Typography 
                                                    sx={{ 
                                                        fontSize: '0.875rem',
                                                        lineHeight: 1.5,
                                                        color: '#555'
                                                    }}
                                                >
                                                    {feature}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </Container>
        </Box>
    );
}
