import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Risk level + barangays
const riskBarangays = {
  High: ["Pulong Bahay", "Sta Clara", "Sto Cristo", "San Alejandro", "Ilog Baliwag"],
  Medium: ["San Andres 1", "San Andres 2", "Barangay I", "Sto Tomas Feria"],
  Low: ["San Miguel", "San Manuel", "Barangay II", "Dulong Bayan", "Bertese", "Sta Rita", "Dona Lucia"],
};

// Barangay info
const barangayData = {
  "Barangay I": {
    population: { male: 771, female: 818 },
    households: 447,
    families: 484,
    "4Ps": { male: 175, female: 204 },
    soloParent: { male: 1, female: 6 },
    seniorCitizen: { male: 94, female: 125 },
    pwd: { male: 25, female: 14 },
  },
  "Barangay II": {
    population: { male: 384, female: 438 },
    households: 233,
    families: 254,
    "4Ps": { male: 24, female: 27 },
    soloParent: { male: 0, female: 2 },
    seniorCitizen: { male: 40, female: 56 },
    pwd: { male: 14, female: 16 },
  },
  Bertese: {
    population: { male: 2748, female: 3237 },
    households: 1611,
    families: 1695,
    "4Ps": { male: 795, female: 715 },
    soloParent: { male: 3, female: 11 },
    seniorCitizen: { male: 205, female: 290 },
    pwd: { male: 53, female: 49 },
  },
  "Dona Lucia": {
    population: { male: 1383, female: 1286 },
    households: 681,
    families: 810,
    "4Ps": { male: 211, female: 209 },
    soloParent: { male: 2, female: 7 },
    seniorCitizen: { male: 135, female: 230 },
    pwd: { male: 32, female: 36 },
  },
  "Dulong Bayan": {
    population: { male: 2581, female: 2703 },
    households: 1380,
    families: 1453,
    "4Ps": { male: 470, female: 483 },
    soloParent: { male: 1, female: 17 },
    seniorCitizen: { male: 150, female: 235 },
    pwd: { male: 82, female: 68 },
  },
  "Ilog Baliwag": {
    population: { male: 2090, female: 2018 },
    households: 1084,
    families: 1178,
    "4Ps": { male: 528, female: 507 },
    soloParent: { male: 5, female: 20 },
    seniorCitizen: { male: 170, female: 225 },
    pwd: { male: 29, female: 34 },
  },
  "Pulong Bahay": {
    population: { male: 1122, female: 995 },
    households: 570,
    families: 603,
    "4Ps": { male: 378, female: 363 },
    soloParent: { male: 1, female: 4 },
    seniorCitizen: { male: 95, female: 118 },
    pwd: { male: 22, female: 24 },
  },
  "San Alejandro": {
    population: { male: 1852, female: 1862 },
    households: 1012,
    families: 1036,
    "4Ps": { male: 513, female: 444 },
    soloParent: { male: 2, female: 8 },
    seniorCitizen: { male: 163, female: 205 },
    pwd: { male: 44, female: 34 },
  },
  "San Andres 1": {
    population: { male: 1308, female: 1219 },
    households: 659,
    families: 781,
    "4Ps": { male: 374, female: 311 },
    soloParent: { male: 1, female: 4 },
    seniorCitizen: { male: 100, female: 135 },
    pwd: { male: 26, female: 23 },
  },
  "San Andres 2": {
    population: { male: 1082, female: 959 },
    households: 492,
    families: 501,
    "4Ps": { male: 350, female: 320 },
    soloParent: { male: 0, female: 1 },
    seniorCitizen: { male: 75, female: 96 },
    pwd: { male: 23, female: 14 },
  },
  "San Manuel": {
    population: { male: 1387, female: 1423 },
    households: 588,
    families: 623,
    "4Ps": { male: 232, female: 211 },
    soloParent: { male: 3, female: 9 },
    seniorCitizen: { male: 122, female: 195 },
    pwd: { male: 19, female: 22 },
  },
  "San Miguel": {
    population: { male: 1620, female: 1655 },
    households: 812,
    families: 882,
    "4Ps": { male: 486, female: 479 },
    soloParent: { male: 0, female: 3 },
    seniorCitizen: { male: 92, female: 105 },
    pwd: { male: 30, female: 40 },
  },
  "Sta Clara": {
    population: { male: 1374, female: 1397 },
    households: 678,
    families: 769,
    "4Ps": { male: 287, female: 277 },
    soloParent: { male: 2, female: 17 },
    seniorCitizen: { male: 142, female: 183 },
    pwd: { male: 30, female: 31 },
  },
  "Sta Rita": {
    population: { male: 2320, female: 2220 },
    households: 1222,
    families: 1332,
    "4Ps": { male: 588, female: 584 },
    soloParent: { male: 9, female: 19 },
    seniorCitizen: { male: 141, female: 225 },
    pwd: { male: 57, female: 46 },
  },
  "Sto Cristo": {
    population: { male: 721, female: 662 },
    households: 357,
    families: 384,
    "4Ps": { male: 183, female: 194 },
    soloParent: { male: 0, female: 6 },
    seniorCitizen: { male: 43, female: 55 },
    pwd: { male: 27, female: 16 },
  },
  "Sto Tomas Feria": {
    population: { male: 1275, female: 1277 },
    households: 732,
    families: 741,
    "4Ps": { male: 375, female: 345 },
    soloParent: { male: 0, female: 8 },
    seniorCitizen: { male: 110, female: 118 },
    pwd: { male: 53, female: 33 },
  },
};

export default function AIAssistant() {
  const [riskLevel, setRiskLevel] = useState("");
  const [barangay, setBarangay] = useState("");
  const [loading, setLoading] = useState(false);

  // fake loading delay for "AI" effect
  useEffect(() => {
    if (barangay) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [barangay]);

  const selectedBarangay = barangayData[barangay];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa, #e4ebf5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card
        component={motion.div}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{
          width: "100%",
          maxWidth: 600,
          borderRadius: 4,
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          p: 3,
          backdropFilter: "blur(8px)",
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          AI Barangay Insights
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Select a risk level and barangay to analyze demographic insights.
        </Typography>

        {/* Risk level dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Risk Level</InputLabel>
          <Select
            value={riskLevel}
            onChange={(e) => {
              setRiskLevel(e.target.value);
              setBarangay("");
            }}
          >
            {Object.keys(riskBarangays).map((risk) => (
              <MenuItem key={risk} value={risk}>
                {risk}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Barangay dropdown */}
        <FormControl fullWidth disabled={!riskLevel}>
          <InputLabel>Barangay</InputLabel>
          <Select
            value={barangay}
            onChange={(e) => setBarangay(e.target.value)}
          >
            {riskBarangays[riskLevel]?.map((b) => (
              <MenuItem key={b} value={b}>
                {b}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider sx={{ my: 3 }} />

        {/* Loading & Data Section */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 120,
              }}
            >
              <CircularProgress color="primary" />
              <Typography ml={2}>Analyzing barangay data...</Typography>
            </motion.div>
          ) : (
            selectedBarangay && (
              <motion.div
                key="data"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Typography variant="h6" gutterBottom>
                  {barangay}
                </Typography>
                <Typography variant="body2">
                  🧍 Population: {selectedBarangay.population.male + selectedBarangay.population.female}
                </Typography>
                <Typography variant="body2">
                  🏠 Households: {selectedBarangay.households}
                </Typography>
                <Typography variant="body2">
                  👨‍👩‍👧 Families: {selectedBarangay.families}
                </Typography>
                <Typography variant="body2">
                  🎯 4Ps Beneficiaries:{" "}
                  {selectedBarangay["4Ps"].male + selectedBarangay["4Ps"].female}
                </Typography>
                <Typography variant="body2">
                  ♿ PWD: {selectedBarangay.pwd.male + selectedBarangay.pwd.female}
                </Typography>
                <Typography variant="body2" mt={1} color="text.secondary">
                  💡 Insight: {selectedBarangay.population.male + selectedBarangay.population.female > 2000
                    ? "This barangay has a large population and may require enhanced public services."
                    : "This barangay has a manageable population with balanced demographics."}
                </Typography>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </Card>
    </Box>
  );
}

