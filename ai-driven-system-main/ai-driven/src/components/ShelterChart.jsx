import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { Paper, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

const ShelterChart = () => {
  const [data, setData] = useState([]);

  const fetchShelters = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/shelters");
      const formatted = res.data.map((shelter) => ({
        name: shelter.name,
        occupancy: shelter.occupancy,
        capacity: shelter.capacity,
      }));
      setData(formatted);
    } catch (err) {
      console.error("Failed to fetch shelter data:", err);
    }
  };

  useEffect(() => {
    fetchShelters();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        🏠 Shelter Occupancy Chart
      </Typography>
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="occupancy" fill="#f57c00" name="Occupancy" />
            <Bar dataKey="capacity" fill="#1976d2" name="Capacity" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default ShelterChart;
