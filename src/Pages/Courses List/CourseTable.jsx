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
  Snackbar,
} from "@mui/material";
import { containerStyles } from "../style";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart, fetchCart } from "../../redux/slices/cartSlice";
import api from "../../api";
import CommonSkeleton from "../../components/CommonSkeleton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentIcon from "@mui/icons-material/Payment";

export default function CourseTable() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, message: "" });

  const dispatch = useDispatch();

  const [format, setFormat] = useState("Online");
  const [location, setLocation] = useState("London");
  const [day, setDay] = useState("Saturday");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/course/view");
        if (response.data?.success) {
          const courseList = response.data.data?.data || [];
          setCourses(courseList);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleAddToCart = (course) => {
    const payload = {
      product_type: "course",
      product_id: course.id,
      quantity: 1,
    };

    dispatch(addToCart(payload))
      .unwrap()
      .then(() => {
        setAlert({ open: true, message: "Added to cart!" });
        dispatch(fetchCart());
      })
      .catch((err) => {
        const errorMessage =
          typeof err === "string"
            ? err
            : err?.message || "Something went wrong";
        setAlert({ open: true, message: errorMessage });
      });
  };

  return (
    <Box sx={{ py: 8 }}>
      <Container sx={containerStyles}>
        {/* Filters */}
        <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
          <Select value={format} onChange={(e) => setFormat(e.target.value)} sx={{ width: 160, height: 45 }}>
            <MenuItem value=""><em>Course Format</em></MenuItem>
            <MenuItem value="Online">Online</MenuItem>
            <MenuItem value="In person">In person</MenuItem>
          </Select>
          <Select value={location} onChange={(e) => setLocation(e.target.value)} sx={{ width: 160, height: 45 }}>
            <MenuItem value=""><em>Course Location</em></MenuItem>
            <MenuItem value="London">London</MenuItem>
            <MenuItem value="Manchester">Manchester</MenuItem>
          </Select>
          <Select value={day} onChange={(e) => setDay(e.target.value)} sx={{ width: 160, height: 45 }}>
            <MenuItem value=""><em>Course Day</em></MenuItem>
            <MenuItem value="Saturday">Saturday</MenuItem>
            <MenuItem value="Sunday">Sunday</MenuItem>
          </Select>
        </Box>

        {/* Course Table */}
        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F9F9FF" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Course</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Details</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Fee</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <CommonSkeleton type="table" rows={5} cols={4} />
              ) : courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">No courses available.</TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course.id} sx={{ "&:hover": { backgroundColor: "#fafafa" } }}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <img
                          src={course.image || "https://via.placeholder.com/40"}
                          alt={course.name}
                          style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }}
                        />
                        <Typography sx={{ fontWeight: 500 }}>
                          {course.name}: READING {course.acdemicyear}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{course.start_end_date}</TableCell>
                    <TableCell>£{course.price}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                        <Button
                          variant="outlined"
                          startIcon={<ShoppingCartIcon />}
                          onClick={() => handleAddToCart(course)}
                          sx={{
                            borderRadius: "20px",
                            padding: "6px 16px",
                            fontSize: "13px",
                            borderColor: "#7F56D9",
                            color: "#7F56D9",
                            textTransform: "none",
                            "&:hover": {
                              backgroundColor: "#F3EBFF",
                              borderColor: "#6931D4",
                            },
                          }}
                        >
                          Add to Cart
                        </Button>

                        <Button
                          variant="contained"
                          startIcon={<PaymentIcon />}
                          component={Link}
                          to={`/checkout/${course.slug}`}
                          sx={{
                            backgroundColor: "#7F56D9",
                            color: "#fff",
                            borderRadius: "20px",
                            padding: "6px 16px",
                            fontSize: "13px",
                            textTransform: "none",
                            "&:hover": {
                              backgroundColor: "#6931D4",
                            },
                          }}
                        >
                          Buy Now
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Snackbar */}
        <Snackbar
          open={alert.open}
          autoHideDuration={3000}
          onClose={() => setAlert({ ...alert, open: false })}
          message={alert.message}
        />
      </Container>
    </Box>
  );
}
