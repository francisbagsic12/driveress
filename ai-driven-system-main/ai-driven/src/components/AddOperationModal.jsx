import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  FormHelperText,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

const quezonBarangays = [
  "Aguinaldo",
  "Balite",
  "Burgos",
  "Del Pilar",
  "Doña Lucia",
  "Lusok",
  "Magsaysay",
  "Poblacion",
  "San Alejandro",
  "San Andres",
  "San Antonio",
  "San Isidro",
  "San Jose",
  "San Manuel",
  "San Miguel",
  "Santa Rita",
];

const AddOperationModal = ({ open, onClose, refresh }) => {
  const [rescueTeams, setRescueTeams] = useState([]);
  const [form, setForm] = useState({
    name: "",
    lead: "",
    location: "",
    assignedTeam: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Operation name is required";
    if (!form.lead) newErrors.lead = "Lead team is required";
    if (!form.assignedTeam) newErrors.assignedTeam = "Rescue team is required";
    if (!form.location) newErrors.location = "Target location is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchRescueTeams = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/rescue-teams");
        const availableTeams = res.data.filter(
          (team) => team.status === "Ready" || team.status === "Standby"
        );
        setRescueTeams(availableTeams);
      } catch (err) {
        console.error("Failed to fetch rescue teams:", err);
      }
    };

    fetchRescueTeams();
  }, []);

  const handleSubmit = async () => {
    if (isSubmitting || !validate()) return;
    setIsSubmitting(true);

    try {
      const res = await axios.post("http://localhost:5000/api/operations", {
        ...form,
        status: "Active", // default status for new operations
      });
      if (res.status === 201) {
        refresh();
        setForm({ name: "", lead: "", location: "", assignedTeam: "" });
        onClose();
      }
    } catch (err) {
      console.error("Error adding operation:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 600 }}>
        🛠️ Create New Operation
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} mt={1}>
          <TextField
            label="Operation Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />
          <TextField
            label="Lead Team"
            name="lead"
            value={form.lead}
            onChange={handleChange}
            error={!!errors.lead}
            helperText={errors.lead}
            fullWidth
          />
          <TextField
            select
            label="Assign Rescue Team"
            name="assignedTeam"
            value={form.assignedTeam}
            onChange={handleChange}
            error={!!errors.assignedTeam}
            helperText={errors.assignedTeam}
            fullWidth
          >
            {rescueTeams.map((team) => (
              <MenuItem key={team.id} value={team.name}>
                {team.name} ({team.status})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Target Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            error={!!errors.location}
            helperText={errors.location}
            fullWidth
          >
            {quezonBarangays.map((barangay) => (
              <MenuItem key={barangay} value={barangay}>
                {barangay}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Create Operation
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddOperationModal;
