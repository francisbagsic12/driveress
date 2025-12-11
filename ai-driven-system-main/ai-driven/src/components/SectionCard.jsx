import { Paper, Typography, Box, useMediaQuery, useTheme } from "@mui/material";

const SectionCard = ({ title, children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper
      elevation={4}
      sx={{
        padding: isMobile ? 2 : 3,
        borderRadius: 3,
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(6px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      <Typography
        variant={isMobile ? "h6" : "h5"}
        sx={{ mb: 1.5, fontWeight: 600 }}
      >
        {title}
      </Typography>
      <Box sx={{ fontSize: isMobile ? 14 : 16 }}>{children}</Box>
    </Paper>
  );
};

export default SectionCard;
