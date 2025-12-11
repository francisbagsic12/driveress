import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  Button,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GetAppIcon from "@mui/icons-material/GetApp";
import ReportCard from "./ReportCard";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

const dummyReports = [
  {
    id: 1,
    title: "Flood Incident Summary",
    date: "2025-10-20",
    category: "Incident",
    author: "Barangay 5",
    content: "Summary of flood impact and response in Barangay 5.",
  },
  {
    id: 2,
    title: "Resource Distribution Log",
    date: "2025-10-19",
    category: "Resource",
    author: "Municipal HQ",
    content: "Details of distributed supplies and equipment.",
  },
  {
    id: 3,
    title: "Shelter Occupancy Update",
    date: "2025-10-18",
    category: "Shelter",
    author: "Barangay 12",
    content: "Current shelter usage and capacity status.",
  },
];

const Reports = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [reports, setReports] = useState([]);
  const handleSearch = (e) => setSearch(e.target.value.toLowerCase());
  const handleFilter = (_, newFilter) => setFilter(newFilter || "All");
  console.log("object");
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      (r.title?.toLowerCase().includes(search) ?? false) ||
      (r.category?.toLowerCase().includes(search) ?? false);

    const matchesFilter = filter === "All" || r.category === filter;
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    async function getReports() {
      try {
        const res = await axios.get("http://localhost:5000/api/reports");
        setReports(res.data); // Store fetched reports
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      }
    }

    getReports();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredReports);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");
    XLSX.writeFile(workbook, "reports.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Reports Data", 20, 20);
    let y = 40;
    filteredReports.forEach((report, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${report.title}`, 20, y);
      y += 10;
      doc.text(`Category: ${report.category}`, 30, y);
      y += 10;
      doc.text(`Author: ${report.author}`, 30, y);
      y += 10;
      doc.text(`Date: ${report.date}`, 30, y);
      y += 15;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("reports.pdf");
  };

  return (
    <Box p={{ xs: 2, sm: 3 }}>
      <Typography variant="h4" gutterBottom>
        📄 Reports
      </Typography>
      <Typography variant="body1" gutterBottom>
        Browse and manage operational reports from field teams, shelters, and
        resource units.
      </Typography>

      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mt: 2 }}>
        <TextField
          fullWidth
          placeholder="Search reports by title or category"
          value={search}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={handleFilter}
          sx={{
            mt: 2,
            flexWrap: "wrap",
            justifyContent: isMobile ? "center" : "flex-start",
          }}
        >
          <ToggleButton value="All">All</ToggleButton>
          <ToggleButton value="Incident">Incident</ToggleButton>
          <ToggleButton value="Resource">Resource</ToggleButton>
          <ToggleButton value="Shelter">Shelter</ToggleButton>
        </ToggleButtonGroup>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<GetAppIcon />}
            onClick={exportToExcel}
            color="primary"
          >
            Export to Excel
          </Button>
          <Button
            variant="contained"
            startIcon={<GetAppIcon />}
            onClick={exportToPDF}
            color="secondary"
          >
            Export to PDF
          </Button>
        </Stack>
      </Paper>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={isMobile ? 1 : 2}>
        {filteredReports.map((report) => (
          <Grid item xs={12} sm={6} md={4} key={report.id}>
            <ReportCard report={report} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Reports;
