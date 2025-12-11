import {
  Box,
  Modal,
  TextField,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Typography,
  Stack,
  Grid,
} from "@mui/material";
import { useEffect, useState, useContext } from "react";
import latLng from "../utils/locationPoint";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");
// const [reportData, setReportData] = useState({
//   message: "",
//   locationPlace: "",
//   urgency: "",
//   helpTypes: [],
//   additionalInfo: "",
//   lat: locationMark?.lat || null,
//   lng: locationMark?.lng || null,
// });

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 420,
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: { xs: 2, sm: 3 },
};
const urgencyColorMap = {
  Critical: "red", // High Risk
  Urgent: "orange", // Medium Risk
  Moderate: "green", // Low Risk
};

export default function ReportModalForm({ open, setOpen }) {
  const handleClose = () => setOpen(false);
  const locationMark = useContext(latLng);
  const [reports, setReports] = useState([]);
  const [helpTypes, setHelpTypes] = useState({
    Food: false,
    Water: false,
    Medical: false,
    Shelter: false,
    Rescue: false,
    Other: false,
  });

  const [reportData, setReportData] = useState({
    message: "",
    reporterName: "",
    householdCount: "",
    urgency: "",
    helpTypes: [],
    additionalInfo: "",
    lat: locationMark?.lat || null,
    lng: locationMark?.lng || null,
  });

  useEffect(() => {
    socket.on("updateReports", (incomingReports) => {
      setReports(incomingReports);
    });
  }, []);

  useEffect(() => {
    if (locationMark?.lat && locationMark?.lng) {
      setReportData((prev) => ({
        ...prev,
        lat: locationMark.lat,
        lng: locationMark.lng,
      }));
    }
  }, [locationMark]);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setHelpTypes((prev) => ({ ...prev, [name]: checked }));

    const selected = Object.keys({ ...helpTypes, [name]: checked }).filter(
      (key) => ({ ...helpTypes, [name]: checked }[key])
    );

    setReportData((prev) => ({ ...prev, helpTypes: selected }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReportData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const markerColor = urgencyColorMap[reportData.urgency] || "gray";

    socket.emit("sendReport", {
      ...reportData,
      markerColor,
    });

    e.target.reset();
    setHelpTypes({
      Food: false,
      Water: false,
      Medical: false,
      Shelter: false,
      Rescue: false,
      Other: false,
    });
    setReportData({
      message: "",
      reporterName: "",
      householdCount: "",
      urgency: "",
      helpTypes: [],
      additionalInfo: "",
      lat: locationMark?.lat || null,
      lng: locationMark?.lng || null,
    });
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose} keepMounted>
      <Box component="form" onSubmit={handleSubmit} sx={style}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          📍 Report a Need or Request
        </Typography>

        <Stack spacing={2}>
          <TextField
            name="message"
            label="Brief Summary"
            placeholder="e.g. 'Need food'"
            fullWidth
            required
            value={reportData.message}
            onChange={handleChange}
          />

          <TextField
            name="reporterName"
            label="Name of Reporter"
            fullWidth
            required
            value={reportData.reporterName}
            onChange={handleChange}
          />

          <TextField
            name="householdCount"
            label="How many people are in the house?"
            type="text"
            fullWidth
            required
            value={reportData.householdCount}
            onChange={handleChange}
          />

          <FormControl fullWidth required>
            <InputLabel id="urgency-label">Urgency Level</InputLabel>
            <Select
              labelId="urgency-label"
              name="urgency"
              value={reportData.urgency}
              onChange={handleChange}
              label="Urgency Level"
            >
              <MenuItem value="Critical">Critical – Immediate help</MenuItem>
              <MenuItem value="Urgent">Urgent – Within 24 hours</MenuItem>
              <MenuItem value="Moderate">Moderate – Within few days</MenuItem>
            </Select>
          </FormControl>

          <FormGroup>
            <Grid container spacing={1}>
              {Object.keys(helpTypes).map((type) => (
                <Grid item xs={12} sm={6} key={type}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={helpTypes[type]}
                        onChange={handleCheckboxChange}
                        name={type}
                      />
                    }
                    label={type}
                    sx={{ wordBreak: "break-word" }}
                  />
                </Grid>
              ))}
            </Grid>
          </FormGroup>

          <TextField
            name="additionalInfo"
            label="Additional Information"
            multiline
            rows={3}
            fullWidth
            placeholder="Add any extra details..."
            value={reportData.additionalInfo}
            onChange={handleChange}
          />

          <Button type="submit" variant="contained" fullWidth>
            Submit Report
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
