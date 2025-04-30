import React from "react";
import { Form, Field } from "react-final-form";

import Button from "./Button";
import CheckboxGroup from "./form/CheckboxGroup";
import CollapsibleDropdown from "./CollapsibleDropdown";
import ConditionalField from "./form/ConditionalField";
import MultiThumbSlider from "./form/MultiThumbSlider";
import Text from "./Text";
import TextField from "./form/TextField";

import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import { useAppSelector } from "../../hooks";
import {
  YUGIOH_ATTRIBUTES,
  YUGIOH_CARD_TYPES,
  YUGIOH_MONSTER_LEVELS,
  YUGIOH_MONSTER_TYPES,
  YUGIOH_SPELL_TYPES,
  YUGIOH_TRAP_TYPES,
} from "../util/constants";

import { Card, Deck } from "../../types";

type SearchValues = {
  filterByName: boolean;
  nameIncludes: string;

  filterByDesc: boolean;
  descIncludes: string;

  filterByCardType: boolean;
  cardtypes: Array<string>;

  filterByAttribute: boolean;
  attributes: Array<string>;

  filterByMonsterType: boolean;
  monsterType: Array<string>;

  filterByLevel: boolean;
  levels: Array<string>;

  filterByATK: boolean;
  atk: Array<number>;

  filterByDEF: boolean;
  def: Array<number>;
};

const filterCard = (card: Card, values: SearchValues): boolean => {
  if (
    values.filterByName &&
    values.nameIncludes &&
    !card.name
      .toLocaleLowerCase()
      .includes(values.nameIncludes.toLocaleLowerCase())
  ) {
    return false;
  }

  if (
    values.filterByDesc &&
    values.descIncludes &&
    !card.details.desc.includes(values.descIncludes)
  ) {
    return false;
  }

  console.log(card.name, card.details.humanReadableCardType, values.cardtypes);

  if (
    values.filterByCardType &&
    values.cardtypes &&
    !values.cardtypes.some((cardType) =>
      card.details.humanReadableCardType
        .toLocaleLowerCase()
        .includes(cardType.toLocaleLowerCase())
    )
  ) {
    return false;
  }

  if (
    values.filterByAttribute &&
    values.attributes &&
    !values.attributes.includes(card.details.attribute)
  ) {
    return false;
  }

  if (
    values.filterByMonsterType &&
    values.monsterType &&
    !values.monsterType.includes(card.details.race)
  ) {
    return false;
  }

  if (
    values.filterByLevel &&
    values.levels &&
    (!card.details.level ||
      !values.levels.includes(card.details.level.toString()))
  ) {
    return false;
  }

  if (
    values.filterByATK &&
    values.atk &&
    (!card.details.atk ||
      card.details.atk < values.atk[0] ||
      values.atk[1] < card.details.atk)
  ) {
    return false;
  }

  if (
    values.filterByDEF &&
    values.def &&
    (!card.details.def ||
      card.details.def < values.def[0] ||
      values.def[1] < card.details.def)
  ) {
    return false;
  }

  return true;
};

const DeckSearch = () => {
  const [mainSearchResult, setMainSearchResult] = React.useState<Deck | null>(
    null
  );
  const [extraSearchResult, setExtraSearchResult] = React.useState<Deck | null>(
    null
  );

  const maindeck = useAppSelector((state) => state.ui.maindeck);
  const extradeck = useAppSelector((state) => state.ui.extradeck);

  const onClose = () => {
    setMainSearchResult(null);
    setExtraSearchResult(null);
  };

  const onSubmit = (values: SearchValues) => {
    setMainSearchResult(maindeck.filter((card) => filterCard(card, values)));
    setExtraSearchResult(extradeck.filter((card) => filterCard(card, values)));
  };

  return (
    <CollapsibleDropdown title="Deck Search" onCollapse={onClose}>
      <Form
        onSubmit={onSubmit}
        render={({ form, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Grid container>
              {/* Check card name*/}
              <Grid item xs={12}>
                <ConditionalField
                  checkboxName="filterByName"
                  checkboxLabel="Name Includes"
                >
                  <Field
                    name="nameIncludes"
                    component={TextField}
                    label="Name Includes"
                  />
                </ConditionalField>
              </Grid>

              {/* Check card text*/}
              <Grid item xs={12} mt={2}>
                <ConditionalField
                  checkboxName="filterByDesc"
                  checkboxLabel="Desc Includes"
                >
                  <Field
                    name="descIncludes"
                    component={TextField}
                    label="Desc Includes"
                  />
                </ConditionalField>
              </Grid>
            </Grid>

            {/* Check card type*/}
            <Grid item xs={12} mt={2}>
              <ConditionalField
                checkboxName="filterByCardType"
                checkboxLabel="Filter by Card Type"
              >
                <CheckboxGroup
                  name="cardtypes"
                  label="Card Types"
                  options={[
                    ...YUGIOH_CARD_TYPES,
                    ...YUGIOH_SPELL_TYPES,
                    ...YUGIOH_TRAP_TYPES,
                  ]}
                  columns={4}
                />
              </ConditionalField>
            </Grid>

            {/* Check monster attribute*/}
            <Grid item xs={12} mt={2}>
              <ConditionalField
                checkboxName="filterByAttribute"
                checkboxLabel="Filter by Attribute"
              >
                <CheckboxGroup
                  name="attributes"
                  label="Monster Attributes"
                  options={YUGIOH_ATTRIBUTES}
                  columns={2}
                />
              </ConditionalField>
            </Grid>

            {/* Check monster type*/}
            <Grid item xs={12} mt={2}>
              <ConditionalField
                checkboxName="filterByMonsterType"
                checkboxLabel="Filter by Monster Type"
              >
                <CheckboxGroup
                  name="monsterType"
                  label="Monster Types"
                  options={YUGIOH_MONSTER_TYPES}
                  columns={4}
                />
              </ConditionalField>
            </Grid>

            {/* Check card level/rank/link */}
            <Grid item xs={12} mt={2}>
              <ConditionalField
                checkboxName="filterByLevel"
                checkboxLabel="Filter by Level/Rank/Link"
              >
                <CheckboxGroup
                  name="levels"
                  label="Level/Rank/Link"
                  options={YUGIOH_MONSTER_LEVELS}
                  columns={4}
                />
              </ConditionalField>
            </Grid>

            {/* Check monster ATK */}
            <Grid item xs={12} mt={2}>
              <ConditionalField
                checkboxName="filterByATK"
                checkboxLabel="Filter by ATK"
              >
                <MultiThumbSlider
                  name="atk"
                  label="ATK Range"
                  min={0}
                  max={5000}
                  step={25}
                  defaultValue={[0, 2500]}
                  showInputs
                />
              </ConditionalField>
            </Grid>

            {/* Check monster DEF */}
            <Grid item xs={12} mt={2}>
              <ConditionalField
                checkboxName="filterByDEF"
                checkboxLabel="Filter by DEF"
              >
                <MultiThumbSlider
                  name="def"
                  label="DEF Range"
                  min={0}
                  max={5000}
                  step={25}
                  defaultValue={[0, 2500]}
                  showInputs
                />
              </ConditionalField>
            </Grid>

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
          <Grid container>
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
          </Grid>
        </>
      )}
    </CollapsibleDropdown>
  );
};

export default DeckSearch;
