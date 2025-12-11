// components/IncidentTracker.jsx
import { Box, Typography, Paper, Divider } from "@mui/material";
import IncidentList from "./IncidentsLitsts";
const Incidents = () => {
  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Incident Tracker
      </Typography>
      <Typography variant="body1" gutterBottom>
        Monitor and manage reported incidents in real time. Filter by type,
        severity, and location.
      </Typography>

      <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
        <Typography variant="h6">Recent Incidents</Typography>
        <Divider sx={{ my: 1 }} />
        <IncidentList /> {/* You can modularize this later */}
      </Paper>
    </Box>
  );
};

export default Incidents;
