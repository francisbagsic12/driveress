import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Button,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";

const OperationCard = ({ operation, refreshOperations }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const updateStatus = async (id, newStatus) => {
    try {
      // 1. Update operation status
      await axios.put(`http://localhost:5000/api/operations/${id}/status`, {
        status: newStatus,
      });

      // 2. If operation is completed or aborted, reset the rescue team
      if (newStatus === "Completed" || newStatus === "Aborted") {
        await axios.put(
          "http://localhost:5000/api/rescue-teams/status-by-operation",
          {
            operationId: id,
            status: "Ready",
          }
        );
      }

      if (refreshOperations) refreshOperations();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };
  const statusColor =
    operation.status === "Active"
      ? "error"
      : operation.status === "Standby"
      ? "warning"
      : operation.status === "Completed"
      ? "success"
      : "default";

  return (
    <Card
      elevation={3}
      sx={{
        borderLeft: `6px solid ${
          statusColor === "error"
            ? "#d32f2f"
            : statusColor === "warning"
            ? "#f57c00"
            : "#2e7d32"
        }`,
        height: "100%",
        width: isMobile ? "100%" : "auto",
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
            {operation.name}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            📍 {operation.location}
          </Typography>

          <Typography variant="body2">👥 Lead: {operation.lead}</Typography>

          <Chip
            label={operation.status}
            color={statusColor}
            size="small"
            sx={{ alignSelf: "start" }}
          />

          <Stack direction="row" spacing={1} mt={1}>
            <Button
              variant="outlined"
              color="success"
              disabled={
                operation.status === "Completed" ||
                operation.status === "Aborted"
              }
              onClick={() => updateStatus(operation.id, "Completed")}
            >
              ✅ Complete
            </Button>
            <Button
              variant="outlined"
              color="error"
              disabled={
                operation.status === "Aborted" ||
                operation.status === "Completed"
              }
              onClick={() => updateStatus(operation.id, "Aborted")}
            >
              ❌ Abort
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default OperationCard;
