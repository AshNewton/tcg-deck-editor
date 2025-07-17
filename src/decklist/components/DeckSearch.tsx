import React from "react";
import { Form } from "react-final-form";
import { useTranslation } from "react-i18next";

import Button from "./mui/Button";
import DisplayCard from "./mui/DisplayCard";
import MtgDeckSearch from "./mtg/DeckSearch";
import PokemonDeckSearch from "./pokemon/DeckSearch";
import YgoDeckSearch from "./yugioh/DeckSearch";
import Text from "./mui/Text";

import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import { useAppSelector } from "../../hooks";
import { filterCard as mtgFilterCard } from "./mtg/DeckSearch";
import { filterCard as pokemonFilterCard } from "./pokemon/DeckSearch";
import { filterCard as ygoFilterCard } from "./yugioh/DeckSearch";

import { MTG_NAME } from "../util/mtg";
import { POKEMON_NAME } from "../util/pokemon";
import { YUGIOH_NAME } from "../util/yugioh";

import { Deck } from "../../types";
import { SearchValues as MtgSearchValues } from "./mtg/DeckSearch";
import { SearchValues as PokemonSearchValues } from "./pokemon/DeckSearch";
import { SearchValues as YgoSearchValues } from "./yugioh/DeckSearch";

const DeckSearch = () => {
  const [mainSearchResult, setMainSearchResult] = React.useState<Deck | null>(
    null
  );
  const [extraSearchResult, setExtraSearchResult] = React.useState<Deck | null>(
    null
  );

  const maindeck = useAppSelector((state) => state.ui.maindeck);
  const extradeck = useAppSelector((state) => state.ui.extradeck);

  const game = useAppSelector((state) => state.ui.game);

  const { t } = useTranslation();

  const onSubmit = (
    values: YgoSearchValues | MtgSearchValues | PokemonSearchValues
  ) => {
    const filterStrategies = {
      [MTG_NAME]: () => {
        const typedValues = values as MtgSearchValues;
        setMainSearchResult(
          maindeck.filter((card) => mtgFilterCard(card, typedValues))
        );
      },
      [YUGIOH_NAME]: () => {
        const typedValues = values as YgoSearchValues;
        setMainSearchResult(
          maindeck.filter((card) => ygoFilterCard(card, typedValues))
        );
        setExtraSearchResult(
          extradeck.filter((card) => ygoFilterCard(card, typedValues))
        );
      },
      [POKEMON_NAME]: () => {
        const typedValues = values as PokemonSearchValues;
        setMainSearchResult(
          maindeck.filter((card) => pokemonFilterCard(card, typedValues))
        );
      },
    };

    const strategy = filterStrategies[game];
    if (strategy) {
      strategy();
    }
  };

  return (
    <DisplayCard>
      <Form
        onSubmit={onSubmit}
        render={({ form, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            {game === YUGIOH_NAME && <YgoDeckSearch />}
            {game === MTG_NAME && <MtgDeckSearch />}
            {game === POKEMON_NAME && <PokemonDeckSearch />}

            <Button
              text={t("common.clear")}
              onClick={() => {
                form.reset();
                setMainSearchResult(null);
                setExtraSearchResult(null);
              }}
              sx={{ m: 2 }}
            />
            <Button text={t("common.search")} type="submit" sx={{ m: 2 }} />
          </form>
        )}
      />
      {(mainSearchResult || extraSearchResult) && (
        <>
          <Text
            text={t("search.numberResults", {
              count:
                (mainSearchResult ? mainSearchResult.length : 0) +
                (extraSearchResult ? extraSearchResult.length : 0),
            })}
          />
          <Grid container mt={2}>
            {Boolean(mainSearchResult?.length) && (
              <Grid item xs={6}>
                {game === YUGIOH_NAME && <Text text={t("yugioh.mainDeck")} />}
                <List>
                  {mainSearchResult?.map((card, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={card.name} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            )}
            {Boolean(extraSearchResult?.length) && (
              <Grid item xs={6}>
                <Text text={t("yugioh.extraDeck")} />
                <List>
                  {extraSearchResult?.map((card, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={card.name} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            )}
          </Grid>
        </>
      )}
    </DisplayCard>
  );
};

export default DeckSearch;
