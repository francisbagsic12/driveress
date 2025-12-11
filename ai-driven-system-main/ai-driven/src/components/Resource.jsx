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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ResourceCard from "./ResourceCard";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import AddResourceModal from "./AddResourceModal";
import { useEffect } from "react";
import axios from "axios";
const dummyResources = [
  {
    id: 1,
    name: "Water Bottles",
    quantity: 1200,
    location: "Warehouse A",
    category: "Supply",
  },
  {
    id: 2,
    name: "Medical Kits",
    quantity: 300,
    location: "Barangay Health Center",
    category: "Medical",
  },
  {
    id: 3,
    name: "Rescue Ropes",
    quantity: 75,
    location: "HQ Depot",
    category: "Equipment",
  },
  {
    id: 4,
    name: "Blankets",
    quantity: 500,
    location: "Evac Center",
    category: "Supply",
  },
];

const Resources = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [resources, setResources] = useState(dummyResources);
  const handleAddResource = (newResource) => {
    setResources((prev) => [...prev, newResource]);
  };
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSearch = (e) => setSearch(e.target.value.toLowerCase());
  const handleFilter = (_, newFilter) => setFilter(newFilter || "All");

  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search) ||
      r.category.toLowerCase().includes(search);
    const matchesFilter = filter === "All" || r.category === filter;
    return matchesSearch && matchesFilter;
  });
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/resources")
      .then((res) => setResources(res.data))
      .catch((err) => console.error("Failed to fetch resources:", err));
  }, []);
  return (
    <Box p={{ xs: 2, sm: 3 }}>
      <Typography variant="h4" gutterBottom>
        🧰 Resources
      </Typography>
      <Typography variant="body1" gutterBottom>
        Track supplies, equipment, and medical items across all active
        operations.
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3 },
          mt: 2,
          borderRadius: 3,
          backgroundColor: "#f9fafb",
        }}
      >
        <TextField
          fullWidth
          placeholder="🔍 Search by name or category"
          value={search}
          onChange={handleSearch}
          variant="outlined"
          sx={{
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
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
            mt: 3,
            flexWrap: "wrap",
            justifyContent: isMobile ? "center" : "flex-start",
            gap: 1,
          }}
        >
          {["All", "Supply", "Medical", "Equipment"].map((category) => (
            <ToggleButton
              key={category}
              value={category}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 2,
                py: 1,
                fontWeight: 500,
              }}
            >
              {category}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Paper>

      <Divider sx={{ my: 4 }} />

      <Grid container spacing={isMobile ? 1 : 2}>
        {filteredResources.map((resource) => (
          <Grid item xs={12} sm={6} md={4} key={resource.id}>
            <ResourceCard resource={resource} />
          </Grid>
        ))}
      </Grid>
      <Box textAlign="right" mt={2}>
        <Button variant="contained" onClick={() => setModalOpen(true)}>
          ➕ Add Resource
        </Button>
      </Box>
      <AddResourceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddResource}
      />
    </Box>
  );
};

export default Resources;
