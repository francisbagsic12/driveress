import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ResourceCard = ({ resource }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      elevation={3}
      sx={{
        borderLeft: "6px solid #1976d2",
        height: "100%",
        width: isMobile ? "100%" : "auto", // 👈 Full width on mobile
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: isMobile ? 1.5 : 2,
        boxSizing: "border-box",
      }}
    >
      <CardContent>
        <Stack spacing={1}>
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            sx={{ fontWeight: 600 }}
          >
            {resource.name}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            📍 {resource.location}
          </Typography>

          <Typography variant="body2">
            📦 Quantity: {resource.quantity}
          </Typography>

          <Chip
            label={resource.category}
            color="primary"
            size="small"
            sx={{ alignSelf: "start" }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
