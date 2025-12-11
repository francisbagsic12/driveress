import {
  Box,
  Typography,
  Grid,
  Paper,
  LinearProgress,
  Chip,
  Divider,
  useMediaQuery,
  useTheme,
  Button,Stack
} from "@mui/material";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useState, useEffect } from "react";
import axios from "axios";
import AddShelterModal from "./AddShelterModal";
import EditShelterModal from "./EditShelterModal";
// const getStatusColor = (shelter) => {
//   // switch (status) {
//   //   case "High":
//   //     return "warning";
//   //   case "Moderate":
//   //     return "info";
//   //   case "Critical":
//   //     return "error";
//   //   default:
//   //     return "default";

 
//   // }
//  if(shelter.status === "High" ){
//      return "warning";
//   } else  if(shelter.status === "Moderate"   ){
//     return "warning";
//   } else  if(shelter.status === "Critical"  ){
//     return "warning";
//   }
// };

// // const getPercent =(shelter) =>{
// // if((Number(shelter.occupancy)/Number(shelter.capacity)) * 100 <= 30){
// //   return 
// // }
// // }
const Shelters = () => {
const getStatusColor = (percent) => {
  if (percent >= 90) return "error";      // Full
  if (percent >= 60) return "warning";    // Medium
  return "success";                       // Low
};

const getStatusLabel = (percent) => {
  if (percent >= 90) return "Full";
  if (percent >= 60) return "Medium";
  return "Low";
};

const [percent,SetPercent] = useState(0);
// const statusColor = getStatusColor(percent);
// const statusLabel = getStatusLabel(percent);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [shelters, setShelters] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedShelter, setSelectedShelter] = useState(null);
  const fetchShelters = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/shelters");
      setShelters(res.data);
    } catch (err) {
      console.error("Failed to fetch shelters:", err);
    }
  };
 const handleDeleteClick = async (shelterId) => {

  try {
    await axios.delete(`http://localhost:5000/api/shelters/${shelterId}`);
    fetchShelters(); // Refresh the list
  } catch (err) {
    console.error("Failed to delete shelter:", err);
  }
};
  const handleEditClick = (shelter) => {
    setSelectedShelter(shelter);
    
    setEditModalOpen(true);
  };
  useEffect(() => {
    fetchShelters();
  }, []);

  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        fontWeight={600}
        gutterBottom
      >
        🏠 Shelter Status
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Real-time occupancy and capacity alerts for evacuation centers.
      </Typography>

      <Grid container spacing={3}>
    { shelters.map((shelter, index) => {
    const percent = (shelter.occupancy / shelter.capacity) * 100;
    const statusColor = getStatusColor(percent);
    const statusLabel = getStatusLabel(percent);

    return (
      <Grid item xs={12} md={6} key={index}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Box display="flex" alignItems="center" mb={1}>
            <HomeWorkIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">{shelter.name}</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {shelter.occupancy} out of {shelter.capacity} occupants
          </Typography>
          <LinearProgress
            variant="determinate"
            value={percent}
            sx={{ height: 10, borderRadius: 5, mb: 1 }}
            color={statusColor}
          />
          <Chip
            label={`${statusLabel} Alert`}
            color={statusColor}
            size="small"
          />
        </Paper>
        <Stack flex ="2">
        <Button
          variant="outlined"
          size="small"
          sx={{ mt: 2 }}
          onClick={() => handleEditClick(shelter)}
        >
          Edit
        </Button>
         <Button
    variant="outlined"  
    size="small"
    color="error"
    onClick={() => handleDeleteClick(shelter.id)}
  >
    Delete
  </Button>
  </Stack>
      </Grid>
    );
})}

      </Grid>

      <Box sx={{ mt: 4, textAlign: isMobile ? "center" : "left" }}>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setModalOpen(true)}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
        >
          Add Shelter
        </Button>
      </Box>

      <AddShelterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={fetchShelters}
      />

      <Divider sx={{ my: 4 }} />
      <Typography variant="body2" color="text.secondary" align="center">
        Panatilihing ligtas ang ating mga kababayan sa pamamagitan ng maayos na
        pamamahala ng mga evacuation centers.
      </Typography>
      <EditShelterModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        shelter={selectedShelter}
        onUpdate={fetchShelters}
      />
    </Box>
  );
};

export default Shelters;
