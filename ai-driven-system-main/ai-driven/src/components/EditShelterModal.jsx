import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

const EditShelterModal = ({ open, onClose, shelter, onUpdate }) => {
  const [form, setForm] = useState({
    name: "",
    capacity: 0,
    occupancy: 0,
    status: "Moderate",
  });

  useEffect(() => {
    if (shelter) setForm(shelter);
  }, [shelter]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/shelters/${shelter.id}`, form);
      onUpdate();
      
      onClose();
    } catch (err) {
      console.error("Failed to update shelter:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Shelter</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="dense"
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Capacity"
          name="capacity"
          type="number"
          value={form.capacity}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Occupancy"
          name="occupancy"
          type="number"
          value={form.occupancy}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditShelterModal;
