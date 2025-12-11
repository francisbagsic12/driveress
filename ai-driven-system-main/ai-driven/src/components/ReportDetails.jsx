import { useParams } from "react-router-dom";
import { Box, Typography, Paper } from "@mui/material";

const dummyReports = [
  {
    id: 1,
    title: "Flood Incident Summary",
    date: "2025-10-20",
    category: "Incident",
    author: "Barangay 5",
    content:
      "This report summarizes the flood incident in Barangay 5 including affected households and response actions.",
  },
  // Add more reports as needed
];

const ReportDetails = () => {
  const { id } = useParams();
  const report = dummyReports.find((r) => r.id === parseInt(id));

  if (!report) {
    return <Typography>Report not found.</Typography>;
  }

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        {report.title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        🗓 {report.date} | 🖊 {report.author} | 📁 {report.category}
      </Typography>

      <Paper elevation={2} sx={{ mt: 3, p: 2 }}>
        <Typography variant="body1">{report.content}</Typography>
      </Paper>
    </Box>
  );
};

export default ReportDetails;
