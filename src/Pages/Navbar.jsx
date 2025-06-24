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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";
import { containerStyles } from "./style";

const navItems = [
  { label: "Home", path: "/" },
  {
    label: "Courses",
    items: [
      { label: "Course List", path: "/course-list" },
    ],
  },
  {
    label: "About",
    path: "/about",
    items: [
      { label: "Team", path: "/about/team" },
      { label: "Mission", path: "/about/mission" },
    ],
  },
  {
    label: "Advice",
    path: "/advice",
    items: [
      { label: "Tips", path: "/advice/tips" },
      { label: "Guidance", path: "/advice/guidance" },
    ],
  },
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
        to={item.path}
        endIcon={item.items ? <ExpandMoreIcon /> : null}
        sx={{
          color: "#000",
          textTransform: "none",
          fontSize: { md: "12px", lg: "16px" },
        }}
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
            <MenuItem
              key={subItem.label}
              onClick={() => handleMenuClose(item.label)}
            >
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
        <Toolbar sx={{ justifyContent: "space-between" ,px:0}}>
          <Link to="/">
            <img src="/assets/images/logo.svg" alt="Logo" style={{ height: 40 }} />
          </Link>

          {/* Desktop Menu */}
          {!isMobile ? (
            <Box sx={{ display: "flex", gap: { md: 2, lg: 4 } }}>
              {navItems.map((item) => renderMenu(item))}
            </Box>
          ) : (
            <>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>

              {/* Mobile Drawer */}
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
              >
                <Box sx={{ width: 250 }}>
                  <List>
                    {navItems.map((item) => (
                      <React.Fragment key={item.label}>
                        <ListItem button onClick={() => setDrawerOpen(false)}>
                          <Link to={item.path} style={{ textDecoration: "none", color: "#000" }}>
                            {item.label}
                            {item.items && (
                              <ExpandMoreIcon sx={{ ml: 1 }} />
                            )}
                          </Link>
                        </ListItem>

                        {item.items &&
                          item.items.map((subItem) => (
                            <ListItem
                              button
                              key={subItem.label}
                              onClick={() => setDrawerOpen(false)}
                              sx={{ pl: 4 }}
                            >
                              <Link to={subItem.path} style={{ textDecoration: "none", color: "#000" }}>
                                {subItem.label}
                              </Link>
                            </ListItem>
                          ))}
                      </React.Fragment>
                    ))}
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
