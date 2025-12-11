import { Box, Typography, Paper, Divider, Button } from "@mui/material";
import AddRescueTeamForm from "./AddRescueTeamForm";
import RescueTeamList from "./RescueteamLists";
import { useState, useEffect } from "react";
import axios from "axios";

const RescueTeams = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const fetchTeams = async () => {
    const res = await axios.get("http://localhost:5000/api/rescue-teams");
    setTeams(res.data);
  };
  const handleDeleteTeam = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/rescue-teams/${id}`);
      fetchTeams(); // refresh list
    } catch (err) {
      console.error("Failed to delete team:", err);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);
  const handleAddTeam = () => fetchTeams();
  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Rescue Teams
      </Typography>
      <Typography variant="body1" gutterBottom>
        Track deployment status, team locations, and readiness levels across all
        active rescue units.
      </Typography>

      <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
        <Typography variant="h6">Active Teams</Typography>
        <Divider sx={{ my: 1 }} />
        <RescueTeamList teams={teams} onDelete={handleDeleteTeam} />
      </Paper>
      <Button variant="contained" onClick={() => setModalOpen(true)}>
        Add New Team
      </Button>
      <AddRescueTeamForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddTeam}
      />
    </Box>
  );
};

export default RescueTeams;
