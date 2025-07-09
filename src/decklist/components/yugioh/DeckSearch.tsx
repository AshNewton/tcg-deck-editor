import { Field } from "react-final-form";

import CheckboxGroup from "../form/CheckboxGroup";
import ConditionalField from "../form/ConditionalField";
import MultiThumbSlider from "../form/MultiThumbSlider";
import TextField from "../form/TextField";

import Grid from "@mui/material/Grid";

import { includesIgnoreCase, isBetween } from "../../util/util";

import {
  YUGIOH_ATTRIBUTES,
  YUGIOH_CARD_TYPES,
  YUGIOH_MAX_STAT,
  YUGIOH_MIN_STAT,
  YUGIOH_MONSTER_LEVELS,
  YUGIOH_MONSTER_TYPES,
  YUGIOH_SPELL_TYPES,
  YUGIOH_STAT_STEP,
  YUGIOH_TRAP_TYPES,
} from "../../util/yugioh";

import { Card, ygoCard } from "../../../types";

export type SearchValues = {
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

export const filterCard = (card: Card, values: SearchValues): boolean => {
  const ygoCard = card?.details as ygoCard;

  if (
    values.filterByName &&
    values.nameIncludes &&
    !includesIgnoreCase(card.name, values.nameIncludes)
  ) {
    return false;
  }

  if (
    values.filterByDesc &&
    values.descIncludes &&
    !includesIgnoreCase(ygoCard.desc, values.descIncludes)
  ) {
    return false;
  }

  if (
    values.filterByCardType &&
    values.cardtypes &&
    !values.cardtypes.some((cardType) =>
      includesIgnoreCase(ygoCard.humanReadableCardType, cardType)
    )
  ) {
    return false;
  }

  if (
    values.filterByAttribute &&
    values.attributes &&
    !values.attributes.includes(ygoCard.attribute)
  ) {
    return false;
  }

  if (
    values.filterByMonsterType &&
    values.monsterType &&
    !values.monsterType.includes(ygoCard.race)
  ) {
    return false;
  }

  if (
    values.filterByLevel &&
    values.levels &&
    (!ygoCard.level || !values.levels.includes(ygoCard.level.toString()))
  ) {
    return false;
  }

  if (
    values.filterByATK &&
    values.atk &&
    (!ygoCard.atk || !isBetween(ygoCard.atk, values.atk))
  ) {
    return false;
  }

  if (
    values.filterByDEF &&
    values.def &&
    (!ygoCard.def || !isBetween(ygoCard.def, values.def))
  ) {
    return false;
  }

  return true;
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
            min={YUGIOH_MIN_STAT}
            max={YUGIOH_MAX_STAT}
            step={YUGIOH_STAT_STEP}
            defaultValue={[YUGIOH_MIN_STAT, YUGIOH_MAX_STAT / 2]}
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
            min={YUGIOH_MIN_STAT}
            max={YUGIOH_MAX_STAT}
            step={YUGIOH_STAT_STEP}
            defaultValue={[YUGIOH_MIN_STAT, YUGIOH_MAX_STAT / 2]}
            showInputs
          />
        </ConditionalField>
      </Grid>
    </Grid>
  );
};

export default DeckSearch;
