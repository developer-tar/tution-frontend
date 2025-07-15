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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
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

  // const cartItems = useSelector((state) => state.cart.items);
  const cartItems = useSelector((state) => state.cart?.items || []);

  const handleMenuOpen = (event, label) => {
    setAnchorEls((prev) => ({ ...prev, [label]: event.currentTarget }));
  };

  const handleMenuClose = (label) => {
    setAnchorEls((prev) => ({ ...prev, [label]: null }));
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
            <Box sx={{ display: "flex", gap: { md: 2, lg: 4 }, alignItems: "center" }}>
              {navItems.map((item) => renderMenu(item))}
              <IconButton component={Link} to="/basket" sx={{ color: "inherit" }}>
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
