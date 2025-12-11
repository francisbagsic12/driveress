import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
const quezonBarangays = [
  "Bertese",
  "Pulong Bahay",
  "Doña Lucia",
  "Ilog Baliwag",
  "San Alejandro",
  "San Andres 1", 
  "San Andres 2",
  "Sto Cristo",
  "Santa Clara",
  "San Manuel",
  "San Miguel",
  "Santa Rita", 
  "Barangay 1",
  "Barangay 2", 
  "Sto. Tomas Feria",
  'Dulong Bayan',
];

const AddRescueTeamForm = ({ open, onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: "",
    status: "",
    location: "",
    contact_person: "",
    contact_number: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/rescue-teams",
        form
      );
      if (res.status === 201) {
        onAdd(res.data);
        setForm({
          name: "",
          status: "",
          location: "",
          contact_person: "",
          contact_number: "",
        });
        onClose();
      }
    } catch (err) {
      console.error("Error adding rescue team:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add New Rescue Team</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Team Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            select
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            fullWidth
          >
            {["Ready", "Deployed", "Resting"].map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            fullWidth
          >
            {quezonBarangays.map((barangay) => (
              <MenuItem key={barangay} value={barangay}>
                {barangay}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Contact Person"
            name="contact_person"
            value={form.contact_person}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Contact Number"
            name="contact_number"
            value={form.contact_number}
            onChange={handleChange}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Add Team
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRescueTeamForm;
