import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Paper, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

const ResourceChart = () => {
  const [data, setData] = useState([]);

  const fetchResources = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/resources");
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch resources:", err);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        📊 Resource Inventory
      </Typography>
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantity" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default ResourceChart;
