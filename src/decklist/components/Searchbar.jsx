import * as React from "react";

import Box from "@mui/material/Box";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

function SearchBar({ onSearch, renderOption, onOptionSelect }) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [results, setResults] = React.useState([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  React.useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearchTerm && onSearch) {
        try {
          const data = await onSearch(debouncedSearchTerm);
          setResults(data);
        } catch (err) {
          console.error("Error fetching search results:", err);
          setResults([]);
        }
      } else {
        setResults([]);
      }
    };

    fetchResults();
  }, [debouncedSearchTerm, onSearch]);

  const handleSelect = (item) => {
    onOptionSelect?.(item);
    setSearchTerm("");
    setResults([]);
  };

  const handleClear = () => {
    setSearchTerm("");
    setResults([]);
  };

  return (
    <Box sx={{ p: 2 }}>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton onClick={handleClear} size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {results.length > 0 && (
        <Box
          sx={{
            maxHeight: 200,
            overflowY: "auto",
            mt: 1,
            border: "1px solid #ccc",
            borderRadius: 1,
          }}
        >
          <List disablePadding>
            {results.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => handleSelect(item)}>
                  {renderOption ? renderOption(item) : JSON.stringify(item)}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}

export default SearchBar;
