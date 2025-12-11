import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
const categories = ["Supply", "Medical", "Equipment"];

const AddResourceModal = ({ open, onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.quantity || !form.category) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/resources",
        form
      );

      if (response.status === 201) {
        onAdd(response.data); // update local state with DB response
        setForm({ name: "", quantity: "", category: "" });
        onClose();
      } else {
        console.error("Failed to add resource:", response.data.error);
      }
    } catch (error) {
      console.error("Axios error:", error.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Resource</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Resource Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            select
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            fullWidth
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Add Resource
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddResourceModal;
