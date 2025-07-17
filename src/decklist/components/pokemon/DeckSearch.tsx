import { Field } from "react-final-form";
import { useTranslation } from "react-i18next";

import CheckboxGroup from "../form/CheckboxGroup";
import ConditionalField from "../form/ConditionalField";
import MultiThumbSlider from "../form/MultiThumbSlider";
import TextField from "../form/TextField";

import Grid from "@mui/material/Grid";

import { includesIgnoreCase, isBetween } from "../../util/util";

import {
  Card,
  PokemonAbility,
  PokemonAttack,
  pokemonCard,
} from "../../../types";
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
  cardTypes: Array<string> | undefined,
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
    !includesIgnoreCase(card.name, values.nameIncludes)
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

  if (values.filterByHP && values.hp && !isBetween(pokemonCard.hp, values.hp)) {
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
  return Boolean(
    card.rules?.some((rule: string) => includesIgnoreCase(rule, s)) ||
      card.abilities?.some(
        (a: PokemonAbility) =>
          includesIgnoreCase(a.name, s) || includesIgnoreCase(a.text, s)
      ) ||
      card.attacks?.some(
        (a: PokemonAttack) =>
          includesIgnoreCase(a.name, s) || includesIgnoreCase(a.text, s)
      )
  );
};

const DeckSearch = () => {
  const { t } = useTranslation();

  return (
    <Grid container>
      {/* Check card name*/}
      <Grid item xs={12}>
        <ConditionalField
          checkboxName="filterByName"
          checkboxLabel={t("search.filterByName")}
        >
          <Field
            name="nameIncludes"
            component={TextField}
            label={t("search.filterByName")}
          />
        </ConditionalField>
      </Grid>

      {/* Check card text*/}
      <Grid item xs={12} mt={2}>
        <ConditionalField
          checkboxName="filterByDesc"
          checkboxLabel={t("search.filterByDesc")}
        >
          <Field
            name="descIncludes"
            component={TextField}
            label={t("search.filterByDesc")}
          />
        </ConditionalField>
      </Grid>

      {/* Check type*/}
      <Grid item xs={12} mt={2}>
        <ConditionalField
          checkboxName="filterByType"
          checkboxLabel={t("search.filterByType")}
        >
          <CheckboxGroup
            name="types"
            label={t("common.types")}
            options={POKEMON_TYPES.map((c: string) => t(c))}
            columns={3}
          />
        </ConditionalField>
      </Grid>

      {/* Check card type*/}
      <Grid item xs={12} mt={2}>
        <ConditionalField
          checkboxName="filterByCardType"
          checkboxLabel={t("search.filterByCardType")}
        >
          <CheckboxGroup
            name="cardTypes"
            label={t("common.cardTypes")}
            options={POKEMON_CARD_TYPES.map((c: string) => t(c))}
            columns={4}
          />
        </ConditionalField>
      </Grid>

      {/* Check card sub type*/}
      <Grid item xs={12} mt={2}>
        <ConditionalField
          checkboxName="filterBySubType"
          checkboxLabel={t("search.filterBySubType")}
        >
          <CheckboxGroup
            name="cardSubTypes"
            label={t("common.cardSubTypes")}
            options={POKEMON_CARD_SUB_TYPES.map((c: string) => t(c))}
            columns={4}
          />
        </ConditionalField>
      </Grid>

      {/* Check HP */}
      <Grid item xs={12} mt={2}>
        <ConditionalField
          checkboxName="filterByHP"
          checkboxLabel={t("search.filterByHP")}
        >
          <MultiThumbSlider
            name="hp"
            label={t("pokemon.hp")}
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
