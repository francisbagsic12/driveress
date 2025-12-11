import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Paper, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

const ReportChart = () => {
  const [data, setData] = useState([]);

  const fetchDailyReports = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/daily-reports");
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch daily reports:", err);
    }
  };

  useEffect(() => {
    fetchDailyReports();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        📊Report Activity
      </Typography>
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#43a047" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default ReportChart;
