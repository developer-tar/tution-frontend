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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
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

export default function Papers() {
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
  const [isStudent, setIsStudent] = useState(false);
  const [isParent, setIsParent] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(null);
  const [addedPapers, setAddedPapers] = useState(new Set()); // Track which papers have been added
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [lastAddedPaper, setLastAddedPaper] = useState(null);

  // Get guest cart from localStorage
  const getGuestCart = () => {
    try {
      const guestCart = localStorage.getItem('guestCart');
      return guestCart ? JSON.parse(guestCart) : [];
    } catch (error) {
      console.error('Error reading guest cart:', error);
      return [];
    }
  };

  // Save guest cart to localStorage
  const saveGuestCart = (cartItems) => {
    try {
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving guest cart:', error);
    }
  };

  // Add to guest cart
  const addToGuestCart = (paper) => {
    const guestCart = getGuestCart();
    const existingItem = guestCart.find(item => item.product_id === paper.id && item.product_type === (paper.product_type || "paper"));

    if (existingItem) {
      // Item already exists, update quantity
      existingItem.quantity += 1;
    } else {
      // Add new item
      guestCart.push({
        product_type: paper.product_type || "paper",
        product_id: paper.id,
        quantity: 1,
        price_id: paper.stripe_price_id,
        paper_name: paper.name,
        paper_image: paper.image,
        paper_price: paper.price,
        paper_currency: paper.currency,
      });
    }

    saveGuestCart(guestCart);
    return guestCart;
  };

  // Sync guest cart to server when user logs in
  const syncGuestCartToServer = async () => {
    const guestCart = getGuestCart();
    if (guestCart.length === 0) return;

    try {
      // Add each item from guest cart to server cart
      for (const item of guestCart) {
        await dispatch(addToCart({
          product_type: item.product_type,
          product_id: item.product_id,
          quantity: item.quantity,
          price_id: item.price_id,
        })).unwrap();
      }

      // Clear guest cart after successful sync
      localStorage.removeItem('guestCart');
      await dispatch(fetchCart());
    } catch (error) {
      console.error('Error syncing guest cart:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role') || '';
    setIsStudent(role === 'Student');
    setIsParent(role === 'Parent');

    // If user is logged in and has guest cart items, sync them
    if (token) {
      syncGuestCartToServer();
    }

    // Load added papers from guest cart if not logged in
    if (!token) {
      const guestCart = getGuestCart();
      const paperIds = new Set(guestCart.map(item => item.product_id));
      setAddedPapers(paperIds);
    }
  }, [dispatch]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // Fetch categories and formats in parallel
        const [catsRes, formatsRes] = await Promise.all([
          api.get("/paper/categories"),
          api.get("/common/data", { params: { param: "Formats" } }),
        ]);
        const catList = (catsRes.data?.data || catsRes.data || []).map((c) => c);
        const formatList = (formatsRes.data?.data || formatsRes.data || []).map((f) => f);
        setCategories(Array.isArray(catList) ? catList : []);
        setFormats(Array.isArray(formatList) ? formatList : []);

        // Fetch first page of papers with filters applied
        const first = await api.get("/paper/view", {
          params: {
            page: 1,
            category_id: selectedCategory || undefined,
            format_id: selectedFormat || undefined
          }
        });
        const payload = first.data?.data || {};
        let combined = payload.data || [];
        const totalPages = payload.last_page || 1;
        if (totalPages > 1) {
          const reqs = [];
          for (let p = 2; p <= totalPages; p += 1) {
            reqs.push(api.get("/paper/view", {
              params: {
                page: p,
                category_id: selectedCategory || undefined,
                format_id: selectedFormat || undefined
              }
            }));
          }
          const results = await Promise.allSettled(reqs);
          results.forEach((r) => {
            if (r.status === "fulfilled" && r.value?.data?.data?.data) {
              combined = combined.concat(r.value.data.data.data);
            }
          });
        }
        setItems(combined);
      } catch (err) {
        console.error("Failed to fetch papers:", err);
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
      <Box sx={{ pl: level * 2.5 }}>
        {nodes.map((node) => {
          const hasChildren = node.all_children && node.all_children.length > 0;
          const isSelected = String(selectedCategory) === String(node.id);
          return (
            <Box key={node.id} sx={{ mb: 1.5 }}>
              <Box
                onClick={() => handleCategoryClick(node.id)}
                sx={{
                  p: 1.8,
                  cursor: 'pointer',
                  borderRadius: 2,
                  backgroundColor: isSelected
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'rgba(255, 255, 255, 0.8)',
                  background: isSelected
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'rgba(255, 255, 255, 0.8)',
                  border: isSelected
                    ? '2px solid transparent'
                    : '2px solid rgba(102, 126, 234, 0.2)',
                  color: isSelected ? 'white' : '#1a1a1a',
                  transition: 'all 0.3s ease',
                  boxShadow: isSelected
                    ? '0 4px 15px rgba(102, 126, 234, 0.3)'
                    : '0 2px 8px rgba(0, 0, 0, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  '&:hover': {
                    transform: 'translateX(4px)',
                    boxShadow: isSelected
                      ? '0 6px 20px rgba(102, 126, 234, 0.4)'
                      : '0 4px 12px rgba(102, 126, 234, 0.2)',
                    borderColor: isSelected ? 'transparent' : 'rgba(102, 126, 234, 0.4)',
                    backgroundColor: isSelected
                      ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                      : 'rgba(102, 126, 234, 0.08)',
                    background: isSelected
                      ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                      : 'rgba(102, 126, 234, 0.08)',
                  }
                }}
              >
                <Typography
                  sx={{
                    fontWeight: isSelected ? 700 : 500,
                    flex: 1,
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {node.name}
                </Typography>
                {isSelected && (
                  <CheckCircleIcon sx={{ fontSize: '1.2rem', color: 'white' }} />
                )}
              </Box>
              {hasChildren && (
                <Box sx={{ mt: 1.5, ml: 1, borderLeft: '2px dashed rgba(102, 126, 234, 0.2)', pl: 2 }}>
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
      product_type: selected.product_type || "paper", // Use product_type from API response
      product_id: selected.id,
      quantity: 1,
      price_id: selected.stripe_price_id,
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

  const handleAddToBasketDirect = async (paper) => {
    if (!paper) return;

    // Check if user is logged in
    const token = localStorage.getItem('token');

    if (!token) {
      // User is not logged in - add to guest cart
      addToGuestCart(paper);

      // Mark paper as added
      setAddedPapers(prev => new Set(prev).add(paper.id));
      setLastAddedPaper(paper);

      // Trigger event to update navbar count
      window.dispatchEvent(new Event('guestCartUpdated'));

      // Show success dialog
      setShowSuccessDialog(true);
    } else {
      // User is logged in, add to server cart
      const payload = {
        product_type: paper.product_type || "paper",
        product_id: paper.id,
        quantity: 1,
        price_id: paper.stripe_price_id,
      };

      try {
        await dispatch(addToCart(payload)).unwrap();
        await dispatch(fetchCart());

        // Mark paper as added
        setAddedPapers(prev => new Set(prev).add(paper.id));
        setLastAddedPaper(paper);

        // Show success dialog
        setShowSuccessDialog(true);
      } catch (err) {
        const errorMessage = typeof err === "string" ? err : err?.message || "Something went wrong";
        setAlert({ open: true, message: errorMessage });
      }
    }
  };

  const breadcrumbs = [
    { label: "Papers", path: "/papers" },
  ];

  const fallbackImage = "https://dummyimage.com/600x400/eeeeee/000000&text=No+Image";

  const rows = useMemo(() => items, [items]);

  return (
    <>
      <PageHeader title="Papers" subtitle="Practice with exam papers" breadcrumbs={breadcrumbs} />
      <Box sx={{ py: 8, background: 'linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%)' }}>
        <Container sx={containerStyles}>
          {/* Benefits / Value Props - Moved above filters */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {[{
              icon: <AssessmentIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
              title: "Realistic Exam Conditions",
              desc: "Timed sections and authentic question types build confidence for the day.",
              gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }, {
              icon: <SchoolIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
              title: "Targeted Preparation",
              desc: "Focus on the boards and formats that matter to your child.",
              gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            }, {
              icon: <AccessTimeIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
              title: "Detailed Feedback",
              desc: "Understand strengths and next steps with clear, actionable insights.",
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

          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid rgba(25, 118, 210, 0.1)',
                transition: 'all 0.3s ease',
                position: 'relative',
                zIndex: isCategoryOpen ? 1000 : 1,
                '&:hover': {
                  boxShadow: '0 6px 25px rgba(0,0,0,0.12)',
                }
              }}>
                {/* Dropdown Header */}
                <Box
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  sx={{
                    p: 1.5,
                    cursor: 'pointer',
                    borderRadius: 1.5,
                    border: '2px solid #e3f2fd',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#e3f2fd',
                      borderColor: '#1976d2',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
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

                {/* Upward Arrow */}
                {isCategoryOpen && (
                  <>
                    {/* Outer arrow (border) */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 'calc(100% - 1px)',
                        left: '24px',
                        width: 0,
                        height: 0,
                        borderLeft: '12px solid transparent',
                        borderRight: '12px solid transparent',
                        borderBottom: '12px solid rgba(102, 126, 234, 0.2)',
                        zIndex: 1002,
                        animation: 'fadeInDown 0.3s ease-out',
                        '@keyframes fadeInDown': {
                          '0%': {
                            opacity: 0,
                            transform: 'translateY(-10px)',
                          },
                          '100%': {
                            opacity: 1,
                            transform: 'translateY(0)',
                          },
                        },
                      }}
                    />
                    {/* Inner arrow (background) */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 'calc(100% + 1px)',
                        left: '26px',
                        width: 0,
                        height: 0,
                        borderLeft: '10px solid transparent',
                        borderRight: '10px solid transparent',
                        borderBottom: '10px solid #ffffff',
                        zIndex: 1003,
                        animation: 'fadeInDown 0.3s ease-out',
                      }}
                    />
                  </>
                )}
                {/* Dropdown Content */}
                {isCategoryOpen && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      mt: 1.5,
                      maxHeight: 400,
                      overflow: 'auto',
                      border: '2px solid rgba(102, 126, 234, 0.2)',
                      borderRadius: 2,
                      p: 2,
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
                      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)',
                      backdropFilter: 'blur(10px)',
                      zIndex: 1001,
                      width: '100%',
                      opacity: 0,
                      transform: 'translateY(-10px)',
                      animation: 'fadeInSlideDown 0.3s ease-out forwards',
                      '@keyframes fadeInSlideDown': {
                        '0%': {
                          opacity: 0,
                          transform: 'translateY(-10px)',
                        },
                        '100%': {
                          opacity: 1,
                          transform: 'translateY(0)',
                        },
                      },
                      '&::-webkit-scrollbar': {
                        width: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                        borderRadius: '10px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '10px',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                        }
                      }
                    }}
                  >
                    {selectedCategory && (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCategory("");
                          }}
                          sx={{
                            textTransform: 'none',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            color: 'white',
                            fontWeight: 600,
                            px: 2,
                            py: 0.5,
                            boxShadow: '0 2px 8px rgba(245, 87, 108, 0.3)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(245, 87, 108, 0.4)',
                              background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
                            }
                          }}
                        >
                          Clear Filter
                        </Button>
                      </Box>
                    )}
                    {renderCategoryTree(categories)}
                  </Box>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid rgba(25, 118, 210, 0.1)',
                transition: 'all 0.3s ease',
                position: 'relative',
                zIndex: isFormatOpen ? 1000 : 1,
                '&:hover': {
                  boxShadow: '0 6px 25px rgba(0,0,0,0.12)',
                }
              }}>
                {/* Dropdown Header */}
                <Box
                  onClick={() => setIsFormatOpen(!isFormatOpen)}
                  sx={{
                    p: 1.5,
                    cursor: 'pointer',
                    borderRadius: 1.5,
                    border: '2px solid #e3f2fd',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#e3f2fd',
                      borderColor: '#1976d2',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
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

                {/* Upward Arrow */}
                {isFormatOpen && (
                  <>
                    {/* Outer arrow (border) */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 'calc(100% - 1px)',
                        left: '24px',
                        width: 0,
                        height: 0,
                        borderLeft: '12px solid transparent',
                        borderRight: '12px solid transparent',
                        borderBottom: '12px solid rgba(102, 126, 234, 0.2)',
                        zIndex: 1002,
                        animation: 'fadeInDown 0.3s ease-out',
                        '@keyframes fadeInDown': {
                          '0%': {
                            opacity: 0,
                            transform: 'translateY(-10px)',
                          },
                          '100%': {
                            opacity: 1,
                            transform: 'translateY(0)',
                          },
                        },
                      }}
                    />
                    {/* Inner arrow (background) */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 'calc(100% + 1px)',
                        left: '26px',
                        width: 0,
                        height: 0,
                        borderLeft: '10px solid transparent',
                        borderRight: '10px solid transparent',
                        borderBottom: '10px solid #ffffff',
                        zIndex: 1003,
                        animation: 'fadeInDown 0.3s ease-out',
                      }}
                    />
                  </>
                )}
                {/* Dropdown Content */}
                {isFormatOpen && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      mt: 1.5,
                      maxHeight: 400,
                      overflow: 'auto',
                      border: '2px solid rgba(102, 126, 234, 0.2)',
                      borderRadius: 2,
                      p: 2,
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
                      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)',
                      backdropFilter: 'blur(10px)',
                      zIndex: 1001,
                      width: '100%',
                      opacity: 0,
                      transform: 'translateY(-10px)',
                      animation: 'fadeInSlideDown 0.3s ease-out forwards',
                      '@keyframes fadeInSlideDown': {
                        '0%': {
                          opacity: 0,
                          transform: 'translateY(-10px)',
                        },
                        '100%': {
                          opacity: 1,
                          transform: 'translateY(0)',
                        },
                      },
                      '&::-webkit-scrollbar': {
                        width: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                        borderRadius: '10px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '10px',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                        }
                      }
                    }}
                  >
                    {selectedFormat && (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFormat("");
                            setIsFormatOpen(false);
                          }}
                          sx={{
                            textTransform: 'none',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            color: 'white',
                            fontWeight: 600,
                            px: 2,
                            py: 0.5,
                            boxShadow: '0 2px 8px rgba(245, 87, 108, 0.3)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(245, 87, 108, 0.4)',
                              background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
                            }
                          }}
                        >
                          Clear Filter
                        </Button>
                      </Box>
                    )}
                    {/* All Formats option */}
                    <Box
                      onClick={() => handleFormatClick("")}
                      sx={{
                        p: 1.8,
                        cursor: 'pointer',
                        borderRadius: 2,
                        backgroundColor: selectedFormat === ""
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          : 'rgba(255, 255, 255, 0.8)',
                        background: selectedFormat === ""
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          : 'rgba(255, 255, 255, 0.8)',
                        border: selectedFormat === ""
                          ? '2px solid transparent'
                          : '2px solid rgba(102, 126, 234, 0.2)',
                        color: selectedFormat === "" ? 'white' : '#1a1a1a',
                        transition: 'all 0.3s ease',
                        boxShadow: selectedFormat === ""
                          ? '0 4px 15px rgba(102, 126, 234, 0.3)'
                          : '0 2px 8px rgba(0, 0, 0, 0.05)',
                        mb: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        '&:hover': {
                          transform: 'translateX(4px)',
                          boxShadow: selectedFormat === ""
                            ? '0 6px 20px rgba(102, 126, 234, 0.4)'
                            : '0 4px 12px rgba(102, 126, 234, 0.2)',
                          borderColor: selectedFormat === "" ? 'transparent' : 'rgba(102, 126, 234, 0.4)',
                          backgroundColor: selectedFormat === ""
                            ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                            : 'rgba(102, 126, 234, 0.08)',
                          background: selectedFormat === ""
                            ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                            : 'rgba(102, 126, 234, 0.08)',
                        }
                      }}
                    >
                      <Typography sx={{ fontWeight: selectedFormat === "" ? 700 : 500, fontSize: '0.95rem' }}>
                        All Formats
                      </Typography>
                      {selectedFormat === "" && (
                        <CheckCircleIcon sx={{ fontSize: '1.2rem', color: 'white' }} />
                      )}
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
                            p: 1.8,
                            cursor: 'pointer',
                            borderRadius: 2,
                            backgroundColor: isSelected
                              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                              : 'rgba(255, 255, 255, 0.8)',
                            background: isSelected
                              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                              : 'rgba(255, 255, 255, 0.8)',
                            border: isSelected
                              ? '2px solid transparent'
                              : '2px solid rgba(102, 126, 234, 0.2)',
                            color: isSelected ? 'white' : '#1a1a1a',
                            transition: 'all 0.3s ease',
                            boxShadow: isSelected
                              ? '0 4px 15px rgba(102, 126, 234, 0.3)'
                              : '0 2px 8px rgba(0, 0, 0, 0.05)',
                            mb: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            '&:hover': {
                              transform: 'translateX(4px)',
                              boxShadow: isSelected
                                ? '0 6px 20px rgba(102, 126, 234, 0.4)'
                                : '0 4px 12px rgba(102, 126, 234, 0.2)',
                              borderColor: isSelected ? 'transparent' : 'rgba(102, 126, 234, 0.4)',
                              backgroundColor: isSelected
                                ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                                : 'rgba(102, 126, 234, 0.08)',
                              background: isSelected
                                ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                                : 'rgba(102, 126, 234, 0.08)',
                            }
                          }}
                        >
                          <Typography sx={{ fontWeight: isSelected ? 700 : 500, fontSize: '0.95rem' }}>
                            {formatLabel}
                          </Typography>
                          {isSelected && (
                            <CheckCircleIcon sx={{ fontSize: '1.2rem', color: 'white' }} />
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
          {/* Benefits / Value Props - COMMENTED OUT (moved above filters) */}
          {/* <Grid container spacing={3} sx={{ mb: 6 }}>
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
          </Grid> */}

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
                  <TableCell sx={{ fontWeight: "bold" }}>Paper</TableCell>
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
                    <TableCell colSpan={5} align="center">No papers available.</TableCell>
                  </TableRow>
                ) : (
                  rows.map((paper, idx) => (
                    <TableRow
                      key={paper.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#f8f9ff',
                          transform: 'scale(1.01)',
                          transition: 'all 0.2s ease',
                        },
                        transition: 'all 0.2s ease',
                        '& .MuiTableCell-root': {
                          padding: '16px',
                        }
                      }}
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
                              src={paper.image || fallbackImage}
                              alt={paper.name}
                              style={{ width: '100%', height: '100%', objectFit: "cover" }}
                            />
                          </Box>
                          <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#1a1a1a' }}>
                            {paper.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ color: '#666', fontSize: '0.95rem' }}>
                          {paper.category || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ color: '#666', fontSize: '0.95rem' }}>
                          {paper.format || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600, color: '#1976d2', fontSize: '1rem' }}>
                          {paper.price ? `${paper.currency || '€'}${paper.price}` : "—"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          onClick={() => handleAddToBasketDirect(paper)}
                          disabled={addedPapers.has(paper.id)}
                          sx={{
                            textTransform: "none",
                            borderRadius: "25px",
                            background: addedPapers.has(paper.id)
                              ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
                              : 'linear-gradient(135deg, #4450A5 0%, #EF2A1E 100%)',
                            boxShadow: '0 4px 15px rgba(69, 80, 165, 0.4)',
                            padding: '8px 24px',
                            fontWeight: 600,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: addedPapers.has(paper.id) ? 'none' : 'translateY(-2px)',
                              boxShadow: addedPapers.has(paper.id)
                                ? '0 4px 15px rgba(69, 80, 165, 0.4)'
                                : '0 6px 20px rgba(69, 80, 165, 0.5)',
                              background: addedPapers.has(paper.id)
                                ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
                                : 'linear-gradient(135deg, #EF2A1E 0%, #4450A5 100%)',
                            },
                            '&:disabled': {
                              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                              color: 'white',
                            }
                          }}
                          startIcon={addedPapers.has(paper.id) ? <CheckCircleIcon /> : null}
                        >
                          {addedPapers.has(paper.id) ? 'Added' : 'Add to Basket'}
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
                  {selected.description || "Practice with realistic exam papers."}
                </Typography>
                {selected.price && (
                  <Typography sx={{ fontWeight: 600, mb: 2 }}>
                    Price: {selected.currency || '€'}{selected.price}
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
                      {selected.currency || '€'}{selected.price}
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

                <Button variant="contained" fullWidth component={Link} to="/basket" onClick={() => setShowBasketModal(false)}>
                  Checkout
                </Button>
              </>
            )}
          </CommonModal>

          {/* Success Dialog */}
          <Dialog
            open={showSuccessDialog}
            onClose={() => setShowSuccessDialog(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
              <CheckCircleIcon sx={{ fontSize: 60, color: '#4caf50', mb: 1 }} />
              <Typography component="div" variant="h6" sx={{ fontWeight: 600 }}>
                Paper Added Successfully!
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
              {lastAddedPaper && (
                <Box sx={{ mb: 2 }}>
                  <img
                    src={lastAddedPaper.image || fallbackImage}
                    alt={lastAddedPaper.name}
                    style={{ width: 80, height: 80, borderRadius: 8, objectFit: "cover", marginBottom: 12 }}
                  />
                  <Typography sx={{ fontWeight: 600, fontSize: "16px", mb: 0.5 }}>
                    {lastAddedPaper.name}
                  </Typography>
                  {lastAddedPaper.price && (
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {lastAddedPaper.currency || '€'}{lastAddedPaper.price}
                    </Typography>
                  )}
                </Box>
              )}
              <Typography variant="body2" sx={{ color: '#666' }}>
                The paper has been added to your basket.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3, gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setShowSuccessDialog(false)}
                sx={{
                  textTransform: "none",
                  borderRadius: "25px",
                  px: 3,
                  minWidth: 140
                }}
              >
                Continue Browsing
              </Button>
              <Button
                variant="contained"
                component={Link}
                to="/basket"
                onClick={() => setShowSuccessDialog(false)}
                sx={{
                  textTransform: "none",
                  borderRadius: "25px",
                  background: 'linear-gradient(135deg, #4450A5 0%, #EF2A1E 100%)',
                  px: 3,
                  minWidth: 140,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #EF2A1E 0%, #4450A5 100%)',
                  }
                }}
              >
                View Basket
              </Button>
            </DialogActions>
          </Dialog>

          {/* How it works */}
          <Box sx={{ mt: 8, mb: 6 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 4,
                textAlign: "center",
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              How it works
            </Typography>
            <Grid container spacing={3}>
              {["Choose your paper", "Register and receive confirmation", "Take the test under timed conditions", "Get feedback and next steps"].map((step, idx) => (
                <Grid item xs={12} md={3} key={idx}>
                  <Box
                    sx={{
                      p: 4,
                      textAlign: "center",
                      borderRadius: 3,
                      background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                      border: '2px solid rgba(102, 126, 234, 0.1)',
                      transition: 'all 0.3s ease',
                      height: '100%',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: "0 12px 32px rgba(102, 126, 234, 0.2)",
                        borderColor: 'rgba(102, 126, 234, 0.3)',
                      }
                    }}
                  >
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        fontWeight: 800,
                        fontSize: '1.5rem',
                        mb: 2,
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                      }}
                    >
                      {idx + 1}
                    </Box>
                    <Typography sx={{ fontWeight: 600, fontSize: '1.1rem', color: '#1a1a1a' }}>{step}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* FAQ */}
          <Box sx={{ mt: 8, mb: 6 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 4,
                textAlign: "center",
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Frequently asked questions
            </Typography>
            {[{
              q: "Are the papers aligned to real exam boards?",
              a: "Yes, papers mirror board styles like CSSE, GL, and more where specified.",
            }, {
              q: "Do I get detailed feedback?",
              a: "You'll receive a summary of performance and guidance on areas to improve.",
            }, {
              q: "What if I need to reschedule?",
              a: "Contact support before your paper date; we'll try to accommodate changes.",
            }, {
              q: "Is there online format available?",
              a: "Where format is 'any', both in-person and online options may be provided.",
            }, {
              q: "How do I register?",
              a: "Click Add to Basket next to the paper and proceed to checkout.",
            }].map((item, i) => (
              <Accordion
                key={i}
                sx={{
                  background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
                  mb: 2,
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(102, 126, 234, 0.1)',
                  '&:before': {
                    display: 'none',
                  },
                  '&.Mui-expanded': {
                    margin: '16px 0',
                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.15)',
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#667eea', fontSize: '2rem' }} />}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.05)',
                    }
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CheckCircleIcon sx={{ color: "#4caf50", fontSize: '1.5rem' }} />
                    <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a1a1a' }}>{item.q}</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ color: "#666", fontSize: '1rem', lineHeight: 1.7, pl: 5 }}>{item.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>

          {/* Final CTA */}
          <Box
            sx={{
              mt: 8,
              p: 6,
              borderRadius: 4,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              gap: 3,
              flexWrap: "wrap",
              boxShadow: '0 12px 40px rgba(102, 126, 234, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                pointerEvents: 'none',
              }
            }}
          >
            <Box sx={{ flex: 1, minWidth: 240, position: 'relative', zIndex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  color: 'white',
                  fontSize: { xs: '1.5rem', md: '2rem' }
                }}
              >
                Ready to put skills to the test?
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.95)", fontSize: '1.1rem', lineHeight: 1.6 }}>
                Register for a paper today and get exam-ready with confidence.
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={() => {
                if (rows && rows[0]) { handleAddToBasketDirect(rows[0]); }
              }}
              sx={{
                textTransform: "none",
                borderRadius: "30px",
                padding: '14px 32px',
                fontSize: '1.1rem',
                fontWeight: 700,
                background: 'white',
                color: '#EF2A1E',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                position: 'relative',
                zIndex: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255,255,255,0.95)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 6px 25px rgba(0,0,0,0.3)',
                }
              }}
            >
              Add to Basket
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
}




