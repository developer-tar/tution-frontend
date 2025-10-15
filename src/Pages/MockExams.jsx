import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Snackbar,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SchoolIcon from "@mui/icons-material/School";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { containerStyles } from "./style";
import CommonSkeleton from "../components/CommonSkeleton";
import CommonModal from "../components/Modal";
import { addToCart, fetchCart } from "../redux/slices/cartSlice";
import PageHeader from "./PageHeader";

export default function MockExams() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, message: "" });
  const [selected, setSelected] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [showBasketModal, setShowBasketModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formats, setFormats] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  // Hierarchical category state
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isFormatOpen, setIsFormatOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // Fetch categories and formats in parallel
        const [catsRes, formatsRes] = await Promise.all([
          api.get("/mock-exam/categories"),
          api.get("/common/data", { params: { param: "Formats" } }),
        ]);
        const catList = (catsRes.data?.data || catsRes.data || []).map((c) => c);
        const formatList = (formatsRes.data?.data || formatsRes.data || []).map((f) => f);
        setCategories(Array.isArray(catList) ? catList : []);
        setFormats(Array.isArray(formatList) ? formatList : []);

        // Fetch first page of mock exams with filters applied
        const first = await api.get("/mock-exam/view", { params: { page: 1, category: selectedCategory || undefined, format: selectedFormat || undefined } });
        const payload = first.data?.data || {};
        let combined = payload.data || [];
        const totalPages = payload.last_page || 1;
        if (totalPages > 1) {
          const reqs = [];
          for (let p = 2; p <= totalPages; p += 1) reqs.push(api.get("/mock-exam/view", { params: { page: p, category: selectedCategory || undefined, format: selectedFormat || undefined } }));
          const results = await Promise.allSettled(reqs);
          results.forEach((r) => {
            if (r.status === "fulfilled" && r.value?.data?.data?.data) combined = combined.concat(r.value.data.data.data);
          });
        }
        setItems(combined);
      } catch (err) {
        console.error("Failed to fetch mock exams:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [selectedCategory, selectedFormat]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setIsCategoryOpen(false); // Close dropdown after selection
  };
  
  const handleFormatClick = (formatValue) => {
    setSelectedFormat(formatValue);
    setIsFormatOpen(false); // Close dropdown after selection
  };
  const renderCategoryTree = (nodes, level = 0) => {
    if (!nodes || nodes.length === 0) return null;
    return (
      <Box sx={{ pl: level * 3 }}>
        {nodes.map((node) => {
          const hasChildren = node.all_children && node.all_children.length > 0;
          const isSelected = String(selectedCategory) === String(node.id);
          return (
            <Box key={node.id} sx={{ mb: 1 }}>
              <Box
                onClick={() => handleCategoryClick(node.id)}
                sx={{
                  p: 1.5,
                  cursor: 'pointer',
                  borderRadius: 1,
                  backgroundColor: isSelected ? '#e3f2fd' : 'transparent',
                  border: isSelected ? '1px solid #2196f3' : '1px solid transparent',
                  '&:hover': {
                    backgroundColor: isSelected ? '#e3f2fd' : '#f5f5f5',
                  },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Typography sx={{ fontWeight: isSelected ? 600 : 400, flex: 1 }}>
                  {node.name}
                </Typography>
              </Box>
              {hasChildren && (
                <Box sx={{ mt: 1 }}>
                  {renderCategoryTree(node.all_children, level + 1)}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    );
  };

  const handleAddToBasket = () => {
    if (!selected) return;
    const payload = {
      product_type: "mock_exam",
      product_id: selected.id,
      quantity: 1,
    };
    dispatch(addToCart(payload))
      .unwrap()
      .then(() => {
        dispatch(fetchCart());
        setOpenModal(false);
        setShowBasketModal(true);
      })
      .catch((err) => {
        const errorMessage = typeof err === "string" ? err : err?.message || "Something went wrong";
        setAlert({ open: true, message: errorMessage });
      });
  };

  const breadcrumbs = [
    { label: "Mock Exams", path: "/mock-exams" },
  ];

  const fallbackImage = "https://dummyimage.com/600x400/eeeeee/000000&text=No+Image";

  const rows = useMemo(() => items, [items]);

  return (
    <>
      <PageHeader title="Mock Exams" subtitle="Practice with realistic mock tests" breadcrumbs={breadcrumbs} />
      <Box sx={{ py: 8 }}>
        <Container sx={containerStyles}>
          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                {/* Dropdown Header */}
                <Box
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  sx={{
                    p: 1.5,
                    cursor: 'pointer',
                    borderRadius: 1,
                    border: '1px solid #d1d5db',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    }
                  }}
                >
                  <Typography sx={{ fontWeight: 500 }}>
                    {selectedCategory ? 
                      categories.flatMap(c => [c, ...(c.all_children || []).flatMap(sc => [sc, ...(sc.all_children || []).flatMap(ssc => [ssc, ...(ssc.all_children || []).flatMap(sssc => [sssc, ...(sssc.all_children || [])])])])]).find(cat => String(cat.id) === String(selectedCategory))?.name || 'Select Category'
                      : 'All Categories'
                    }
                  </Typography>
                  <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {isCategoryOpen ? '▲' : '▼'}
                  </Typography>
                </Box>

                {/* Dropdown Content */}
                {isCategoryOpen && (
                  <Box sx={{ mt: 1, maxHeight: 300, overflow: 'auto', border: '1px solid #d1d5db', borderRadius: 1, p: 1 }}>
                    {selectedCategory && (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                        <Button
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCategory("");
                          }}
                          sx={{ textTransform: 'none' }}
                        >
                          Clear
                        </Button>
                      </Box>
                    )}
                    {renderCategoryTree(categories)}
                  </Box>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                {/* Dropdown Header */}
                <Box
                  onClick={() => setIsFormatOpen(!isFormatOpen)}
                  sx={{
                    p: 1.5,
                    cursor: 'pointer',
                    borderRadius: 1,
                    border: '1px solid #d1d5db',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    }
                  }}
                >
                  <Typography sx={{ fontWeight: 500 }}>
                    {selectedFormat ? 
                      (formats.find(f => String(f?.id) === String(selectedFormat))?.name || 
                       formats.find(f => String(f?.value) === String(selectedFormat))?.label || 
                       formats.find(f => String(f) === String(selectedFormat)) || 
                       'Select Format')
                      : 'All Formats'
                    }
                  </Typography>
                  <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {isFormatOpen ? '▲' : '▼'}
                  </Typography>
                </Box>

                {/* Dropdown Content */}
                {isFormatOpen && (
                  <Box sx={{ mt: 1, maxHeight: 300, overflow: 'auto', border: '1px solid #d1d5db', borderRadius: 1, p: 1 }}>
                    {selectedFormat && (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                        <Button
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFormat("");
                            setIsFormatOpen(false);
                          }}
                          sx={{ textTransform: 'none' }}
                        >
                          Clear
                        </Button>
                      </Box>
                    )}
                    {/* All Formats option */}
                    <Box
                      onClick={() => handleFormatClick("")}
                      sx={{
                        p: 1.5,
                        cursor: 'pointer',
                        borderRadius: 1,
                        backgroundColor: selectedFormat === "" ? '#e3f2fd' : 'transparent',
                        border: selectedFormat === "" ? '1px solid #2196f3' : '1px solid transparent',
                        '&:hover': {
                          backgroundColor: selectedFormat === "" ? '#e3f2fd' : '#f5f5f5',
                        },
                        mb: 1
                      }}
                    >
                      <Typography sx={{ fontWeight: selectedFormat === "" ? 600 : 400 }}>
                        All Formats
                      </Typography>
                    </Box>
                    {/* Format list */}
                    {formats.map((f, idx) => {
                      const formatValue = typeof f === 'string' ? f : (f?.id || f?.value || f?.name || '');
                      const formatLabel = typeof f === 'string' ? f : (f?.label || f?.name || f?.value || '');
                      const isSelected = String(selectedFormat) === String(formatValue);
                      return (
                        <Box
                          key={idx}
                          onClick={() => handleFormatClick(formatValue)}
                          sx={{
                            p: 1.5,
                            cursor: 'pointer',
                            borderRadius: 1,
                            backgroundColor: isSelected ? '#e3f2fd' : 'transparent',
                            border: isSelected ? '1px solid #2196f3' : '1px solid transparent',
                            '&:hover': {
                              backgroundColor: isSelected ? '#e3f2fd' : '#f5f5f5',
                            },
                            mb: 1
                          }}
                        >
                          <Typography sx={{ fontWeight: isSelected ? 600 : 400 }}>
                            {formatLabel}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
          {/* Benefits / Value Props */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {[{
              icon: <AssessmentIcon sx={{ color: "#0d47a1" }} />,
              title: "Realistic Exam Conditions",
              desc: "Timed sections and authentic question types build confidence for the day.",
            },{
              icon: <SchoolIcon sx={{ color: "#0d47a1" }} />,
              title: "Targeted Preparation",
              desc: "Focus on the boards and formats that matter to your child.",
            },{
              icon: <AccessTimeIcon sx={{ color: "#0d47a1" }} />,
              title: "Detailed Feedback",
              desc: "Understand strengths and next steps with clear, actionable insights.",
            }].map((card, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Box sx={{ p: 3, borderRadius: 2, background: "#F6F6FD" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    {card.icon}
                    <Typography sx={{ fontWeight: 700 }}>{card.title}</Typography>
                  </Box>
                  <Typography sx={{ color: "#555" }}>{card.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F9F9FF" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Mock Exam</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Format</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <CommonSkeleton type="table" rows={5} cols={5} />
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No mock exams available.</TableCell>
                  </TableRow>
                ) : (
                  rows.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <img
                            src={exam.image || fallbackImage}
                            alt={exam.name}
                            style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }}
                          />
                          <Typography sx={{ fontWeight: 500 }}>
                            {exam.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{exam.category || "—"}</TableCell>
                      <TableCell>{exam.format || "—"}</TableCell>
                      <TableCell>{exam.price || "—"}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          onClick={() => {
                            if (exam.slug) {
                              navigate(`/add-to-cart/mock-exam/${exam.slug}`);
                            } else {
                              setSelected(exam);
                              setOpenModal(true);
                            }
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

          <Snackbar
            open={alert.open}
            autoHideDuration={3000}
            onClose={() => setAlert({ ...alert, open: false })}
            message={alert.message}
          />

          <CommonModal open={openModal} onClose={() => setOpenModal(false)} width={650}>
            {selected && (
              <>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  {selected.name}
                </Typography>
                <img
                  src={selected.image || fallbackImage}
                  alt={selected.name}
                  style={{ width: "100%", borderRadius: 8, marginBottom: 16 }}
                />
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {selected.description || "Train with realistic exam conditions."}
                </Typography>
                {selected.price && (
                  <Typography sx={{ fontWeight: 600, mb: 2 }}>
                    Price: {selected.price}
                  </Typography>
                )}
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleAddToBasket}
                  sx={{ textTransform: "none", borderRadius: "30px" }}
                >
                  Add to Basket
                </Button>
              </>
            )}
          </CommonModal>

          <CommonModal open={showBasketModal} onClose={() => setShowBasketModal(false)} width={500}>
            {selected && (
              <>
                <Typography variant="h6" sx={{ mb: 1 }}>Your Basket</Typography>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                  <img
                    src={selected.image || fallbackImage}
                    alt={selected.name}
                    style={{ width: 60, height: 60, borderRadius: 4, objectFit: "cover" }}
                  />
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: "14px" }}>
                      {selected.name}
                    </Typography>
                    <Typography variant="body2">Qty: 1</Typography>
                  </Box>
                  {selected.price && (
                    <Typography sx={{ marginLeft: "auto", fontWeight: 500 }}>
                      {selected.price}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                  <Button variant="outlined" fullWidth onClick={() => setShowBasketModal(false)}>
                    Continue Browsing
                  </Button>
                  <Button variant="outlined" fullWidth component={Link} to="/basket" onClick={() => setShowBasketModal(false)}>
                    View Basket
                  </Button>
                </Box>

                <Button variant="contained" fullWidth component={Link} to="/checkout" onClick={() => setShowBasketModal(false)}>
                  Checkout
                </Button>
              </>
            )}
          </CommonModal>

          {/* How it works */}
          <Box sx={{ mt: 8 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}>
              How it works
            </Typography>
            <Grid container spacing={3}>
              {["Choose your mock exam", "Register and receive confirmation", "Take the test under timed conditions", "Get feedback and next steps"].map((step, idx) => (
                <Grid item xs={12} md={3} key={idx}>
                  <Box sx={{ p: 3, textAlign: "center", borderRadius: 2, background: "#fff", boxShadow: "0px 4px 10px rgba(0,0,0,0.05)" }}>
                    <Box sx={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", background: "#e0e7ff", color: "#0d47a1", fontWeight: 700, mb: 1 }}>{idx + 1}</Box>
                    <Typography sx={{ fontWeight: 600 }}>{step}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* FAQ */}
          <Box sx={{ mt: 8 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}>
              Frequently asked questions
            </Typography>
            {[{
              q: "Are the mocks aligned to real exam boards?",
              a: "Yes, mocks mirror board styles like CSSE, GL, and more where specified.",
            },{
              q: "Do I get detailed feedback?",
              a: "You’ll receive a summary of performance and guidance on areas to improve.",
            },{
              q: "What if I need to reschedule?",
              a: "Contact support before your mock date; we’ll try to accommodate changes.",
            },{
              q: "Is there online format available?",
              a: "Where format is 'any', both in-person and online options may be provided.",
            },{
              q: "How do I register?",
              a: "Click Register Now next to the mock and follow the checkout process.",
            }].map((item, i) => (
              <Accordion key={i} sx={{ background: "#F9F9FF", mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircleIcon color="success" />
                    <Typography sx={{ fontWeight: 600 }}>{item.q}</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ color: "#555" }}>{item.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>

          {/* Final CTA */}
          <Box sx={{ mt: 8, p: 4, borderRadius: 2, background: "linear-gradient(90deg, #eef2ff, #f5f3ff)", display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ flex: 1, minWidth: 240 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Ready to put skills to the test?</Typography>
              <Typography sx={{ color: "#555" }}>Register for a mock exam today and get exam-ready with confidence.</Typography>
            </Box>
            <Button variant="contained" onClick={() => {
              if (rows && rows[0]) { setSelected(rows[0]); setOpenModal(true); }
            }} sx={{ textTransform: "none", borderRadius: "24px" }}>
              Register Now
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
}


