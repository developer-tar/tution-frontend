import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { containerStyles } from "../style";
import { Link } from "react-router-dom";
import api from "../../api";
import CommonSkeleton from "../../components/CommonSkeleton"; 

export default function CourseTable() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/course/view");
        if (response.data?.success) {
          setCourses(response.data.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <Box sx={{ py: 8 }}>
      <Container sx={containerStyles}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 4,
            flexWrap: "wrap",
          }}
        >
          <Select
            defaultValue=""
            displayEmpty
            sx={{
              width: 160,
              height: 45,
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              padding: "0 16px",
            }}
          >
            <MenuItem value="">
              <em>Course Format</em>
            </MenuItem>
            <MenuItem value="Online">Online</MenuItem>
            <MenuItem value="In person">In person</MenuItem>
          </Select>

          <Select
            defaultValue=""
            displayEmpty
            sx={{
              width: 160,
              height: 45,
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              padding: "0 16px",
            }}
          >
            <MenuItem value="">
              <em>Course Location</em>
            </MenuItem>
            <MenuItem value="London">London</MenuItem>
            <MenuItem value="Manchester">Manchester</MenuItem>
          </Select>

          <Select
            defaultValue=""
            displayEmpty
            sx={{
              width: 160,
              height: 45,
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              padding: "0 16px",
            }}
          >
            <MenuItem value="">
              <em>Course Day</em>
            </MenuItem>
            <MenuItem value="Saturday">Saturday</MenuItem>
            <MenuItem value="Sunday">Sunday</MenuItem>
          </Select>
        </Box>

        {/* Table Section */}
        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F9F9FF" }}>
                <TableCell sx={{ fontWeight: "bold", fontSize: "14px", py: 2 }}>Course</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "14px", py: 2 }}>Details</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "14px", py: 2 }}>Registration Fee</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "14px", py: 2 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <CommonSkeleton type="table" rows={5} cols={4} />
              ) : courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No courses available.
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course, index) => (
                  <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#fafafa" } }}>
                    <TableCell sx={{ py: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <img
                          src={course.image}
                          alt={course.name}
                          style={{
                            width: 40,
                            height: 40,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                        <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                          {course.name}: READING {course.acdemicyear}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: "14px", py: 2 }}>
                      {course.start_end_date}
                    </TableCell>
                    <TableCell sx={{ fontSize: "14px", py: 2 }}>
                      £{course.price}
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Link to={`/course/${course.slug}`} style={{ textDecoration: "none" }}>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#d32f2f",
                            color: "#fff",
                            borderRadius: "20px",
                            padding: "6px 16px",
                            "&:hover": {
                              backgroundColor: "#b71c1c",
                            },
                          }}
                        >
                          Register Now
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}
