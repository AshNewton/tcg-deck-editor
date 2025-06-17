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
            <Text text={`Types: ${pCard.types.join(" ")}`} mt={2} />
          )}

          {/* abilities */}
          {pCard.abilities?.length > 0 && (
            <List>
              {pCard.abilities.map((ability: any) => {
                return (
                  <ListItem sx={{ px: 0 }}>
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
            <List>
              {pCard.attacks.map((attack: any) => {
                return (
                  <ListItem sx={{ px: 0 }}>
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
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText>{rule}</ListItemText>
                  </ListItem>
                );
              })}
            </List>
          )}

          {/* weaknesses */}
          {pCard.weaknesses?.length > 0 && (
            <Text
              text={`Weaknesses: ${pCard.weaknesses.reduce(
                (acc: string, weakness: any) => {
                  return acc + `  ${weakness.type}${weakness.value}`;
                },
                ""
              )}`}
              mt={2}
            />
          )}

          {/* resistances */}
          {pCard.resistances?.length > 0 && (
            <Text
              text={`Resistances: ${pCard.resistances.reduce(
                (acc: string, resistance: any) => {
                  return acc + `  ${resistance.type}${resistance.value}`;
                },
                ""
              )}`}
              mt={2}
            />
          )}

          {/* retreat cost */}
          {pCard.retreatCost && (
            <Text text={`Retreat: ${pCard.retreatCost.join(" ")}`} mt={2} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CardDetails;
