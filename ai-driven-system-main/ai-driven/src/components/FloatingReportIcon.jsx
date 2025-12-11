import { useState } from "react";
import Fab from "@mui/material/Fab";
import NavigationIcon from "@mui/icons-material/Navigation";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ReportModalForm from "../components/ReportModalForm";
import ReportIcon from "@mui/icons-material/Report";
export default function FloatingReporticon() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 16,
        right: 16,
        zIndex: 1000,
      }}
    >
      <Fab variant="extended" color="primary" onClick={() => handleOpen()}>
        <ReportIcon sx={{ mr: 1 }} />
        report location
      </Fab>
      <ReportModalForm open={open} setOpen={setOpen} />
    </Box>
  );
}
