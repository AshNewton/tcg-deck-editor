import React from "react";

import MuiPopover, { PopoverPosition } from "@mui/material/Popover";

type Props = {
  anchorPos: PopoverPosition | undefined;
  onClose?: () => void;
  children: React.ReactNode;
};

const Popover = (props: Props) => {
  const { anchorPos, onClose, children } = props;

  return (
    <MuiPopover
      open={Boolean(anchorPos)}
      anchorReference="anchorPosition"
      anchorPosition={
        anchorPos ? { top: anchorPos.top, left: anchorPos.left } : undefined
      }
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      onClose={onClose}
    >
      {children}
    </MuiPopover>
  );
};

export default Popover;
