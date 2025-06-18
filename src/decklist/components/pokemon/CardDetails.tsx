import Image from "../mui/Image";
import Text from "./../mui/Text";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import ClearIcon from "@mui/icons-material/Clear";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import { POKEMON_TYPES, POKEMON_TYPES_TO_SYMBOL } from "../../util/pokemon";

import { Card, pokemonCard } from "../../../types";
import TextWithSymbols from "../mui/TextWithSymbols";

type Props = {
  card: Card;
  clearSelection: () => void;
};

const energySymbols = POKEMON_TYPES.map((type: string) => {
  return {
    symbol: POKEMON_TYPES_TO_SYMBOL[type],
    url: `/energy/${type}.png`,
    alt: type,
  };
});

const getEnergySymbols = (names: Array<string>) => {
  return names
    .map((name: string) => {
      return POKEMON_TYPES_TO_SYMBOL[name];
    })
    .join("");
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
            <TextWithSymbols
              text={`Types: ${getEnergySymbols(pCard.types)}`}
              symbols={energySymbols}
            />
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
                    <ListItemText secondary={attack.text}>
                      <TextWithSymbols
                        text={`${getEnergySymbols(attack.cost)} ${
                          attack.name
                        } ${attack.damage}`}
                        symbols={energySymbols}
                      />
                    </ListItemText>
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
            <TextWithSymbols
              text={`Weaknesses: ${pCard.weaknesses.reduce(
                (acc: string, weakness: any) => {
                  return (
                    acc +
                    `  ${POKEMON_TYPES_TO_SYMBOL[weakness.type]}${
                      weakness.value
                    }`
                  );
                },
                ""
              )}`}
              symbols={energySymbols}
            />
          )}

          {/* resistances */}
          {pCard.resistances?.length > 0 && (
            <TextWithSymbols
              text={`Resistances: ${pCard.resistances.reduce(
                (acc: string, resistance: any) => {
                  return (
                    acc +
                    `  ${POKEMON_TYPES_TO_SYMBOL[resistance.type]}${
                      resistance.value
                    }`
                  );
                },
                ""
              )}`}
              symbols={energySymbols}
            />
          )}

          {/* retreat cost */}
          {pCard.retreatCost && (
            <TextWithSymbols
              text={`Retreat: ${getEnergySymbols(pCard.retreatCost)}`}
              symbols={energySymbols}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CardDetails;
