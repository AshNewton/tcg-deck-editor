import BarChart from "../mui/BarChart";
import PieChart from "../mui/PieChart";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MuiCard from "@mui/material/Card";

import { useAppSelector } from "../../../hooks";

import { Card, Deck, mtgCard, NameValue } from "../../../types";

import { MTG_COLORLESS_CODE, MTG_COLORS_HEX } from "../../util/mtg";

const getManaCostDistribution = (deck: Deck): Record<number, number> => {
  return deck.reduce((acc, card) => {
    const mtgCard = card?.details as mtgCard;

    if (!mtgCard?.type_line.includes("Land")) {
      const manaCost = mtgCard.cmc;
      acc[manaCost] = (acc[manaCost] || 0) + card.copies;
    }

    return acc;
  }, {} as Record<number, number>);
};

const getColorIdentityDistribution = (deck: Deck): Array<NameValue> => {
  const dist: Record<string, number> = {
    W: 0, // White
    U: 0, // Blue
    B: 0, // Black
    R: 0, // Red
    G: 0, // Green
    C: 0, // Colorless
  };

  deck.forEach((card: Card) => {
    const colors = (card.details as mtgCard).color_identity;
    if (colors.length === 0) {
      dist["C"] += 1;
    } else {
      colors.forEach((color: string) => {
        dist[color] = (dist[color] || 0) + card.copies;
      });
    }
  });

  return Object.entries(dist)
    .filter(([_, count]) => count > 0)
    .map(([color, count]) => ({
      name: color,
      value: count,
    }));
};

const formatPopoverText = (c: Card) => `${c.copies} ${c.name}`;

const Mana = () => {
  const deck = useAppSelector((state) => state.ui.maindeck);

  const handleManaCostClick = (manaCost: string) => {
    return deck.filter(
      (card) => (card.details as mtgCard).cmc === Number(manaCost)
    );
  };

  const handleManaColorClick = (color: string, land = true) => {
    return deck.filter(
      (card: Card) =>
        ((land && (card.details as mtgCard).type_line.includes("Land")) ||
          (!land && !(card.details as mtgCard).type_line.includes("Land"))) &&
        (color === MTG_COLORLESS_CODE
          ? (card.details as mtgCard).color_identity.length === 0
          : (card.details as mtgCard).color_identity.includes(color))
    );
  };

  const manaCostData = Object.entries(getManaCostDistribution(deck)).map(
    ([cost, count]) => ({
      name: cost,
      value: count,
    })
  );

  const manaColorDist = getColorIdentityDistribution(
    deck.filter(
      (card: Card) => !(card.details as mtgCard).type_line.includes("Land")
    )
  );
  const manaColorProductionDist = getColorIdentityDistribution(
    deck.filter((card: Card) =>
      (card.details as mtgCard).type_line.includes("Land")
    )
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
        {/* Mana Cost Amounts*/}
        <Grid item xs={12} display="flex" flexDirection="row">
          <Box width="50%">
            <BarChart
              title="Mana Cost Distribution"
              xLabel="Mana Cost"
              data={manaCostData}
              filterBy={handleManaCostClick}
              formatPopoverText={formatPopoverText}
            />
          </Box>
        </Grid>

        {/* Mana Cost Colors */}
        <Grid item xs={12} sm={6} display="flex" flexDirection="row">
          <Box width="50%" mt={4}>
            <PieChart
              title="Mana Color"
              data={manaColorDist}
              colors={MTG_COLORS_HEX}
              filterBy={(color) => {
                return handleManaColorClick(color, false);
              }}
              formatPopoverText={formatPopoverText}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} display="flex" flexDirection="row">
          <Box width="50%" mt={4}>
            <PieChart
              title="Mana Color Production"
              data={manaColorProductionDist}
              colors={MTG_COLORS_HEX}
              filterBy={(color) => {
                return handleManaColorClick(color, true);
              }}
              formatPopoverText={formatPopoverText}
            />
          </Box>
        </Grid>
      </Grid>
    </MuiCard>
  );
};

export default Mana;
