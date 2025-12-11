import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { Box } from "@mui/material";
const SearchBar = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        width: "80%",
        maxWidth: 700,
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: 3,
        // padding: 1,
      }}
    >
      <TextField
        fullWidth
        placeholder="Search location..."
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBar;
