import {
  Box,
  Toolbar,
  Container,
  IconButton,
  Typography,
  CssBaseline,
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import SectionCard from "../components/SectionCard";
import ResourceChart from "../components/ResourceChat";
import ShelterChart from "../components/ShelterChart";
import WeatherForecast from "../components/WeatherForecast";
import OperationChart from "../components/OperationChart";
import ReportChart from "../components/ReportChart";

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box
      sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f4f6f8" }}
    >
      <CssBaseline />

      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Toolbar
          sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            📊 LGU Disaster Dashboard
          </Typography>
        </Toolbar>

        <Container maxWidth="xl">
          <Stack spacing={3}>
            <SectionCard title="🌦️ Weather Forecast">
              <WeatherForecast />
            </SectionCard>

            <SectionCard title="📡 Operation Feed">
              <OperationChart />
            </SectionCard>

            <SectionCard title="🚚 Resources">
              <ResourceChart />
            </SectionCard>

            <SectionCard title="🏠 Shelter Status">
              <ShelterChart />
            </SectionCard>

            <SectionCard title="📊Reports">
              <ReportChart />
            </SectionCard>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
