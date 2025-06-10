import React from "react";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import MuiCard from "@mui/material/Card";

type Props = {
  title: string;
  onOpen?: () => void;
  onCollapse?: () => void;
  children: React.ReactNode;
};

const CollapsibleDropdown = (props: Props) => {
  const { title, onOpen, onCollapse, children } = props;

  const [open, setOpen] = React.useState(false);

  const toggleOpen = () => {
    if (open && onCollapse) {
      onCollapse();
    }
    if (!open && onOpen) {
      onOpen();
    }
    setOpen((prev) => !prev);
  };

  return (
    <MuiCard
      elevation={0}
      sx={{
        borderRadius: 2,
        m: 2,
      }}
    >
      <List disablePadding>
        <ListItem disablePadding>
          <ListItemButton onClick={toggleOpen}>
            <ListItemText primary={title} />
            <ListItemIcon sx={{ minWidth: "unset" }}>
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemIcon>
          </ListItemButton>
        </ListItem>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box p={2}>{children}</Box>
        </Collapse>
      </List>
    </MuiCard>
  );
};

export default CollapsibleDropdown;
