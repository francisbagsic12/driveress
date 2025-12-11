import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import getLocation from "../utils/getLocation";
import InfoCard from "../components/InfoCard";
import { useEffect, useState, useContext } from "react";
import { Box, Typography } from "@mui/material";
//utils
import getAddress from "../utils/getAddress";
import address from "../utils/context";
import SearchBar from "../components/SearchBar";
import latLng from "../utils/locationPoint";
import "../pages/loader.css";
import { useRef, useCallback } from "react";

//others
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
const socket = io("http://localhost:5000");
import FloatingReporticon from "../components/FloatingReportIcon";
import L from "leaflet";
import ReportModalForm from "../components/ReportModalForm";
function CustomMap() {
  // const myIcon = L.icon({
  //   iconUrl:
  //     "https://tse1.mm.bing.net/th/id/OIP.oZVPYPQtzAw2rIw48Fyy2QHaHa?pid=ImgDet&w=206&h=206&c=7&o=7&rm=3",
  //   iconSize: [32, 32],
  // });

  //for reports
const mapRef = useRef(null);

const handleMapLoad = useCallback((mapInstance) => {
  mapRef.current = mapInstance;
}, []);

  const [reports, setReports] = useState([]);
  //
  const [hasReported, setHasReported] = useState(false);
  const [loadingReports, setLoadingReports] = useState(true);

  const [userLocations, setUserLocations] = useState({});
  const [currentLocation, setCurrentLocation] = useState(null);
  const [placeName, setPlaceName] = useState({
    village: "",
    town: "",
    state: "",
  });
  const navigate = useNavigate();

  const curAddress = useContext(address);
  console.log(Object.entries(reports));
  const locationMark = useContext(latLng);

  useEffect(() => {
    const fetchReports = () => {
      if (socket.connected) {
        console.log("Socket already connected, fetching reports");
        socket.emit("getReports");
      } else {
        socket.once("connect", () => {
          console.log("Socket connected, fetching reports");
          socket.emit("getReports");
        });
      }
    };

    setLoadingReports(true);
    fetchReports();

    const handleUpdateReports = (incomingReports) => {
      const parsedReports = incomingReports.map((report) => {
        let parsedHelpTypes = [];

        try {
          parsedHelpTypes = JSON.parse(report.helpTypes);
        } catch (err) {
          console.warn("Failed to parse helpTypes:", report.helpTypes);
        }

        return {
          ...report,
          helpTypes: Array.isArray(parsedHelpTypes) ? parsedHelpTypes : [],
        };
      });

      setReports(parsedReports);
      setLoadingReports(false);
    };

    const handleUpdateLocations = (locations) => {
      setUserLocations(locations);
    };

    socket.on("updateReports", handleUpdateReports);
    socket.on("updateLocations", handleUpdateLocations);

    return () => {
      socket.off("updateReports", handleUpdateReports);
      socket.off("updateLocations", handleUpdateLocations);
    };
  }, []);
useEffect(() => {
  if (reports.length > 0 && mapRef.current) {
    const bounds = L.latLngBounds(reports.map((r) => [r.lat, r.lng]));
    mapRef.current.fitBounds(bounds, { padding: [50, 50] });
  }
}, [reports]);
  useEffect(() => {
    if (!currentLocation) {
      getLocation().then((loc) => {
        return getAddress(loc.lat, loc.lng).then((address) => {
          const locationData = {
            lat: loc.lat,
            lng: loc.lng,
            village: address.village || "",
            town: address.town || "",
            state: address.state || "",
          };

          // ✅ Step 3: Generate or retrieve persistent userId
          let userId = localStorage.getItem("userId");
          if (!userId) {
            userId = crypto.randomUUID(); // or use any unique ID generator
            localStorage.setItem("userId", userId);
          }

          // Only emit if address is complete
          if (locationData.village && locationData.town && locationData.state) {
            setCurrentLocation(locationData);
            setPlaceName(locationData);
            socket.emit("sendLocation", { ...locationData, userId }); // include userId
          } else {
            console.warn(
              "Incomplete address, location not sent:",
              locationData
            );
          }
        });
      });
    } else {
      console.log("initializing location...");
    }
  }, []);

  // Only render the map once location is available
  if (!currentLocation) {
    return (
      <div className="loader-wrapper">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    // <locationLatLng.Provider value={currentLocation}>
    <Box sx={{ position: "relative", height: "100vh", width: "100vw" }}>
      {/* Search Bar Overlay */}
      <SearchBar />

      {/*admin navigate*/}

      <Box
        sx={{
          position: "absolute",
          top: { xs: 8, md: 16 },
          right: { xs: 8, md: 16 },
          zIndex: 1000,
          backgroundColor: "white",
          borderRadius: "50%",
          padding: { xs: 0.5, md: 1 },
          boxShadow: 3,
          cursor: "pointer",
          background: "green",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: { xs: 36, md: 48 },
          height: { xs: 36, md: 48 },
        }}
        onClick={() => navigate("/adminLogin")}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt="Admin"
          style={{
            width: "70%",
            height: "70%",
            objectFit: "contain",
          }}
        />
      </Box>

      {/* Map */}
      <address.Provider value={placeName}>
  <MapContainer
  center={[currentLocation.lat, currentLocation.lng]}
  zoom={15}
  style={{ height: "100%", width: "100%" }}
  scrollWheelZoom={true}
  whenCreated={handleMapLoad}
>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />
          {/* <Marker position={[currentLocation.lat, currentLocation.lng]}>
            <Popup>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <InfoCard />
              </Box>
            </Popup>
          </Marker> */}
          {/* {Object.entries(userLocations).map(([id, loc]) => (
            <Marker key={id} position={[loc.lat, loc.lng]}>
              <Popup>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <InfoCard />
                </Box>
              </Popup>
            </Marker>
          ))} */}
          {reports.map((report, index) => {
            // Map urgency to color
            const urgencyColorMap = {
              Critical: "#d32f2f", // High Risk - Red
              Urgent: "#f57c00", // Medium Risk - Orange
              Moderate: "#388e3c", // Low Risk - Green
            };

            const markerColor = urgencyColorMap[report.urgency] || "#757575"; // Default gray

            return (
              <Marker
                key={`report-${index}`}
                position={[report.lat, report.lng]}
                icon={L.divIcon({
                  className: "report-icon",
                  html: `<div style="background:${markerColor};border-radius:50%;width:24px;height:24px;border:2px solid white;"></div>`,
                  iconSize: [24, 24],
                  iconAnchor: [12, 24],
                  popupAnchor: [0, -24],
                })}
              >
                <Popup>
                  <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle2">
                      📍 {report.village}, {report.town}, {report.state}
                    </Typography>
                    <InfoCard report={report} />
                  </Box>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </address.Provider>
      <latLng.Provider value={currentLocation}>
        <FloatingReporticon />
      </latLng.Provider>
    </Box>
  );
}

export default CustomMap;
