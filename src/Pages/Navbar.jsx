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
import { useSelector } from "react-redux";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Courses", items: [{ label: "Course List", path: "/course-list" }] },
  { label: "About", path: "/about", items: [{ label: "Team", path: "/about/team" }, { label: "Mission", path: "/about/mission" }] },
  { label: "Advice", path: "/advice", items: [{ label: "Tips", path: "/advice/tips" }, { label: "Guidance", path: "/advice/guidance" }] },
  { label: "Mock Exams", path: "/mock-exams" },
  { label: "Creative Writing", path: "/creative-writing" },
  { label: "Papers", path: "/papers" },
  { label: "Contact Us", path: "/contact" },
];

export default function Navbar() {
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

  // const cartItems = useSelector((state) => state.cart.items);
  const cartItems = useSelector((state) => state.cart?.items || []);

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

  // Check auth state and update component state
  const checkAuthState = React.useCallback(() => {
    const isLoggedIn = isParentLoggedIn();
    const userName = getParentName();
    const userInitials = getParentInitials();
    setAuthState({ isLoggedIn, userName, userInitials });
  }, []);

  // Check auth state on component mount and storage changes
  React.useEffect(() => {
    checkAuthState();
    
    // Listen for storage events (including manual triggers)
    const handleStorageChange = () => {
      checkAuthState();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAuthState]);

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
    
    // Update auth state immediately without page refresh
    setAuthState({ isLoggedIn: false, userName: '', userInitials: '' });
    
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'));
  };

  const renderMenu = (item) => (
    <>
      <Button
        onClick={(e) => handleMenuOpen(e, item.label)}
        component={Link}
        to={item.path || "#"}
        endIcon={item.items ? <ExpandMoreIcon /> : null}
        sx={{ color: "#000", textTransform: "none", fontSize: { md: "12px", lg: "16px" } }}
      >
        {item.label}
      </Button>

      {item.items && (
        <Menu
          anchorEl={anchorEls[item.label]}
          open={Boolean(anchorEls[item.label])}
          onClose={() => handleMenuClose(item.label)}
        >
          {item.items.map((subItem) => (
            <MenuItem key={subItem.label} onClick={() => handleMenuClose(item.label)}>
              <Link to={subItem.path} style={{ textDecoration: "none", color: "#000" }}>
                {subItem.label}
              </Link>
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ py: 2 }}>
      <Container sx={containerStyles}>
        <Toolbar sx={{ justifyContent: "space-between", px: 0 }}>
          <Link to="/">
            <img src="/assets/images/logo.svg" alt="Logo" style={{ height: 40 }} />
          </Link>

          {!isMobile ? (
            <Box sx={{ display: "flex", gap: { md: 1, lg: 2 }, alignItems: "center", flexWrap: "nowrap" }}>
              {navItems.map((item) => renderMenu(item))}
              
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
                    sx={{
                      mt: 0.5,
                      '& .MuiPaper-root': {
                        minWidth: 120,
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                        borderRadius: '8px',
                        marginTop: '4px',
                      }
                    }}
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

              <IconButton component={Link} to="/basket" sx={{ color: "inherit", ml: 1 }}>
                <Badge badgeContent={cartItems.length} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Box>
          ) : (
            <>
              <IconButton onClick={() => setDrawerOpen(true)}><MenuIcon /></IconButton>
              <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
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
                        <ListItem button onClick={handleLogout}>
                          <LogoutIcon sx={{ mr: 1 }} />
                          <ListItemText primary="Logout" />
                        </ListItem>
                      </>
                    )}

                    {navItems.map((item) => (
                      <React.Fragment key={item.label}>
                        <ListItem button onClick={() => setDrawerOpen(false)}>
                          <Link to={item.path || "#"} style={{ textDecoration: "none", color: "#000" }}>
                            {item.label}
                          </Link>
                        </ListItem>
                        {item.items &&
                          item.items.map((subItem) => (
                            <ListItem button key={subItem.label} onClick={() => setDrawerOpen(false)} sx={{ pl: 4 }}>
                              <Link to={subItem.path} style={{ textDecoration: "none", color: "#000" }}>
                                {subItem.label}
                              </Link>
                            </ListItem>
                          ))}
                      </React.Fragment>
                    ))}
                    <ListItem button component={Link} to="/basket">
                      <Badge badgeContent={cartItems.length} color="secondary">
                        <ShoppingCartIcon />
                      </Badge>
                      <ListItemText primary="Cart" sx={{ ml: 1 }} />
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
