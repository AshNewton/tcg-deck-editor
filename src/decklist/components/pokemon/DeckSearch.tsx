import { Field } from "react-final-form";

import CheckboxGroup from "../form/CheckboxGroup";
import ConditionalField from "../form/ConditionalField";
import MultiThumbSlider from "../form/MultiThumbSlider";
import TextField from "../form/TextField";

import Grid from "@mui/material/Grid";

import { Card, pokemonCard } from "../../../types";
import {
  POKEMON_CARD_SUB_TYPES,
  POKEMON_CARD_TYPES,
  POKEMON_MAX_STAT,
  POKEMON_MIN_STAT,
  POKEMON_STAT_STEP,
  POKEMON_TYPES,
} from "../../util/pokemon";

export type SearchValues = {
  filterByName: boolean;
  nameIncludes: string;

  filterByDesc: boolean;
  descIncludes: string;

  filterByType: boolean;
  types: Array<string>;

  filterByCardType: boolean;
  cardTypes: Array<string>;

  filterBySubType: boolean;
  cardSubTypes: Array<string>;

  filterByHP: boolean;
  hp: Array<number>;
};

const cardHasTypes = (
  cardTypes: Array<string>,
  selectedTypes: Array<string>
): boolean => {
  const lowerCardTypes = cardTypes?.map((type) => type.toLowerCase());
  return selectedTypes?.every((code) =>
    lowerCardTypes?.includes(code.toLowerCase())
  );
};

export const filterCard = (card: Card, values: SearchValues): boolean => {
  const pokemonCard = card?.details as pokemonCard | undefined;

  if (!pokemonCard) return false;

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
    values.filterByType &&
    values.types &&
    !cardHasTypes(pokemonCard.types, values.types)
  ) {
    return false;
  }

  if (
    values.filterByCardType &&
    values.cardTypes &&
    !cardHasTypes([pokemonCard.supertype], values.cardTypes)
  ) {
    return false;
  }

  if (
    values.filterBySubType &&
    values.cardSubTypes &&
    !cardHasTypes(pokemonCard.subtypes, values.cardSubTypes)
  ) {
    return false;
  }

  if (
    values.filterByHP &&
    values.hp &&
    (!pokemonCard.hp ||
      Number(pokemonCard.hp) < values.hp[0] ||
      values.hp[1] < Number(pokemonCard.hp))
  ) {
    return false;
  }

  if (
    values.filterByDesc &&
    values.descIncludes &&
    !substringOnCard(values.descIncludes, pokemonCard)
  ) {
    return false;
  }

  return true;
};

const substringOnCard = (s: string, card: pokemonCard): boolean => {
  const lower = s.toLowerCase();

  return (
    card.rules?.some((rule: string) => rule.toLowerCase().includes(lower)) ||
    card.abilities?.some(
      (a: any) =>
        a.name.toLowerCase().includes(lower) ||
        a.text.toLowerCase().includes(lower)
    ) ||
    card.attacks?.some(
      (a: any) =>
        a.name.toLowerCase().includes(lower) ||
        a.text.toLowerCase().includes(lower)
    )
  );
};

const DeckSearch = () => {
  return (
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

      {/* Check type*/}
      <Grid item xs={12} mt={2}>
        <ConditionalField
          checkboxName="filterByType"
          checkboxLabel="Filter by Type"
        >
          <CheckboxGroup
            name="types"
            label="Types"
            options={POKEMON_TYPES.sort()}
            columns={3}
          />
        </ConditionalField>
      </Grid>

      {/* Check card type*/}
      <Grid item xs={12} mt={2}>
        <ConditionalField
          checkboxName="filterByCardType"
          checkboxLabel="Filter by Card Type"
        >
          <CheckboxGroup
            name="cardTypes"
            label="Card Types"
            options={POKEMON_CARD_TYPES.sort()}
            columns={4}
          />
        </ConditionalField>
      </Grid>

      {/* Check card sub type*/}
      <Grid item xs={12} mt={2}>
        <ConditionalField
          checkboxName="filterBySubType"
          checkboxLabel="Filter by Card Sub Type"
        >
          <CheckboxGroup
            name="cardSubTypes"
            label="Card Sub Types"
            options={POKEMON_CARD_SUB_TYPES.sort()}
            columns={4}
          />
        </ConditionalField>
      </Grid>

      {/* Check HP */}
      <Grid item xs={12} mt={2}>
        <ConditionalField
          checkboxName="filterByHP"
          checkboxLabel="Filter by HP"
        >
          <MultiThumbSlider
            name="hp"
            label="HP"
            min={POKEMON_MIN_STAT}
            max={POKEMON_MAX_STAT}
            step={POKEMON_STAT_STEP}
            defaultValue={[POKEMON_MIN_STAT, POKEMON_MAX_STAT / 2]}
            showInputs
          />
        </ConditionalField>
      </Grid>
    </Grid>
  );
};

export default DeckSearch;
