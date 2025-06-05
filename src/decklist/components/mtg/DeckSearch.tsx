import { Field } from "react-final-form";

import CheckboxGroup from "../form/CheckboxGroup";
import ConditionalField from "../form/ConditionalField";
import MultiThumbSlider from "../form/MultiThumbSlider";
import TextField from "../form/TextField";

import Grid from "@mui/material/Grid";

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

import { Card } from "../../../types";

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
    values.filterByColor &&
    values.colors &&
    !cardHasAllColors(card.details.color_identity, values.colors)
  ) {
    return false;
  }

  if (
    values.filterByManaCost &&
    values.mana &&
    (!card.details.cmc ||
      card.details.cmc < values.mana[0] ||
      values.mana[1] < card.details.cmc)
  ) {
    return false;
  }

  if (
    values.filterByPower &&
    values.power &&
    (!card.details.power ||
      card.details.power < values.power[0] ||
      values.power[1] < card.details.power)
  ) {
    return false;
  }

  if (
    values.filterByToughness &&
    values.toughness &&
    (!card.details.toughness ||
      card.details.toughness < values.toughness[0] ||
      values.toughness[1] < card.details.toughness)
  ) {
    return false;
  }

  if (!card.details.card_faces) {
    // cards with a single face
    if (
      values.filterByDesc &&
      values.descIncludes &&
      !card.details.oracle_text
        .toLocaleLowerCase()
        .includes(values.descIncludes.toLocaleLowerCase())
    ) {
      return false;
    }

    if (
      values.filterByCardType &&
      values.cardTypes &&
      !values.cardTypes.every((type: string) =>
        card.details.type_line
          .toLocaleLowerCase()
          .includes(type.toLocaleLowerCase())
      )
    ) {
      return false;
    }

    if (
      values.filterByTribe &&
      values.tribeIncludes &&
      !card.details.type_line
        .toLocaleLowerCase()
        .includes(values.tribeIncludes.toLocaleLowerCase())
    ) {
      return false;
    }
  } else {
    // cards with a mutiple faces - check each separately

    if (
      values.filterByDesc &&
      values.descIncludes &&
      !card.details.card_faces.some((face: any) =>
        face.oracle_text
          .toLocaleLowerCase()
          .includes(values.descIncludes.toLocaleLowerCase())
      )
    ) {
      return false;
    }

    if (
      values.filterByCardType &&
      values.cardTypes &&
      !card.details.card_faces.some((face: any) =>
        values.cardTypes.every((type) =>
          face.type_line.toLocaleLowerCase().includes(type.toLocaleLowerCase())
        )
      )
    ) {
      return false;
    }

    if (
      values.filterByTribe &&
      values.tribeIncludes &&
      !card.details.card_faces.some((face: any) =>
        face.type_line
          .toLocaleLowerCase()
          .includes(values.tribeIncludes.toLocaleLowerCase())
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

      {/* Check color*/}
      <Grid item xs={12} mt={2}>
        <ConditionalField
          checkboxName="filterByColor"
          checkboxLabel="Filter by Color"
        >
          <CheckboxGroup
            name="colors"
            label="Colors"
            options={MTG_COLORS}
            columns={2}
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
            options={MTG_CARD_TYPES.sort()}
            columns={4}
          />
        </ConditionalField>
      </Grid>

      {/* Check tribe*/}
      <Grid item xs={12} mt={2}>
        <ConditionalField
          checkboxName="filterByTribe"
          checkboxLabel="Filter by Tribe"
        >
          <Field name="tribeIncludes" component={TextField} label="Tribe" />
        </ConditionalField>
      </Grid>

      {/* Check card mana cost */}
      <Grid item xs={12} mt={2}>
        <ConditionalField
          checkboxName="filterByManaCost"
          checkboxLabel="Filter by Mana Cost"
        >
          <MultiThumbSlider
            name="mana"
            label="Mana Cost Range"
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
          checkboxLabel="Filter by Power"
        >
          <MultiThumbSlider
            name="power"
            label="Power Range"
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
          checkboxName="filterByToughness"
          checkboxLabel="Filter by Toughness"
        >
          <MultiThumbSlider
            name="toughtness"
            label="Toughness Range"
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
