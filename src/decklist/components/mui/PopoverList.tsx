import Popover from "./Popover";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { PopoverPosition } from "@mui/material/Popover";

type Props = {
  list: Array<any> | null;
  anchorPos: PopoverPosition | null;
  handleClose: () => void;
  formatText: (item: any) => string;
};

const PopoverList = (props: Props) => {
  const { list, formatText, anchorPos, handleClose } = props;

  if (!anchorPos) return <></>;

  return (
    <Popover anchorPos={anchorPos} onClose={handleClose}>
      <Box sx={{ maxHeight: 300, overflowY: "auto", p: 2, width: 250 }}>
        <List dense>
          {list?.map((item, index) => (
            <ListItem key={index}>
              <ListItemText primary={formatText(item)} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Popover>
  );
};

export default PopoverList;
