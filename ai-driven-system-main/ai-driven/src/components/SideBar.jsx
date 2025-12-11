import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MapIcon from "@mui/icons-material/Map";
import InsightsIcon from "@mui/icons-material/Insights";
import WarningIcon from "@mui/icons-material/Warning";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import GroupIcon from "@mui/icons-material/Group";
import StorageIcon from "@mui/icons-material/Storage";
import ReportIcon from "@mui/icons-material/Report";
import { Link } from "react-router-dom";

const drawerWidth = 240;
const collapsedWidth = 72;

const navItems = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  {
    label: "AI Assistant",
    icon: <InsightsIcon />,
    path: "/dashboard/ai-assistant",
  },
  {
    label: "Shelters",
    icon: <LocalHospitalIcon />,
    path: "/dashboard/shelters",
  },

  // { label: "Live Map", icon: <MapIcon />, path: "/dashboard/live-map" },

  {
    label: "Rescue Teams",
    icon: <GroupIcon />,
    path: "/dashboard/rescue-teams",
  },
  { label: "Resources", icon: <StorageIcon />, path: "/dashboard/resources" },
  { label: "Reports", icon: <ReportIcon />, path: "/dashboard/reports" },
  {
    label: "Operations",
    icon: <DashboardIcon />,
    path: "/dashboard/operations",
  },
];

const Sidebar = ({
  mobileOpen,
  handleDrawerToggle,
  sidebarOpen,
  toggleSidebar,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const drawerContent = (
    <Box>
      <IconButton
        onClick={isMobile ? handleDrawerToggle : toggleSidebar}
        sx={{ m: 1 }}
      >
        <MenuIcon />
      </IconButton>
      <List>
        {navItems.map((item) => (
          <Tooltip
            title={!sidebarOpen && !isMobile ? item.label : ""}
            placement="right"
            key={item.label}
          >
            <Link
              to={item.path}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem
                button
                onClick={isMobile ? handleDrawerToggle : undefined}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                {(sidebarOpen || isMobile) && (
                  <ListItemText primary={item.label} />
                )}
              </ListItem>
            </Link>
          </Tooltip>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? mobileOpen : true}
      onClose={handleDrawerToggle}
      sx={{
        width: isMobile
          ? drawerWidth
          : sidebarOpen
          ? drawerWidth
          : collapsedWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isMobile
            ? drawerWidth
            : sidebarOpen
            ? drawerWidth
            : collapsedWidth,
          transition: "width 0.3s",
          overflowX: "hidden",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
