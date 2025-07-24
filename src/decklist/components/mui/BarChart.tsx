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
import { useTranslation } from "react-i18next";

import PopoverList from "./PopoverList";
import Text from "./Text";

import { PopoverPosition } from "@mui/material/Popover";

import { NameValue } from "../../../types";

type Props = {
  title: string;
  data: Array<NameValue>;
  xLabel: string;
  yLabel?: string;
  filterBy: (o: any) => Array<any>;
  formatPopoverText: (item: any) => string;
};

const BarChart = (props: Props) => {
  const { title, data, xLabel, yLabel, filterBy, formatPopoverText } = props;

  const [anchorPos, setAnchorPos] = React.useState<PopoverPosition | null>(
    null
  );

  const [filter, setFilter] = React.useState<Array<any> | null>(null);

  const { t } = useTranslation();

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

  const translatedYLabel = yLabel ?? t("common.count");

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
              value: translatedYLabel,
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" name={translatedYLabel}>
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
      <PopoverList
        list={filter}
        handleClose={handleClose}
        formatText={formatPopoverText}
        anchorPos={anchorPos}
      />
    </>
  );
};

export default BarChart;
