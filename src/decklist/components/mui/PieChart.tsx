import React from "react";
import {
  Tooltip,
  ResponsiveContainer,
  Cell,
  Pie,
  PieChart as RePieChart,
} from "recharts";

import Text from "./Text";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";

type Props = {
  title: string;
  data: { name: string; value: number }[];
  colors: any;
  filterBy: (o: any) => any[];
};

const PieChart = (props: Props) => {
  const { title, data, colors, filterBy } = props;

  const [anchorPos, setAnchorPos] = React.useState<{
    top: number;
    left: number;
  } | null>(null);

  const [filter, setFilter] = React.useState<any[] | null>(null);

  const handleClick = (value: string, e: any) => {
    setFilter(filterBy(value));
    setAnchorPos({
      top: e.clientY,
      left: e.clientX,
    });
  };

  const handleClose = () => {
    setFilter(null);
    setAnchorPos(null);
  };

  return (
    <>
      <Text text={title} variant="h6" align="center" />
      <ResponsiveContainer height={300}>
        <RePieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[entry.name] || "#ccc"}
                onClick={(e) => handleClick(entry.name, e)}
              />
            ))}
          </Pie>
          <Tooltip />
        </RePieChart>
      </ResponsiveContainer>

      {anchorPos && (
        <Popover
          open={Boolean(anchorPos)}
          anchorReference="anchorPosition"
          anchorPosition={
            anchorPos
              ? {
                  top: anchorPos.top,
                  left: anchorPos.left,
                }
              : undefined
          }
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          onClose={handleClose}
        >
          <Box sx={{ maxHeight: 300, overflowY: "auto", p: 2, width: 250 }}>
            <List dense>
              {filter?.map((card, index) => (
                <ListItem key={index}>
                  <ListItemText primary={card.name} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Popover>
      )}
    </>
  );
};

export default PieChart;
