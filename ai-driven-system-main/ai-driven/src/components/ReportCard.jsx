import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import { useState } from "react";

const ReportCard = ({ report }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Card
        elevation={3}
        sx={{
         
        }}
      >
        <CardContent
          sx={{
            
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ flexWrap: "wrap" }}
          >
            <DescriptionIcon color="action" />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {report.title}
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            🗓 {report.date}
          </Typography>
          <Typography variant="body2">🖊 Author: {report.author}</Typography>
          {report.householdCount && (
            <Typography variant="body2">🏠 Household Count: {report.householdCount}</Typography>
          )}
          {report.lat && report.lng && (
            <Typography variant="body2">📍 Latitude: {report.lat}, Longitude: {report.lng}</Typography>
          )}

          <Typography variant="body2">📁 Category: {report.category}</Typography>

          <Button
            variant="outlined"
            size="small"
            sx={{ mt: "auto" }}
            fullWidth
            onClick={handleOpen}
          >
            View Report
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={isMobile}
        fullWidth
        maxWidth="sm"
        scroll="paper"
      >
        <DialogTitle>{report.title}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            🗓 {report.date} | 🖊 {report.author} | 📁 {report.category}
          </Typography>
          {report.householdCount && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              🏠 Families Affected: {report.householdCount}
            </Typography>
          )}
          {report.lat && report.lng && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              📍 Lat: {report.lat}, Lng: {report.lng}
            </Typography>
          )}
          <Typography variant="body1" sx={{ mt: 2 }}>
            {report.content ||
              "This is a placeholder for the full report content. You can integrate backend data or PDF previews here."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReportCard;
