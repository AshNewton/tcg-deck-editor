import Image from "../mui/Image";
import Text from "./../mui/Text";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import ClearIcon from "@mui/icons-material/Clear";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader/ListSubheader";

import { Card, pokemonCard } from "../../../types";
import { ListItem } from "@mui/material";

type Props = {
  card: Card;
  clearSelection: () => void;
};

const CardDetails = (props: Props) => {
  const { card, clearSelection } = props;

  const pCard = card?.details as pokemonCard;

  const banSeverity =
    pCard.legalities?.standard === "Legal" ? "success" : "error";

  return (
    <Box px={2}>
      <Box
        mt={2}
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        py={1}
      >
        {/* Name , copies, banlist */}
        <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
          <Text text={card.name} fontSize={28} />
          {card.copies > 1 && <Text text={`x${card.copies}`} fontSize={20} />}
          {pCard.legalities?.standard && (
            <Alert variant="filled" severity={banSeverity} color={banSeverity}>
              {pCard.legalities?.standard}
            </Alert>
          )}
        </Box>

        <IconButton onClick={clearSelection} aria-label="clear selected card">
          <ClearIcon />
        </IconButton>
      </Box>

      <Grid container gap={1}>
        <Grid item xs={12} sm={3} p={1}>
          <Image src={pCard.images.large} alt={card.name} m={0} />
        </Grid>
        <Grid item xs={12} sm={8} mt={2} py={1}>
          {/* HP */}
          {pCard.hp && <Text text={`HP: ${pCard.hp}`} />}

          {/* types */}
          {pCard.types?.length > 0 && (
            <List subheader={<ListSubheader>Types</ListSubheader>}>
              {pCard.types.map((type: string) => {
                return (
                  <ListItem sx={{ ml: 2 }}>
                    <ListItemText>{type}</ListItemText>
                  </ListItem>
                );
              })}
            </List>
          )}

          {/* abilities */}
          {pCard.abilities?.length > 0 && (
            <List>
              {pCard.abilities.map((ability: any) => {
                return (
                  <ListItem sx={{ display: "flex", flexDirection: "row" }}>
                    <ListItemText
                      primary={`${ability.type}: ${ability.name}`}
                      secondary={ability.text}
                    />
                  </ListItem>
                );
              })}
            </List>
          )}

          {/* attacks */}
          {pCard.attacks?.length > 0 && (
            <List subheader={<ListSubheader>Attacks</ListSubheader>}>
              {pCard.attacks.map((attack: any) => {
                return (
                  <ListItem
                    sx={{ ml: 2, display: "flex", flexDirection: "row" }}
                  >
                    <ListItemText
                      primary={`${attack.cost.join(" ")} ${attack.name} ${
                        attack.damage
                      }`}
                      secondary={attack.text}
                    />
                  </ListItem>
                );
              })}
            </List>
          )}

          {/* rule boxes */}
          {pCard.rules?.length > 0 && (
            <List>
              {pCard.rules.map((rule: string) => {
                return (
                  <ListItem>
                    <ListItemText>{rule}</ListItemText>
                  </ListItem>
                );
              })}
            </List>
          )}

          {/* weaknesses */}
          {pCard.weaknesses?.length > 0 && (
            <List subheader={<ListSubheader>Weaknesses</ListSubheader>}>
              {pCard.weaknesses.map((weakness: any) => {
                return (
                  <ListItem sx={{ ml: 2 }}>
                    <ListItemText>{`${weakness.type}: ${weakness.value}`}</ListItemText>
                  </ListItem>
                );
              })}
            </List>
          )}

          {/* resistances */}
          {pCard.resistances?.length > 0 && (
            <List subheader={<ListSubheader>Resistance</ListSubheader>}>
              {pCard.resistances.map((resistance: any) => {
                return (
                  <ListItem sx={{ ml: 2 }}>
                    <ListItemText>{`${resistance.type}: ${resistance.value}`}</ListItemText>
                  </ListItem>
                );
              })}
            </List>
          )}

          {/* retreat cost */}
          {pCard.retreatCost && (
            <Text text={`Retreat: ${pCard.retreatCost.join(" ")}`} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CardDetails;
