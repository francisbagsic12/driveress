import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

const LiveMap = () => {
  const [incidentData, setIncidentData] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(incidentData);
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await fetch("/mockdata.json");
        const data = await res.json();
        setIncidentData(data);
      } catch (err) {
        console.error("Error fetching incident data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
    const interval = setInterval(fetchIncidents, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ height: "100vh", p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Live Map: Calamity & Incident Reports by Barangay
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <MapContainer
          center={[15.5, 120.9]}
          zoom={8}
          style={{ height: "90%", width: "100%" }}
          scrollWheelZoom
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {incidentData.map((incident, index) => (
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
        </MapContainer>
      )}
      <Box
        sx={{
          position: "absolute",
          top: 80,
          right: 20,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
          p: 2,
          zIndex: 1000,
          minWidth: 200,
        }}
      >
        <Typography variant="subtitle1" gutterBottom>
          🔍 Calamity Type Legend
        </Typography>
        {[
          { type: "Flood", color: "blue" },
          { type: "Earthquake", color: "red" },
          { type: "Fire", color: "orange" },
          { type: "Landslide", color: "brown" },
          { type: "Typhoon", color: "purple" },
        ].map(({ type, color }) => (
          <Box key={type} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Box
              sx={{
                backgroundColor: color,
                width: 16,
                height: 16,
                borderRadius: "50%",
                border: "2px solid white",
                mr: 1,
              }}
            />
            <Typography variant="body2">{type}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default LiveMap;
