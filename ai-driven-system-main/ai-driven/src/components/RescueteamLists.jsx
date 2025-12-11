import {
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
  Button,
} from "@mui/material";

const RescueTeamList = ({ teams, onDelete }) => {
  if (!teams || teams.length === 0) {
    return <ListItemText primary="No rescue teams available." />;
  }

  return (
    <List>
      {teams.map((team) => (
        <ListItem key={team.id} divider>
          <ListItemText
            primary={team.name}
            secondary={`📍 ${team.location || "Unknown"} | 👤 ${
              team.contact_person || "N/A"
            } | 📞 ${team.contact_number || "N/A"}`}
          />
          <Stack direction="row" spacing={1}>
            <Chip
              label={team.status}
              color={
                team.status === "Ready"
                  ? "success"
                  : team.status === "Deployed"
                  ? "warning"
                  : "default"
              }
            />
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => onDelete(team.id)}
            >
              Delete
            </Button>
          </Stack>
        </ListItem>
      ))}
    </List>
  );
};

export default RescueTeamList;
