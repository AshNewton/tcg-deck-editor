import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

import Text from "../mui/Text";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MuiCard from "@mui/material/Card";
import Popover from "@mui/material/Popover";

import { useAppSelector } from "../../../hooks";

import { Card, Deck } from "../../../types";

const getManaCostDistribution = (deck: Deck) => {
  return deck.reduce((acc, card) => {
    if (!card.details.type_line.includes("Land")) {
      const manaCost = card.details.cmc;
      acc[manaCost] = (acc[manaCost] || 0) + 1;
    }

    return acc;
  }, {} as Record<number, number>);
};

const Mana = () => {
  const [anchorPosManaCost, setAnchorPosManaCost] = React.useState<{
    top: number;
    left: number;
  } | null>(null);
  const [manaCostFilter, setManaCostFilter] = React.useState<Deck | null>(null);

  const deck = useAppSelector((state) => state.ui.maindeck);

  const handleManaCostClick = (manaCost: Number, e: any) => {
    setManaCostFilter(
      deck
        .filter((card) => card.details.cmc === manaCost)
        .sort((c1, c2) => c1.name.localeCompare(c2.name))
    );
    setAnchorPosManaCost({
      top: e.clientY,
      left: e.clientX,
    });
  };

  const handleManaCostClose = () => {
    setManaCostFilter(null);
    setAnchorPosManaCost(null);
  };

  const manaCostData = Object.entries(getManaCostDistribution(deck)).map(
    ([cost, count]) => ({
      cmc: Number(cost),
      count: count,
    })
  );

  return (
    <MuiCard
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        borderRadius: 2,
        mt: 2,
        ml: 2,
        mr: 2,
        p: 2,
      }}
    >
      <Grid container>
        <Grid item xs={12} display="flex" flexDirection="row">
          <Box width="50%">
            <Text text="Mana Cost Distribution" variant="h6" align="center" />
            <ResponsiveContainer height={300}>
              <BarChart data={manaCostData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="cmc"
                  label={{
                    value: "Mana Cost",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                  allowDecimals={false}
                  label={{
                    value: "Count",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" name="Card Count">
                  {manaCostData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      cursor="pointer"
                      onClick={(e) => handleManaCostClick(entry.cmc, e)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>

          {anchorPosManaCost && (
            <Popover
              open={Boolean(anchorPosManaCost)}
              anchorReference="anchorPosition"
              anchorPosition={
                anchorPosManaCost
                  ? { top: anchorPosManaCost.top, left: anchorPosManaCost.left }
                  : undefined
              }
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              onClose={handleManaCostClose}
            >
              <Box sx={{ maxHeight: 300, overflowY: "auto", p: 2, width: 250 }}>
                <List dense>
                  {manaCostFilter?.map((card, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={card.name} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Popover>
          )}
        </Grid>
      </Grid>
    </MuiCard>
  );
};

export default Mana;
