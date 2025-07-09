import React from "react";
import {
  Tooltip,
  ResponsiveContainer,
  Cell,
  Pie,
  PieChart as RePieChart,
} from "recharts";

import PopoverList from "./PopoverList";
import Text from "./Text";

import { PopoverPosition } from "@mui/material/Popover";

import { NameValue } from "../../../types";

type Props = {
  title: string;
  data: Array<NameValue>;
  colors: Record<string, string>;
  filterBy: (o: any) => Array<any>;
  formatPopoverText: (item: any) => string;
};

const PieChart = (props: Props) => {
  const { title, data, colors, filterBy, formatPopoverText } = props;

  const [anchorPos, setAnchorPos] = React.useState<PopoverPosition | null>(
    null
  );

  const [filter, setFilter] = React.useState<Array<any> | null>(null);

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
                onClick={(e: React.MouseEvent) => handleClick(entry.name, e)}
              />
            ))}
          </Pie>
          <Tooltip />
        </RePieChart>
      </ResponsiveContainer>

      <PopoverList
        list={filter}
        anchorPos={anchorPos}
        handleClose={handleClose}
        formatText={formatPopoverText}
      />
    </>
  );
};

export default PieChart;
