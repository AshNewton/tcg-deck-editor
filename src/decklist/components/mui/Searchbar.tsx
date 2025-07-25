import React from "react";
import { useTranslation } from "react-i18next";

import Popover from "./Popover";

import Box from "@mui/material/Box";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";

import { useDebounce } from "../../../hooks";

import { Card, Deck } from "../../../types";
import { PopoverPosition } from "@mui/material/Popover";

type Props = {
  onSearch: (s: string) => Promise<Deck>;
  renderOption?: (toRender: Card) => React.ReactNode;
  onOptionSelect: (c: Card) => void;
  onBulkSearch?: (bulkText: string) => void;
};

const SearchBar = (props: Props) => {
  const { onSearch, renderOption, onOptionSelect, onBulkSearch } = props;

  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [results, setResults] = React.useState<Deck>([]);

  const [anchorPos, setAnchorPos] = React.useState<PopoverPosition | null>(
    null
  );
  const [bulkText, setBulkText] = React.useState<string>("");

  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  const { t } = useTranslation();

  React.useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearchTerm && onSearch) {
        try {
          const data = await onSearch(debouncedSearchTerm);
          setResults(
            data.sort((card1, card2) => card1.name.localeCompare(card2.name))
          );
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

  const handleBulkClick = (e: React.MouseEvent) => {
    setAnchorPos({
      top: e.clientY,
      left: e.clientX,
    });
  };

  const handleBulkClose = () => {
    setAnchorPos(null);
    setBulkText("");
  };

  return (
    <Box sx={{ p: 2 }}>
      <TextField
        label={t("common.search")}
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
          endAdornment: (
            <>
              {searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={handleClear} size="small">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )}
              {onBulkSearch && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleBulkClick}
                    size="small"
                    title={t("search.bulkSearch")}
                  >
                    <LibraryAddIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )}
            </>
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

      {anchorPos && (
        <Popover anchorPos={anchorPos} onClose={handleBulkClose}>
          <Box sx={{ p: 2, width: 300 }}>
            <TextField
              multiline
              fullWidth
              rows={6}
              label={t("search.bulkAdd")}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
            />
            <Box display="flex" justifyContent="flex-end" mt={1}>
              <IconButton
                onClick={() => {
                  onBulkSearch?.(bulkText);
                  handleBulkClose();
                }}
                size="small"
                color="primary"
              >
                <SearchIcon />
              </IconButton>
            </Box>
          </Box>
        </Popover>
      )}
    </Box>
  );
};

export default SearchBar;
