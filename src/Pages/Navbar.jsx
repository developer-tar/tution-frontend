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
  { label: "About", path: "/about" },
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
    userInitials: '',
    role: ''
  });

  const cartItems = useSelector((state) => state.cart?.items || []);
  const [guestCartCount, setGuestCartCount] = React.useState(0);

  // Get guest cart count
  const getGuestCartCount = () => {
    try {
      const guestCart = localStorage.getItem('guestCart');
      if (guestCart) {
        const items = JSON.parse(guestCart);
        return items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      }
    } catch (error) {
      console.error('Error reading guest cart:', error);
    }
    return 0;
  };

  // Calculate total cart count (server cart + guest cart)
  const totalCartCount = React.useMemo(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // User is logged in - use server cart
      return cartItems.length;
    } else {
      // User is not logged in - use guest cart
      return guestCartCount;
    }
  }, [cartItems.length, guestCartCount]);

  // Initialize auth state and handle all cart/auth logic
  React.useEffect(() => {
    const checkAndUpdateAuth = () => {
      const isLoggedIn = isUserLoggedIn();
      const userName = getParentName();
      const userInitials = getParentInitials();
      const roleRaw = localStorage.getItem('role') || '';
      const role = roleRaw ? String(roleRaw).toLowerCase().trim() : '';

      setAuthState({
        isLoggedIn,
        userName,
        userInitials,
        role
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

    // Update guest cart count
    setGuestCartCount(getGuestCartCount());

    // Listen for storage changes (login/logout/cart updates)
    const handleStorageChange = (e) => {
      // Handle auth changes (login/logout)
      if (e.key === 'token' || e.key === 'role' || e.key === 'userName' || e.key === 'userData' || e.type === 'storage') {
        checkAndUpdateAuth();
        // Update guest cart count when auth changes
        setGuestCartCount(getGuestCartCount());
      }
      // Handle cart updates
      else if (e.key === 'cartUpdated' || e.key === 'guestCart') {
        // Always try to fetch cart when updated, regardless of login status
        dispatch(fetchCart()).catch((err) => {
          console.log('Cart fetch failed:', err);
        });
        // Update guest cart count
        setGuestCartCount(getGuestCartCount());
        if (e.key === 'cartUpdated') {
          localStorage.removeItem('cartUpdated'); // Clean up
        }
      }
    };

    // Listen for custom events (for same-tab updates)
    const handleCustomEvent = () => {
      setGuestCartCount(getGuestCartCount());
    };

    const handleLogin = () => {
      checkAndUpdateAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('guestCartUpdated', handleCustomEvent);
    window.addEventListener('login', handleLogin);

    // Poll for guest cart changes (for same-tab updates)
    const interval = setInterval(() => {
      const newCount = getGuestCartCount();
      if (newCount !== guestCartCount) {
        setGuestCartCount(newCount);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('guestCartUpdated', handleCustomEvent);
      window.removeEventListener('login', handleLogin);
      clearInterval(interval);
    };
  }, [dispatch, guestCartCount]);

  const roleLower = (authState.role || '').toLowerCase();
  const isStudent = roleLower === 'student';
  const isParent = roleLower === 'parent';

  const isUserLoggedIn = () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    return !!(token && userRole);
  };

  const getParentName = () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        if (parsed?.full_name) return parsed.full_name;
      }
    } catch (e) {}
    return localStorage.getItem('userName') || 'User';
  };

  // Generate initials from full name
  const getParentInitials = () => {
    const fullName = getParentName();
    if (!fullName || fullName.trim() === '' || fullName === 'User') {
      return 'U';
    }
    const nameParts = fullName.trim().split(' ').filter(part => part.length > 0);
    if (nameParts.length === 0) return 'U';
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
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
    localStorage.removeItem('userData');

    // Close menu
    handleParentMenuClose();

    // Clear cart state on logout
    dispatch({ type: 'cart/clearCart' });

    // Update auth state immediately without page refresh
    setAuthState({ isLoggedIn: false, userName: '', userInitials: '', role: '' });

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
              <img src="/assets/images/logo.svg" alt="Logo" style={{ height: 60 }} />
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
                {isStudent && (
                  <Button
                    component={Link}
                    to="/student/my-papers"
                    sx={{
                      color: "#000",
                      textTransform: "none",
                      fontSize: { md: "12px", lg: "16px" },
                      px: { md: 1, lg: 1.5 },
                      minWidth: 'auto',
                      '&:hover': { backgroundColor: 'transparent', color: '#1976d2' }
                    }}
                  >
                    My Papers
                  </Button>
                )}
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
                    badgeContent={totalCartCount > 0 ? totalCartCount : null}
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

                {!authState.isLoggedIn ? (
                  <Button
                    variant="outlined"
                    size="small"
                    component={Link}
                    to="/login"
                    sx={{ textTransform: "none" }}
                  >
                    Login
                  </Button>
                ) : (
                  <>
                    <Chip
                      label={authState.userInitials}
                      onClick={handleParentMenuOpen}
                      sx={{
                        background: isParent
                          ? 'linear-gradient(90deg, #4450A5 0%, #EF2A1E 100%)'
                          : 'linear-gradient(90deg, #2E7D32 0%, #1B5E20 100%)',
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
                          minWidth: 160,
                          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                          borderRadius: '8px',
                          mt: 1
                        }
                      }}
                      sx={{ zIndex: 2000 }}
                      disableScrollLock={true}
                      keepMounted={false}
                    >
                      {isStudent && (
                        <>
                          <MenuItem
                            component={Link}
                            to="/student/my-papers"
                            onClick={handleParentMenuClose}
                            sx={{ py: 1.5, px: 2, '&:hover': { backgroundColor: '#f5f5f5' } }}
                          >
                            <Typography variant="body2">My Papers</Typography>
                          </MenuItem>
                          <MenuItem
                            component={Link}
                            to="/student/paper/purchases"
                            onClick={handleParentMenuClose}
                            sx={{ py: 1.5, px: 2, '&:hover': { backgroundColor: '#f5f5f5' } }}
                          >
                            <Typography variant="body2">My Paper Purchases</Typography>
                          </MenuItem>
                        </>
                      )}
                      {isParent && process.env.REACT_APP_PARENT_URL && (
                        <MenuItem
                          component="a"
                          href={process.env.REACT_APP_PARENT_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleParentMenuClose}
                          sx={{ py: 1.5, px: 2, '&:hover': { backgroundColor: '#f5f5f5' } }}
                        >
                          <Typography variant="body2">Parent Panel</Typography>
                        </MenuItem>
                      )}
                      <MenuItem
                        onClick={handleLogout}
                        sx={{ py: 1.5, px: 2, '&:hover': { backgroundColor: '#f5f5f5' } }}
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
              {!authState.isLoggedIn && (
                <Button
                  variant="outlined"
                  size="small"
                  component={Link}
                  to="/login"
                  sx={{ mr: 1, textTransform: "none" }}
                >
                  Login
                </Button>
              )}
              <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
                PaperProps={{
                  sx: {
                    top: { xs: "72px", sm: "82px" },
                    height: {
                      xs: "calc(100% - 64px)",
                      sm: "calc(100% - 72px)"
                    },
                    zIndex: 1300
                  }
                }}>
                <Box sx={{ width: 250 }}>
                  <List>
                    {authState.isLoggedIn && (
                      <>
                        <ListItem>
                          <Chip
                            icon={<AccountCircleIcon />}
                            label={isParent ? 'Parent Portal' : isStudent ? 'Student' : 'My Account'}
                            sx={{
                              background: isParent
                                ? 'linear-gradient(90deg, #4450A5 0%, #EF2A1E 100%)'
                                : 'linear-gradient(90deg, #2E7D32 0%, #1B5E20 100%)',
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
                        {isStudent && (
                          <>
                            <ListItem disablePadding>
                              <ListItemButton component={Link} to="/student/my-papers" onClick={() => setDrawerOpen(false)}>
                                <ListItemText primary="My Papers" />
                              </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                              <ListItemButton component={Link} to="/student/paper/purchases" onClick={() => setDrawerOpen(false)}>
                                <ListItemText primary="My Paper Purchases" />
                              </ListItemButton>
                            </ListItem>
                          </>
                        )}
                        {isParent && process.env.REACT_APP_PARENT_URL && (
                          <ListItem disablePadding>
                            <ListItemButton component="a" href={process.env.REACT_APP_PARENT_URL} target="_blank" rel="noopener noreferrer" onClick={() => setDrawerOpen(false)}>
                              <ListItemText primary="Parent Panel" />
                            </ListItemButton>
                          </ListItem>
                        )}
                        <ListItem disablePadding>
                          <ListItemButton onClick={handleLogout}>
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
                    <ListItem disablePadding>
                      <ListItemButton component={Link} to="/basket">
                        <Badge
                          badgeContent={totalCartCount > 0 ? totalCartCount : null}
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
