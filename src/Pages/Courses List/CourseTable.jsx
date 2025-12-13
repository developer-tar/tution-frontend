import React, { useEffect, useMemo, useState } from "react";
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
  Pagination,
  Grid,
  Chip,
} from "@mui/material";
import { containerStyles } from "../style";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart, fetchCart } from "../../redux/slices/cartSlice";
import api from "../../api";
import CommonSkeleton from "../../components/CommonSkeleton";
import CommonModal from "../../components/Modal";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SchoolIcon from "@mui/icons-material/School";

export default function CourseTable() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [links, setLinks] = useState([]);
  // const [showAll] = useState(true); // COMMENTED OUT - Using proper pagination now
  const [alert, setAlert] = useState({ open: false, message: "" });
  // Filter states - COMMENTED OUT (filters removed)
  // const [format, setFormat] = useState("");
  // const [location, setLocation] = useState("");
  // const [day, setDay] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [showBasketModal, setShowBasketModal] = useState(false);
  const [adding, setAdding] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async (page) => {
      setLoading(true);
      try {
        const response = await api.get("/course/view", { params: { page } });
        if (response.data?.success) {
          const payload = response.data.data || {};
          const courseList = payload.data || [];
          
          setCourses(courseList);
          setCurrentPage(payload.current_page || 1);
          setLastPage(payload.last_page || 1);
          setTotal(payload.total || 0);
          setLinks(payload.links || []);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setAlert({ open: true, message: "Failed to load courses. Please try again." });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses(currentPage);
  }, [currentPage]);

  // Derived filtered list - COMMENTED OUT (filters removed)
  // const filteredCourses = useMemo(() => {
  //   return courses.filter((course) => {
  //     // Format filter matches against modes array
  //     if (format && Array.isArray(course.modes) && course.modes.length > 0) {
  //       if (!course.modes.includes(format)) return false;
  //     }

  //     // Location/day are optional, only filter if the field exists on course
  //     if (location) {
  //       const courseLocation = course.location;
  //       if (courseLocation && courseLocation !== location) return false;
  //     }
  //     if (day) {
  //       const courseDay = course.day;
  //       if (courseDay && courseDay !== day) return false;
  //     }
  //     return true;
  //   });
  // }, [courses, format, location, day]);

  // Use courses directly without filtering
  const filteredCourses = useMemo(() => courses, [courses]);

  const handleCourseClick = (course) => {
    if (course.slug) {
      navigate(`/course/${course.slug}`);
    } else {
      // Fallback to modal if no slug
      setSelectedCourse(course);
      setOpenModal(true);
    }
  };

  const handleAddToBasket = () => {
    if (!selectedCourse) return;

    const payload = {
      product_type: "course",
      product_id: selectedCourse.id,
      // Optional extras if backend allows them; harmless if ignored
      product_slug: selectedCourse.slug,
      product_name: selectedCourse.name,
      quantity: 1,
    };

    setAdding(true);
    dispatch(addToCart(payload))
      .unwrap()
      .then(() => {
        dispatch(fetchCart());
        setOpenModal(false);
        setShowBasketModal(true);
      })
      .catch((err) => {
        const errorMessage =
          typeof err === "string" ? err : err?.message || "Something went wrong";
        setAlert({ open: true, message: errorMessage });
      })
      .finally(() => setAdding(false));
  };

  const fallbackImage = "https://dummyimage.com/600x400/eeeeee/000000&text=No+Image";

  return (
    <Box sx={{ py: 8, background: 'linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%)' }}>
      <Container sx={containerStyles}>
        {/* Benefits / Value Props */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {[{
            icon: <SchoolIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
            title: "Expert-Led Learning",
            desc: "Learn from experienced tutors who understand the 11+ exam requirements.",
            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          },{
            icon: <AssessmentIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
            title: "Flexible Formats",
            desc: "Choose from online or in-person classes to fit your schedule.",
            gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          },{
            icon: <AccessTimeIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
            title: "Comprehensive Curriculum",
            desc: "Cover all subjects and topics needed for exam success.",
            gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          }].map((card, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Box 
                sx={{ 
                  p: 4, 
                  borderRadius: 3, 
                  background: card.gradient,
                  color: 'white',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
                  },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: 2, 
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {card.icon}
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.25rem' }}>{card.title}</Typography>
                </Box>
                <Typography sx={{ color: "rgba(255,255,255,0.95)", fontSize: '0.95rem', lineHeight: 1.6 }}>{card.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Filters - COMMENTED OUT */}
        {/* <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
          <Select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            sx={{ 
              width: 160, 
              height: 45,
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(102, 126, 234, 0.3)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(102, 126, 234, 0.5)',
              },
            }}
            displayEmpty
            renderValue={(selected) => (selected ? selected : "All Formats")}
          >
            <MenuItem value=""><em>All Formats</em></MenuItem>
            <MenuItem value="Online">Online</MenuItem>
            <MenuItem value="In person">In person</MenuItem>
          </Select>
          <Select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            sx={{ 
              width: 160, 
              height: 45,
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(102, 126, 234, 0.3)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(102, 126, 234, 0.5)',
              },
            }}
            displayEmpty
            renderValue={(selected) => (selected ? selected : "All Locations")}
          >
            <MenuItem value=""><em>All Locations</em></MenuItem>
            <MenuItem value="London">London</MenuItem>
            <MenuItem value="Manchester">Manchester</MenuItem>
          </Select>
          <Select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            sx={{ 
              width: 160, 
              height: 45,
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(102, 126, 234, 0.3)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(102, 126, 234, 0.5)',
              },
            }}
            displayEmpty
            renderValue={(selected) => (selected ? selected : "All Days")}
          >
            <MenuItem value=""><em>All Days</em></MenuItem>
            <MenuItem value="Saturday">Saturday</MenuItem>
            <MenuItem value="Sunday">Sunday</MenuItem>
          </Select>
        </Box> */}

        {/* Course Table */}
        <TableContainer 
          component={Paper} 
          sx={{ 
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid rgba(25, 118, 210, 0.1)',
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '& .MuiTableCell-head': {
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1rem',
                  padding: '16px',
                }
              }}>
                <TableCell sx={{ fontWeight: "bold" }}>Course</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Academic Year</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Subjects</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Modes</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <CommonSkeleton type="table" rows={5} cols={5} />
              ) : filteredCourses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography sx={{ color: '#666', py: 4 }}>No courses available.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCourses.map((course, idx) => (
                  <TableRow 
                    key={course.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#f8f9ff',
                        transform: 'scale(1.01)',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                      },
                      transition: 'all 0.2s ease',
                      '& .MuiTableCell-root': {
                        padding: '16px',
                      }
                    }}
                    onClick={() => handleCourseClick(course)}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{
                          width: 50,
                          height: 50,
                          borderRadius: 2,
                          overflow: 'hidden',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          border: '2px solid #e3f2fd',
                        }}>
                          <img
                            src={course.image || fallbackImage}
                            alt={course.name}
                            style={{ width: '100%', height: '100%', objectFit: "cover" }}
                          />
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#1a1a1a' }}>
                            {course.name}
                          </Typography>
                          {course.description && (
                            <Typography 
                              sx={{ 
                                color: '#666', 
                                fontSize: '0.85rem',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                mt: 0.5,
                              }}
                            >
                              {course.description}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={course.acdemicyear || "—"} 
                        size="small"
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {Array.isArray(course.subjects) && course.subjects.length > 0
                          ? course.subjects.map((subject, idx) => (
                              <Chip 
                                key={idx}
                                label={subject} 
                                size="small"
                                sx={{
                                  background: '#e3f2fd',
                                  color: '#1976d2',
                                  fontWeight: 500,
                                }}
                              />
                            ))
                          : <Typography sx={{ color: '#666', fontSize: '0.95rem' }}>—</Typography>}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {Array.isArray(course.modes) && course.modes.length > 0
                          ? course.modes.map((mode, idx) => (
                              <Chip 
                                key={idx}
                                label={mode} 
                                size="small"
                                sx={{
                                  background: '#f3e5f5',
                                  color: '#7b1fa2',
                                  fontWeight: 500,
                                }}
                              />
                            ))
                          : <Typography sx={{ color: '#666', fontSize: '0.95rem' }}>—</Typography>}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCourseClick(course);
                        }}
                        sx={{ 
                          textTransform: "none", 
                          borderRadius: "25px",
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                          padding: '8px 24px',
                          fontWeight: 600,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                          }
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {!loading && lastPage > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mt: 4 }}>
            <Typography sx={{ color: '#666', fontSize: '0.95rem' }}>
              Showing {((currentPage - 1) * 10) + 1} - {Math.min(currentPage * 10, total)} of {total} courses
            </Typography>
            <Pagination
              count={lastPage}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              color="primary"
              shape="rounded"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontWeight: 600,
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    }
                  }
                }
              }}
            />
          </Box>
        )}

        {/* Snackbar */}
        <Snackbar
          open={alert.open}
          autoHideDuration={3000}
          onClose={() => setAlert({ ...alert, open: false })}
          message={alert.message}
        />

        {/* Course Detail Modal */}
        <CommonModal open={openModal} onClose={() => setOpenModal(false)} width={650}>
          {selectedCourse && (
            <>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                {selectedCourse.name}
              </Typography>
              {selectedCourse.acdemicyear && (
                <Chip 
                  label={selectedCourse.acdemicyear} 
                  size="small"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 600,
                    mb: 2,
                  }}
                />
              )}
              <img
                src={selectedCourse.image || fallbackImage}
                alt={selectedCourse.name}
                style={{ width: "100%", borderRadius: 8, marginBottom: 16 }}
              />
              <Typography variant="body2" sx={{ mb: 2, color: '#666', lineHeight: 1.7 }}>
                {selectedCourse.description || "This course provides comprehensive preparation for the 11+ exam..."}
              </Typography>
              {Array.isArray(selectedCourse.subjects) && selectedCourse.subjects.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Subjects:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selectedCourse.subjects.map((subject, idx) => (
                      <Chip 
                        key={idx}
                        label={subject} 
                        size="small"
                        sx={{
                          background: '#e3f2fd',
                          color: '#1976d2',
                          fontWeight: 500,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
              {Array.isArray(selectedCourse.modes) && selectedCourse.modes.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Available Modes:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selectedCourse.modes.map((mode, idx) => (
                      <Chip 
                        key={idx}
                        label={mode} 
                        size="small"
                        sx={{
                          background: '#f3e5f5',
                          color: '#7b1fa2',
                          fontWeight: 500,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  if (selectedCourse.slug) {
                    navigate(`/course/${selectedCourse.slug}`);
                  } else {
                    handleAddToBasket();
                  }
                }}
                sx={{
                  textTransform: "none",
                  borderRadius: "30px",
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  fontWeight: 600,
                  padding: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  }
                }}
                disabled={adding}
              >
                {adding ? "Adding..." : selectedCourse.slug ? "View Full Details" : "Add to Basket"}
              </Button>
            </>
          )}
        </CommonModal>

        {/* Basket Modal */}
        <CommonModal open={showBasketModal} onClose={() => setShowBasketModal(false)} width={500}>
          {selectedCourse && (
            <>
              <Typography variant="h6" sx={{ mb: 1 }}>Your Basket</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Tue 5.00pm - 7.45pm</Typography>

              <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                <img
                  src={selectedCourse.image || fallbackImage}
                  alt={selectedCourse.name}
                  style={{ width: 60, height: 60, borderRadius: 4, objectFit: "cover" }}
                />
                <Box>
                  <Typography sx={{ fontWeight: 600, color: "red", fontSize: "14px" }}>
                    {selectedCourse.name}: ONLINE {selectedCourse.acdemicyear}
                  </Typography>
                  <Typography variant="body2">Qty: 1</Typography>
                </Box>
                {selectedCourse.price !== undefined && (
                  <Typography sx={{ marginLeft: "auto", fontWeight: 500 }}>
                    £{selectedCourse.price}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography sx={{ fontWeight: "bold" }}>Subtotal</Typography>
                <Typography sx={{ fontWeight: "bold" }}>
                  {selectedCourse.price !== undefined ? `£${selectedCourse.price}` : "—"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                <Button variant="outlined" fullWidth onClick={() => setShowBasketModal(false)}>
                  Continue Browsing
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  component={Link}
                  to="/basket"
                  onClick={() => setShowBasketModal(false)}
                >
                  View Basket
                </Button>
              </Box>

              <Button
                variant="contained"
                fullWidth
                component={Link}
                to="/checkout"
                onClick={() => setShowBasketModal(false)}
                sx={{ backgroundColor: "#7F56D9", "&:hover": { backgroundColor: "#6931D4" }, textTransform: "none" }}
              >
                Checkout
              </Button>
            </>
          )}
        </CommonModal>
      </Container>
    </Box>
  );
}
