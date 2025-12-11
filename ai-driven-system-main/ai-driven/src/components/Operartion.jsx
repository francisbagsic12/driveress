import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  Button,
  Stack,
} from "@mui/material";
import AddOperationModal from "./AddOperationModal";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import OperationCard from "./OperationCard";
import axios from "axios";

const Operations = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [operations, setOperations] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchOperations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/operations");
      setOperations(res.data);
    } catch (err) {
      console.error("Failed to fetch operations:", err);
    }
  };

  useEffect(() => {
    fetchOperations();
  }, []);

  const handleSearch = (e) => setSearch(e.target.value.toLowerCase());
  const handleFilter = (_, newFilter) => setFilter(newFilter || "All");

  const handleAddOperation = async (newOp) => {
    console.log("Adding operation:", newOp);
    try {
      // 1. Add the operation
      const res = await axios.post(
        "http://localhost:5000/api/operations",
        newOp
      );

      // 2. Update the assigned rescue team's status to "Deployed"
      if (newOp.assignedTeam) {
        await axios.put("http://localhost:5000/api/rescue-teams/status", {
          name: newOp.assignedTeam,
          status: "Deployed",
        });
      }

      // 3. Refresh operations list
      fetchOperations();
    } catch (err) {
      console.error("Failed to add operation or update team status:", err);
    }
  };

  const filteredOperations = operations.filter((op) => {
    const matchesSearch =
      op.name.toLowerCase().includes(search) ||
      op.status.toLowerCase().includes(search);
    const matchesFilter = filter === "All" || op.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <Box p={{ xs: 2, sm: 3 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        🚨 Emergency Operations
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Monitor and manage all active, standby, and completed disaster response
        efforts.
      </Typography>

      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, sm: 3 },
          mt: 2,
          borderRadius: 3,
          backgroundColor: "#fefefe",
        }}
      >
        <Stack spacing={3}>
          <TextField
            fullWidth
            placeholder="Search by name or status"
            value={search}
            onChange={handleSearch}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={handleFilter}
            sx={{
              flexWrap: "wrap",
              justifyContent: isMobile ? "center" : "flex-start",
              gap: 1,
            }}
          >
            {["All", "Active", "Standby", "Completed", "Aborted"].map(
              (status) => (
                <ToggleButton
                  key={status}
                  value={status}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    px: 2,
                    py: 1,
                    fontWeight: 500,
                  }}
                >
                  {status}
                </ToggleButton>
              )
            )}
          </ToggleButtonGroup>
        </Stack>
      </Paper>

      <Divider sx={{ my: 4 }} />

      <Grid container spacing={isMobile ? 2 : 3}>
        {filteredOperations.map((op) => (
          <Grid item xs={12} sm={6} md={4} key={op.id}>
            <OperationCard operation={op} refreshOperations={fetchOperations} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, textAlign: isMobile ? "center" : "left" }}>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setModalOpen(true)}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            py: 1.5,
          }}
        >
          Add Operation
        </Button>
      </Box>

      <AddOperationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        refresh={fetchOperations}
      />
    </Box>
  );
};

export default Operations;
