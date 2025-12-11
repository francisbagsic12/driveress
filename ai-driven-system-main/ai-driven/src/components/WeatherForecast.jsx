import { useEffect, useState } from "react";
import { Paper, Typography, Box, CircularProgress } from "@mui/material";
import axios from "axios";
import getLocation from "../utils/getLocation";
import getAddress from "../utils/getAddress";

const WeatherForecast = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchWeather = async (lat, lng) => {
    try {
      const res = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`
      );
      setWeather(res.data.current_weather);
      setError(false);
      setErrorMessage("");
    } catch (err) {
      console.error("Weather fetch failed:", err);
      setError(true);
      setErrorMessage("Failed to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const loc = await getLocation();
        setLocation(loc);
        const addr = await getAddress(loc.lat, loc.lng);
        setAddress(addr);
        await fetchWeather(loc.lat, loc.lng);
      } catch (err) {
        console.error("Location fetch failed:", err);
        setError(true);
        setErrorMessage("Unable to get your location. Please enable location services and refresh the page.");
        setLoading(false);
      }
    };
    getUserLocation();
  }, []);

  const locationName = address?.city || address?.town || address?.village || "Your Location";

  if (loading) return <CircularProgress />;
  if (error || !weather) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          🌦️ Weather Forecast – {locationName}
        </Typography>
        <Typography color="error">{errorMessage || "Weather data is unavailable."}</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        🌦️ Weather Forecast – {locationName}
      </Typography>
      <Box>
        <Typography variant="body2">
          🌡️ Temp: {weather.temperature}°C
        </Typography>
        <Typography variant="body2">
          🌬️ Wind: {weather.windspeed} m/s
        </Typography>
      </Box>
    </Paper>
  );
};

export default WeatherForecast;
