import * as React from "react";

import Button from "./Button";

import Box from "@mui/material/Box";
import DownloadIcon from "@mui/icons-material/Download";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UploadIcon from "@mui/icons-material/Upload";

import { useAppDispatch } from "../../../hooks";

import { JSON_OPTS } from "../../util/constants";

import { Card, mtgCard, Opts, pokemonCard, ygoCard } from "../../../types";

type MenuAction = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

type Props = {
  saveload: Array<any>;
  justifyContent?: string;
  validateCard: (card: ygoCard | mtgCard | pokemonCard) => boolean;
  menuActions?: Array<MenuAction>;
};

export const saveFile = async (content: string, opts: Opts = JSON_OPTS) => {
  try {
    // open file writer

    if (!window.showSaveFilePicker) {
      console.error("File picker is not supported in this browser.");
      return;
    }

    const handle = await window.showSaveFilePicker(opts);

    const writable = await handle.createWritable();

    // save
    await writable.write(content);
    await writable.close();
  } catch (err) {
    console.error("Save cancelled or failed:", err);
  }
};

const SaveLoad = (props: Props) => {
  const {
    saveload,
    validateCard,
    justifyContent = "flex-end",
    menuActions,
  } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const dispatch = useAppDispatch();

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSave = async () => {
    // format data to save
    const data = saveload.reduce((acc, item) => {
      acc[item.name] = item.getter;
      return acc;
    }, {});

    const contents = JSON.stringify(data, null, 2);

    saveFile(contents);
  };

  const handleLoad = async () => {
    try {
      if (!window.showOpenFilePicker) {
        console.error("File picker is not supported in this browser.");
        return;
      }

      const [fileHandle] = await window.showOpenFilePicker();
      const file = await fileHandle.getFile();
      const text = await file.text();

      const parsed = JSON.parse(text);

      saveload.forEach(({ name, setter }) => {
        const allValid = parsed[name].every((card: Card) =>
          validateCard(card.details)
        );

        if (!allValid) {
          throw new Error(`Invalid card data for deck type`);
        }

        dispatch(setter(parsed[name]));
      });
    } catch (err) {
      const error = err as Error;

      if (error.name !== "AbortError") {
        alert("Failed to load file: " + error.message);
      }
    }
  };

  return (
    <Box
      display="flex"
      justifyContent={justifyContent}
      flexDirection="row"
      alignItems="center"
      gap={2}
      mr={2}
    >
      <Button startIcon={<UploadIcon />} text="Load" onClick={handleLoad} />
      <Button startIcon={<DownloadIcon />} text="Save" onClick={handleSave} />

      {menuActions && menuActions.length > 0 && (
        <>
          <IconButton onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
            {menuActions.map((action, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  handleMenuClose();
                  action.onClick();
                }}
                disabled={action.disabled}
              >
                {action.label}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Box>
  );
};

export default SaveLoad;
