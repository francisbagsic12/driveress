import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Custom icon based on severity
const getIconBySeverity = (severity) => {
  const color =
    {
      high: "red",
      medium: "orange",
      low: "green",
    }[severity] || "gray";

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background-color:${color};
      width:20px;
      height:20px;
      border-radius:50%;
      border:2px solid white;
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const BarangayIncidentLayer = ({ incidents }) => {
  return (
    <>
      {incidents.map((incident, index) => (
        <Marker
          key={index}
          position={[incident.lat, incident.lng]}
          icon={getIconBySeverity(incident.severity)}
        >
          <Popup>
            <strong>{incident.barangay}</strong>
            <br />
            Type: {incident.type}
            <br />
            Severity: {incident.severity}
            <br />
            Time: {new Date(incident.timestamp).toLocaleString()}
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default BarangayIncidentLayer;
