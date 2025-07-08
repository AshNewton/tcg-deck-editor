import React from "react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

import Popover from "./Popover";
import Text from "./Text";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { PopoverPosition } from "@mui/material/Popover";

import { Deck, NameValue } from "../../../types";

type Props = {
  title: string;
  data: Array<NameValue>;
  xLabel: string;
  yLabel?: string;
  filterBy: (o: any) => Deck;
};

const BarChart = (props: Props) => {
  const { title, data, xLabel, yLabel = "Count", filterBy } = props;

  const [anchorPos, setAnchorPos] = React.useState<PopoverPosition | null>(
    null
  );

  const [filter, setFilter] = React.useState<Deck | null>(null);

  const handleClick = (value: string, e: React.MouseEvent) => {
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
        <ReBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            label={{
              value: xLabel,
              position: "insideBottom",
              offset: -5,
            }}
          />
          <YAxis
            allowDecimals={false}
            label={{
              value: yLabel,
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" name="Card Count">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                cursor="pointer"
                onClick={(e: React.MouseEvent) => handleClick(entry.name, e)}
              />
            ))}
          </Bar>
        </ReBarChart>
      </ResponsiveContainer>

      {anchorPos && (
        <Popover anchorPos={anchorPos} onClose={handleClose}>
          <Box sx={{ maxHeight: 300, overflowY: "auto", p: 2, width: 250 }}>
            <List dense>
              {filter?.map((card, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${card.copies} ${card.name}`} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Popover>
      )}
    </>
  );
};

export default BarChart;
