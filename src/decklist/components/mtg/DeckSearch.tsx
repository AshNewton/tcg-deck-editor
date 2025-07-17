import { Field } from "react-final-form";
import { useTranslation } from "react-i18next";

import CheckboxGroup from "../form/CheckboxGroup";
import ConditionalField from "../form/ConditionalField";
import MultiThumbSlider from "../form/MultiThumbSlider";
import TextField from "../form/TextField";

import Grid from "@mui/material/Grid";

import { includesIgnoreCase, isBetween } from "../../util/util";

import {
  MTG_CARD_TYPES,
  MTG_COLOR_CODES,
  MTG_COLORS,
  MTG_MAX_MANA,
  MTG_MAX_STAT,
  MTG_MIN_MANA,
  MTG_MIN_STAT,
  MTG_STAT_STEP,
} from "../../util/mtg";

import { Card, mtgCard } from "../../../types";

export type SearchValues = {
  filterByName: boolean;
  nameIncludes: string;

  filterByDesc: boolean;
  descIncludes: string;

  filterByColor: boolean;
  colors: Array<"White" | "Blue" | "Black" | "Red" | "Green">;

  filterByCardType: boolean;
  cardTypes: Array<string>;

  filterByTribe: boolean;
  tribeIncludes: string;

  filterByManaCost: boolean;
  mana: Array<number>;

  filterByPower: boolean;
  power: Array<number>;

  filterByToughness: boolean;
  toughness: Array<number>;
};

export const filterCard = (card: Card, values: SearchValues): boolean => {
  const mtgCard = card?.details as mtgCard | undefined;

  if (!mtgCard) return false;

  if (
    values.filterByName &&
    values.nameIncludes &&
    !includesIgnoreCase(card.name, values.nameIncludes)
  ) {
    return false;
  }

  if (
    values.filterByColor &&
    values.colors &&
    !cardHasAllColors(mtgCard.color_identity, values.colors)
  ) {
    return false;
  }

  if (
    values.filterByManaCost &&
    values.mana &&
    (!mtgCard.cmc || !isBetween(mtgCard.cmc, values.mana))
  ) {
    return false;
  }

  if (
    values.filterByPower &&
    values.power &&
    (!mtgCard.power || !isBetween(mtgCard.power, values.power))
  ) {
    return false;
  }

  if (
    values.filterByToughness &&
    values.toughness &&
    (!mtgCard.toughness || !isBetween(mtgCard.toughness, values.toughness))
  ) {
    return false;
  }

  if (!mtgCard.card_faces) {
    // cards with a single face
    if (
      values.filterByDesc &&
      values.descIncludes &&
      !includesIgnoreCase(mtgCard.oracle_text, values.descIncludes)
    ) {
      return false;
    }

    if (
      values.filterByCardType &&
      values.cardTypes &&
      !values.cardTypes.every((type: string) =>
        includesIgnoreCase(mtgCard.type_line, type)
      )
    ) {
      return false;
    }

    if (
      values.filterByTribe &&
      values.tribeIncludes &&
      !includesIgnoreCase(mtgCard.type_line, values.tribeIncludes)
    ) {
      return false;
    }
  } else {
    // cards with a mutiple faces - check each separately

    if (
      values.filterByDesc &&
      values.descIncludes &&
      !mtgCard.card_faces.some((face: any) =>
        includesIgnoreCase(face.oracle_text, values.descIncludes)
      )
    ) {
      return false;
    }

    if (
      values.filterByCardType &&
      values.cardTypes &&
      !mtgCard.card_faces.some((face: any) =>
        values.cardTypes.every((type) =>
          includesIgnoreCase(face.type_line, type)
        )
      )
    ) {
      return false;
    }

    if (
      values.filterByTribe &&
      values.tribeIncludes &&
      !mtgCard.card_faces.some((face: any) =>
        includesIgnoreCase(face.type_line, values.tribeIncludes)
      )
    ) {
      return false;
    }
  }

  return true;
};

const cardHasAllColors = (
  cardColorIdentity: string[],
  selectedColors: Array<keyof typeof MTG_COLOR_CODES>
): boolean => {
  return selectedColors
    .map((colorName) => MTG_COLOR_CODES[colorName])
    .every((code) => cardColorIdentity.includes(code));
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

      {/* Check color*/}
      <Grid item xs={12} mt={2}>
        <ConditionalField
          checkboxName="filterByColor"
          checkboxLabel={t("search.filterByColor")}
        >
          <CheckboxGroup
            name="colors"
            label={t("mtg.colors")}
            options={MTG_COLORS.map((c: string) => t(c))}
            columns={2}
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
            options={MTG_CARD_TYPES.map((c: string) => t(c))}
            columns={4}
          />
        </ConditionalField>
      </Grid>

      {/* Check tribe*/}
      <Grid item xs={12} mt={2}>
        <ConditionalField
          checkboxName="filterByTribe"
          checkboxLabel={t("search.filterByTribe")}
        >
          <Field
            name="tribeIncludes"
            component={TextField}
            label={t("mtg.tribe")}
          />
        </ConditionalField>
      </Grid>

      {/* Check card mana cost */}
      <Grid item xs={12} mt={2}>
        <ConditionalField
          checkboxName="filterByManaCost"
          checkboxLabel={t("search.filterByManaCost")}
        >
          <MultiThumbSlider
            name="mana"
            label={t("search.manaCostRange")}
            min={MTG_MIN_MANA}
            max={MTG_MAX_MANA}
            step={MTG_STAT_STEP}
            defaultValue={[MTG_MIN_MANA, MTG_MAX_MANA / 2]}
            showInputs
          />
        </ConditionalField>
      </Grid>

      {/* Check monster Power */}
      <Grid item xs={12} mt={2}>
        <ConditionalField
          checkboxName="filterByPower"
          checkboxLabel={t("search.filterByPower")}
        >
          <MultiThumbSlider
            name="power"
            label={t("search.powerRange")}
            min={MTG_MIN_STAT}
            max={MTG_MAX_STAT}
            step={MTG_STAT_STEP}
            defaultValue={[MTG_MIN_STAT, MTG_MAX_STAT / 2]}
            showInputs
          />
        </ConditionalField>
      </Grid>

      {/* Check monster Toughness */}
      <Grid item xs={12} mt={2}>
        <ConditionalField
          checkboxName={t("search.manaCostRange")}
          checkboxLabel={t("search.filterByToughness")}
        >
          <MultiThumbSlider
            name="toughness"
            label={t("search.toughnessRange")}
            min={MTG_MIN_STAT}
            max={MTG_MAX_STAT}
            step={MTG_STAT_STEP}
            defaultValue={[MTG_MIN_STAT, MTG_MAX_STAT / 2]}
            showInputs
          />
        </ConditionalField>
      </Grid>
    </Grid>
  );
};

export default DeckSearch;
