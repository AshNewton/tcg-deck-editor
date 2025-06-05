import React from "react";
import { Form } from "react-final-form";

import Button from "./mui/Button";
import YgoDeckSearch from "./yugioh/DeckSearch";
import Text from "./mui/Text";

import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MuiCard from "@mui/material/Card";

import { useAppSelector } from "../../hooks";
import { filterCard as ygoFilterCard } from "./yugioh/DeckSearch";

import { Deck } from "../../types";
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

  const onSubmit = (values: YgoSearchValues) => {
    setMainSearchResult(maindeck.filter((card) => ygoFilterCard(card, values)));
    setExtraSearchResult(
      extradeck.filter((card) => ygoFilterCard(card, values))
    );
  };

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
      <Form
        onSubmit={onSubmit}
        render={({ form, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <YgoDeckSearch />

            <Button
              text="Clear"
              onClick={() => {
                form.reset();
                setMainSearchResult(null);
                setExtraSearchResult(null);
              }}
              sx={{ m: 2 }}
            />
            <Button text="Search" type="submit" sx={{ m: 2 }} />
          </form>
        )}
      />
      {(mainSearchResult || extraSearchResult) && (
        <>
          <Text
            text={`${
              (mainSearchResult ? mainSearchResult.length : 0) +
              (extraSearchResult ? extraSearchResult.length : 0)
            } results`}
          />
          <Grid container mt={2}>
            {Boolean(mainSearchResult?.length) && (
              <Grid item xs={6}>
                <Text text="Main Deck" />
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
                <Text text="Extra Deck" />
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
    </MuiCard>
  );
};

export default DeckSearch;
