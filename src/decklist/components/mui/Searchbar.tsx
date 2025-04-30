import React from "react";

import Box from "@mui/material/Box";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";

import { useDebounce } from "../../../hooks";

import { Card, ygoCard } from "../../../types";

type Props = {
  onSearch: (arg0: string) => Promise<Array<ygoCard>>;
  renderOption?: (toRender: Card) => React.ReactNode;
  onOptionSelect: (arg0: Card) => void;
};

const SearchBar = (props: Props) => {
  const { onSearch, renderOption, onOptionSelect } = props;

  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [results, setResults] = React.useState<Array<Card>>([]);

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

  const handleSelect = (item: Card) => {
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
};

export default SearchBar;
