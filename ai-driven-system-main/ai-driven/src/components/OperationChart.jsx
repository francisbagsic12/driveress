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

const OperationChart = () => {
  const [data, setData] = useState([]);

  const fetchOperationSummary = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/operation-summary"
      );
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch operation summary:", err);
    }
  };

  useEffect(() => {
    fetchOperationSummary();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        📡 Operation Status Overview
      </Typography>
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#4340f5ff" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default OperationChart;
