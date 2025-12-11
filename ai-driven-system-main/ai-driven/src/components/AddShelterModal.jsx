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

const AddShelterModal = ({ open, onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: "",
    occupancy: 0,
    capacity: 100,
    status: "Moderate",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/shelters", form);
      onAdd(); // refresh list
      onClose();
    } catch (err) {
      console.error("Error adding shelter:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add New Shelter</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Shelter Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Occupancy"
            name="occupancy"
            type="number"
            value={form.occupancy}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Capacity"
            name="capacity"
            type="number"
            value={form.capacity}
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
            {["Moderate", "High", "Critical"].map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Add Shelter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddShelterModal;
