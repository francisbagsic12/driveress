import {
  Box,
  Toolbar,
  AppBar,
  IconButton,
  Typography,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Menu, MenuItem } from "@mui/material";
import quezonlogo from "../assets/quezonlogo.png";

const DashboardLayout = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  
  const open = Boolean(anchorEl);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    localStorage.removeItem("token"); // or sessionStorage
    window.location.href = "/"; // redirect to login
  };
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <Box
      sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#5bf1b8ff" }}
    >
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: "#f7fafaea",
          color: "#333",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar
          sx={{ display: "flex", justifyContent: "space-between", px: 2 }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box>
              <img style={{
                width:"40px",height:"40px",margin:"1px"
              }} src={quezonlogo} alt="" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600,margin:"1rem" }}>
              AI Driven Assistant for Calamity Response for LGU Operations and Management
            </Typography>
          </Box>

          {/* Right-side welcome message with avatar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" sx={{ color: "#555", fontWeight: 500 }}>
              Welcome, Admin
            </Typography>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "#1976d2",
                cursor: "pointer",
              }}
              onClick={handleAvatarClick}
            >
              A
            </Avatar>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          mt: { xs: 7, sm: 8 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
