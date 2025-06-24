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
} from "@mui/material";
import { containerStyles } from "../style";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart, fetchCart } from "../../redux/slices/cartSlice";
import api from "../../api";
import CommonSkeleton from "../../components/CommonSkeleton";
import CommonModal from "../../components/Modal";

export default function CourseTable() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showAll, setShowAll] = useState(true); // show maximum response by default
  const [alert, setAlert] = useState({ open: false, message: "" });
  const [format, setFormat] = useState("Online");
  const [location, setLocation] = useState("London");
  const [day, setDay] = useState("Saturday");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [showBasketModal, setShowBasketModal] = useState(false);
  const [adding, setAdding] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCourses = async (page) => {
      setLoading(true);
      try {
        const first = await api.get("/course/view", { params: { page } });
        if (first.data?.success) {
          const payload = first.data.data || {};
          const initialList = payload.data || [];
          let combined = initialList;
          const totalPages = payload.last_page || 1;

          // If showAll is enabled, fetch all remaining pages and combine
          if (showAll && totalPages > 1) {
            const remainingPages = [];
            for (let p = 2; p <= totalPages; p += 1) {
              remainingPages.push(api.get("/course/view", { params: { page: p } }));
            }
            const results = await Promise.allSettled(remainingPages);
            results.forEach((res) => {
              if (res.status === "fulfilled" && res.value?.data?.success) {
                const more = res.value.data.data?.data || [];
                combined = combined.concat(more);
              }
            });
          }

          setCourses(combined);
          setCurrentPage(payload.current_page || 1);
          setLastPage(showAll ? 1 : (payload.last_page || 1));
          setTotalItems(showAll ? combined.length : (payload.total || combined.length || 0));
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, showAll]);

  // Derived filtered list (keeps behavior even if some fields are missing from API)
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Format filter matches against modes array
      if (format && Array.isArray(course.modes) && course.modes.length > 0) {
        if (!course.modes.includes(format)) return false;
      }
      // If course does not have modes, don't exclude it based on format

      // Location/day are optional, only filter if the field exists on course
      if (location) {
        const courseLocation = course.location;
        if (courseLocation && courseLocation !== location) return false;
      }
      if (day) {
        const courseDay = course.day;
        if (courseDay && courseDay !== day) return false;
      }
      return true;
    });
  }, [courses, format, location, day]);

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
    <Box sx={{ py: 8 }}>
      <Container sx={containerStyles}>
        {/* Filters */}
        <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
          <Select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            sx={{ width: 160, height: 45 }}
            displayEmpty
            renderValue={(selected) => (selected ? selected : "Course Format")}
          >
            <MenuItem value=""><em>Course Format</em></MenuItem>
            <MenuItem value="Online">Online</MenuItem>
            <MenuItem value="In person">In person</MenuItem>
          </Select>
          <Select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            sx={{ width: 160, height: 45 }}
            displayEmpty
            renderValue={(selected) => (selected ? selected : "Course Location")}
          >
            <MenuItem value=""><em>Course Location</em></MenuItem>
            <MenuItem value="London">London</MenuItem>
            <MenuItem value="Manchester">Manchester</MenuItem>
          </Select>
          <Select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            sx={{ width: 160, height: 45 }}
            displayEmpty
            renderValue={(selected) => (selected ? selected : "Course Day")}
          >
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
                <TableCell sx={{ fontWeight: "bold" }}>Subjects</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Modes</TableCell>
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
                filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <img
                          src={course.image || fallbackImage}
                          alt={course.name}
                          style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }}
                        />
                        <Typography sx={{ fontWeight: 500 }}>
                          {course.name} {course.acdemicyear ? `• ${course.acdemicyear}` : ""}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {Array.isArray(course.subjects) && course.subjects.length > 0
                        ? course.subjects.join(", ")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {Array.isArray(course.modes) && course.modes.length > 0
                        ? course.modes.join(", ")
                        : "—"}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        onClick={() => {
                          setSelectedCourse(course);
                          setOpenModal(true);
                        }}
                        sx={{ textTransform: "none", borderRadius: "20px" }}
                      >
                        Register Now
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
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={lastPage}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              color="primary"
              shape="rounded"
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
              <img
                src={selectedCourse.image || fallbackImage}
                alt={selectedCourse.name}
                style={{ width: "100%", borderRadius: 8, marginBottom: 16 }}
              />
              <Typography variant="body2" sx={{ mb: 1 }}>
                {selectedCourse.description || "This certificate is proudly presented to recognize..."}
              </Typography>
              {selectedCourse.price !== undefined && (
                <Typography sx={{ fontWeight: 600, mb: 2 }}>
                  Price: £{selectedCourse.price}
                </Typography>
              )}
              <Button
                fullWidth
                variant="contained"
                onClick={handleAddToBasket}
                sx={{
                  textTransform: "none",
                  borderRadius: "30px",
                  backgroundColor: "#0070f3",
                  fontWeight: 500,
                  "&:hover": { backgroundColor: "#005ad6" }
                }}
                disabled={adding}
              >
                {adding ? "Adding..." : "Add to Basket"}
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
