import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardMedia,
  Container,
  Button,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { button, containerStyles, h2, icon, spainColor } from "../style";
import { Link } from "react-router-dom";
import api from "../../api";
import CommonSkeleton from "../../components/CommonSkeleton"; 

export default function ProgrammesSection() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/course/view");
        const courseData = response.data?.data?.data || [];
        setCourses(courseData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <Box sx={{ py: 10, background: "#f9f9ff" }}>
      <Container sx={containerStyles}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="caption"
            sx={{
              backgroundColor: "#E6E7FF",
              px: 2,
              py: 0.5,
              borderRadius: 20,
              fontWeight: 600,
              color: "#5C60EF",
            }}
          >
            POPULAR COURSE
          </Typography>
          <Typography variant="h4" sx={h2}>
            Our{" "}
            <Box component="span" sx={spainColor}>
              11+
            </Box>
            <Box component="span" sx={spainColor}>
              Programmes
            </Box>
          </Typography>
        </Box>

        {/* Course Cards or Skeleton */}
        {loading ? (
          <CommonSkeleton count={4} />
        ) : (
          <Grid container spacing={3}>
            {courses.map((item, idx) => (
              <Grid item xs={12} md={6} key={idx}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    borderRadius: 3,
                    overflow: "hidden",
                    background: "#fff",
                    boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.05)",
                    height: { xs: "auto", sm: 220 },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={item.image}
                    alt={item.name}
                    sx={{
                      width: { xs: "100%", sm: 180 },
                      height: { xs: 200, sm: "100%" },
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />

                  <Box
                    sx={{
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      flexGrow: 1,
                    }}
                  >
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Subjects:</strong> {item.subjects?.join(", ")}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>School Year:</strong> {item.acdemicyear}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Course Length:</strong> {item.start_end_date} ({item.weeks_count} weeks)
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Location:</strong> {item.locations?.join(", ")}
                      </Typography>
                    </Box>

                    <Box>
                      <Link to={`/course/${item.slug}`} style={{ textDecoration: "none" }}>
                        <Button disableElevation sx={button}>
                          View Course
                          <Box sx={icon}>
                            <ArrowForwardIcon sx={{ fontSize: 20, color: "#EF2A1E" }} />
                          </Box>
                        </Button>
                      </Link>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
