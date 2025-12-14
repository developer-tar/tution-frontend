// src/Pages/Navbar.jsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
  Badge,
  Typography,
  Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { containerStyles } from "./style";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../redux/slices/cartSlice";
import ListItemButton from "@mui/material/ListItemButton";

const ADMIN_URL = process.env.REACT_APP_PARENT_URL;

const navItems = [
  { label: "Home", path: "/" },
  // { label: "Courses", items: [{ label: "Course List", path: "/course-list" }] },
  { label: "Courses", path: "/course-list" },
  
  // { label: "Advice", path: "/advice", items: [{ label: "Tips", path: "/advice/tips" }, { label: "Guidance", path: "/advice/guidance" }] },
  { label: "Mock Exams", path: "/mock-exams" },
  // { label: "Creative Writing", path: "/creative-writing" },
  { label: "Papers", path: "/papers" },
  { label: "About", path: "/about"},
  // { label: "About", path: "/about", items: [{ label: "Team", path: "/about/team" }, { label: "Mission", path: "/about/mission" }] },
  // { label: "Contact Us", path: "/contact" },
];

export default function Navbar() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEls, setAnchorEls] = React.useState({});
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [parentMenuAnchor, setParentMenuAnchor] = React.useState(null);
  const [authState, setAuthState] = React.useState({
    isLoggedIn: false,
    userName: '',
    userInitials: ''
  });

  const cartItems = useSelector((state) => state.cart?.items || []);
  

  // Initialize auth state and handle all cart/auth logic
  React.useEffect(() => {
    const checkAndUpdateAuth = () => {
      const isLoggedIn = isParentLoggedIn();
      const userName = getParentName();
      const userInitials = getParentInitials();
      
      setAuthState({
        isLoggedIn,
        userName,
        userInitials
      });

      // Always try to fetch cart data (works for both logged in and guest users)
      dispatch(fetchCart()).catch((err) => {
        // If fetch fails (e.g., user not logged in), that's okay
        // Cart will remain empty or use localStorage if available
        console.log('Cart fetch failed (user may not be logged in):', err);
      });
    };

    // Initial check
    checkAndUpdateAuth();

    // Listen for storage changes (login/logout/cart updates)
    const handleStorageChange = (e) => {
      // Handle auth changes (login/logout)
      if (e.key === 'token' || e.key === 'role' || e.key === 'userName' || e.type === 'storage') {
        checkAndUpdateAuth();
      }
      // Handle cart updates
      else if (e.key === 'cartUpdated') {
        // Always try to fetch cart when updated, regardless of login status
        dispatch(fetchCart()).catch((err) => {
          console.log('Cart fetch failed:', err);
        });
        localStorage.removeItem('cartUpdated'); // Clean up
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dispatch]);

  // Check if parent is logged in
  const isParentLoggedIn = () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    return token && userRole === 'Parent';
  };

  const getParentName = () => {
    return localStorage.getItem('userName') || 'Parent';
  };

  // Generate initials from full name
  const getParentInitials = () => {
    const fullName = localStorage.getItem('userName');
    
    if (!fullName || fullName.trim() === '') {
      return 'P'; // Default to 'P' for Parent
    }
    
    const nameParts = fullName.trim().split(' ').filter(part => part.length > 0);
    
    if (nameParts.length === 0) {
      return 'P';
    } else if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    } else {
      // Take first letter of first name and first letter of last name
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    }
  };

  const handleAdminRedirect = () => {
    if (!ADMIN_URL) {
      console.error('Admin URL is not configured. Please set REACT_APP_PARENT_URL in your .env file.');
      return;
    }
    window.location.href = ADMIN_URL;
  };

  const handleMenuOpen = (event, label) => {
    setAnchorEls((prev) => ({ ...prev, [label]: event.currentTarget }));
  };

  const handleMenuClose = (label) => {
    setAnchorEls((prev) => ({ ...prev, [label]: null }));
  };

  const handleParentMenuOpen = (event) => {
    setParentMenuAnchor(event.currentTarget);
  };

  const handleParentMenuClose = () => {
    setParentMenuAnchor(null);
  };

  const handleLogout = () => {
    // Remove all auth data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    
    // Close menu
    handleParentMenuClose();
    
    // Clear cart state on logout
    dispatch({ type: 'cart/clearCart' });
    
    // Update auth state immediately without page refresh
    setAuthState({ isLoggedIn: false, userName: '', userInitials: '' });
    
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'));
  };

  const renderMenu = (item, index) => (
    <React.Fragment key={`${item.label}-${index}`}>
      <Button
        onClick={(e) => handleMenuOpen(e, item.label)}
        component={Link}
        to={item.path || "#"}
        endIcon={item.items ? <ExpandMoreIcon /> : null}
        sx={{ 
          color: "#000", 
          textTransform: "none", 
          fontSize: { md: "12px", lg: "16px" },
          px: { md: 1, lg: 1.5 },
          minWidth: 'auto',
          '&:hover': {
            backgroundColor: 'transparent',
            color: '#1976d2'
          }
        }}
      >
        {item.label}
      </Button>

      {item.items && (
        <Menu
          anchorEl={anchorEls[item.label]}
          open={Boolean(anchorEls[item.label])}
          onClose={() => handleMenuClose(item.label)}
          PaperProps={{
            sx: {
              zIndex: 2000,
              mt: 1
            }
          }}
          sx={{
            zIndex: 2000 // **💥 THE FIX**
          }}
        >
          {item.items.map((subItem, subIndex) => (
          <MenuItem key={`${subItem.label}-${subIndex}`} onClick={() => handleMenuClose(item.label)}>
            <Link to={subItem.path} style={{ textDecoration: "none", color: "#000" }}>
              {subItem.label}
              </Link>
            </MenuItem>
          ))}
        </Menu>
      )}
    </React.Fragment>
  );

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ py: 2, zIndex: 3000 }}>
      <Container sx={containerStyles}>
        <Toolbar 
          disableGutters
          sx={{ 
            display: 'flex',
            justifyContent: "space-between", 
            alignItems: 'center',
            px: 0,
            minHeight: '64px !important',
            width: '100%',
            gap: 4
          }}
        >
          {/* Logo Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img src="/assets/images/logo.svg" alt="Logo" style={{ height: 40 }} />
            </Link>
          </Box>

          {!isMobile ? (
            <>
              {/* Navigation Items */}
              <Box 
                sx={{ 
                  display: "flex", 
                  gap: { xs: 2, md: 3, lg: 4 }, 
                  alignItems: "center", 
                  flexWrap: "nowrap",
                  flex: '1 1 auto',
                  justifyContent: 'center',
                  mx: { md: 2, lg: 4 }
                }}
              >
                {navItems.map((item) => renderMenu(item))}
              </Box>

              {/* Right Side Actions */}
              <Box 
                sx={{ 
                  display: "flex", 
                  gap: 2,
                  alignItems: "center", 
                  flexWrap: "nowrap",
                  flexShrink: 0
                }}
              >
                {/* Cart Icon - Always visible, before Login */}
                <IconButton component={Link} to="/basket" sx={{ color: "inherit" }}>
                  <Badge 
                    badgeContent={cartItems && cartItems.length > 0 ? cartItems.length : null} 
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#f44336',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.75rem'
                      }
                    }}
                  >
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleAdminRedirect}
                  sx={{ textTransform: "none" }}
                >
                  Login
                </Button>

              {/* Parent Portal Indicator */}
              {authState.isLoggedIn && (
                <>
                  <Chip
                    label={authState.userInitials}
                    onClick={handleParentMenuOpen}
                    sx={{
                      background: 'linear-gradient(90deg, #4450A5 0%, #EF2A1E 100%)',
                      color: 'white',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: { md: '12px', lg: '14px' },
                      height: { md: '32px', lg: '36px' },
                      minWidth: { md: '32px', lg: '36px' },
                      borderRadius: '50%',
                      '& .MuiChip-label': {
                        padding: '0',
                        fontSize: { md: '12px', lg: '14px' },
                        fontWeight: 700,
                        letterSpacing: '0.5px'
                      },
                      '&:hover': {
                        opacity: 0.9,
                        transform: 'scale(1.05)'
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  />

                  <Menu
                    anchorEl={parentMenuAnchor}
                    open={Boolean(parentMenuAnchor)}
                    onClose={handleParentMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    PaperProps={{
                      sx: {
                        zIndex: 2000,
                        minWidth: 120,
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                        borderRadius: '8px',
                        mt: 1
                      }
                    }}
                    sx={{ zIndex: 2000 }}
                    disableScrollLock={true}
                    keepMounted={false}
                  >
                    <MenuItem 
                      onClick={handleLogout}
                      sx={{
                        py: 1.5,
                        px: 2,
                        '&:hover': {
                          backgroundColor: '#f5f5f5'
                        }
                      }}
                    >
                      <LogoutIcon sx={{ mr: 1, fontSize: '18px' }} />
                      <Typography variant="body2">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </>
              )}
              </Box>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                size="small"
                onClick={handleAdminRedirect}
                sx={{ mr: 1, textTransform: "none" }}
              >
                Login
              </Button>
              <IconButton onClick={() => setDrawerOpen(!drawerOpen)}> {/* open and close drawer */}
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
                PaperProps={{
                  sx: {
                    top: { xs: "72px", sm: "82px" },  // *** FIX: push drawer under header ***
                    height: {
                      xs: "calc(100% - 64px)",
                      sm: "calc(100% - 72px)"
                    },
                    zIndex: 1300
                  }
                }}>
                <Box sx={{ width: 250 }}>
                  <List>
                    {/* Parent Portal Indicator for Mobile */}
                    {authState.isLoggedIn && (
                      <>
                        <ListItem>
                          <Chip
                            icon={<AccountCircleIcon />}
                            label={`Parent Portal`}
                            sx={{
                              background: 'linear-gradient(90deg, #4450A5 0%, #EF2A1E 100%)',
                              color: 'white',
                              fontWeight: 600,
                              width: '100%'
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            Welcome, {authState.userName}
                          </Typography>
                        </ListItem>
                        <ListItem disablePadding>
                          <ListItemButton  onClick={handleLogout}>
                            <LogoutIcon sx={{ mr: 1 }} />
                            <ListItemText primary="Logout" />
                          </ListItemButton>
                        </ListItem>
                      </>
                    )}

                    {navItems.map((item) => (
                      <React.Fragment key={item.label}>
                        <ListItem disablePadding>
                          <ListItemButton onClick={() => setDrawerOpen(false)}>
                            <Link to={item.path || "#"} style={{ textDecoration: "none", color: "#000" }}>
                              {item.label}
                            </Link>
                          </ListItemButton>
                        </ListItem>
                        {item.items &&
                          item.items.map((subItem) => (
                            <ListItem disablePadding key={subItem.label}>
                              <ListItemButton onClick={() => setDrawerOpen(false)} sx={{ pl: 4 }}>
                                <Link to={subItem.path} style={{ textDecoration: "none", color: "#000" }}>
                                  {subItem.label}
                                </Link>
                              </ListItemButton>
                            </ListItem>
                          ))}
                      </React.Fragment>
                    ))}
                    {authState.isLoggedIn && (
                      <ListItem disablePadding>
                        <ListItemButton component={Link} to="/basket">
                          <Badge 
                            badgeContent={cartItems.length > 0 ? cartItems.length : null} 
                            color="error"
                            sx={{
                              '& .MuiBadge-badge': {
                                backgroundColor: '#f44336',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '0.75rem'
                              }
                            }}
                          >
                            <ShoppingCartIcon />
                          </Badge>
                          <ListItemText primary="Cart" sx={{ ml: 1 }} />
                        </ListItemButton>
                      </ListItem>
                    )}
                  </List>
                </Box>
              </Drawer>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
