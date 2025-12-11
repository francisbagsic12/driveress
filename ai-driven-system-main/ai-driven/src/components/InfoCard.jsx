import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Chip,
  Box,
  Avatar,
  Divider,
} from "@mui/material";
import { red } from "@mui/material/colors";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import addresss from "../utils/context";
import { useContext } from "react";

export default function InfoCard({ report }) {
  const {
    message = "No message provided",
    reporterName = "Anonymous",
    householdCount,
    urgency,
    helpTypes = [],
    additionalInfo,
    lat,
    lng,
  } = report || {};

  const userAddress = useContext(addresss);
  const locationDisplay =
    userAddress?.village || userAddress?.town || userAddress?.state
      ? `${userAddress.village ?? ""} ${userAddress.town ?? ""} ${
          userAddress.state ?? ""
        }`.trim()
      : "Unknown Location";

  return (
    <Card
      sx={{
        maxWidth: 400,
        boxShadow: 4,
        borderRadius: 2,
        padding: 2,
        backgroundColor: "#f9f9f9",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }}>
            <WarningIcon />
          </Avatar>
        }
        title={locationDisplay}
        subheader={
          lat && lng
            ? `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
            : "Coordinates unavailable"
        }
      />

      <Divider sx={{ my: 1 }} />

      <CardContent>
        <Typography variant="body1" gutterBottom>
          <strong>🚨 Message:</strong> {message}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>👤 Reporter:</strong> {reporterName}
        </Typography>

        {householdCount && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>🏠 Households Affected:</strong> {householdCount}
          </Typography>
        )}

        {urgency && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>⚠️ Urgency:</strong> {urgency}
            </Typography>
          </Box>
        )}

        {helpTypes.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>🆘 Help Needed:</strong>
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {helpTypes.map((type, index) => (
                <Chip
                  key={index}
                  label={type}
                  icon={<HelpOutlineIcon />}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}

        {additionalInfo && (
          <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
            <InfoIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {additionalInfo}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
