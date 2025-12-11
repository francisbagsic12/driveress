// components/IncidentList.jsx
import { List, ListItem, ListItemText } from "@mui/material";

const dummyIncidents = [
  { id: 1, type: "Flood", location: "Barangay 5", severity: "High" },
  { id: 2, type: "Fire", location: "Barangay 12", severity: "Medium" },
];

const IncidentList = () => {
  return (
    <List>
      {dummyIncidents.map((incident) => (
        <ListItem key={incident.id}>
          <ListItemText
            primary={`${incident.type} - ${incident.location}`}
            secondary={`Severity: ${incident.severity}`}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default IncidentList;
