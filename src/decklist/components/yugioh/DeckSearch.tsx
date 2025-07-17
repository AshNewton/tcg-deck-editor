import { Field } from "react-final-form";
import { useTranslation } from "react-i18next";

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

      {/* Check card type*/}
      <Grid item xs={12} mt={2}>
        <ConditionalField
          checkboxName="filterByCardType"
          checkboxLabel={t("search.filterByCardType")}
        >
          <CheckboxGroup
            name="cardtypes"
            label={t("common.cardTypes")}
            options={[
              ...YUGIOH_CARD_TYPES,
              ...YUGIOH_SPELL_TYPES,
              ...YUGIOH_TRAP_TYPES,
            ].map((c: string) => t(c))}
            columns={4}
          />
        </ConditionalField>
      </Grid>

      {/* Check monster attribute*/}
      <Grid item xs={12} mt={2}>
        <ConditionalField
          checkboxName="filterByAttribute"
          checkboxLabel={t("search.filterByAttribute")}
        >
          <CheckboxGroup
            name="attributes"
            label={t("yugioh.monsterAttributes")}
            options={YUGIOH_ATTRIBUTES.map((c: string) => t(c))}
            columns={2}
          />
        </ConditionalField>
      </Grid>

      {/* Check monster type*/}
      <Grid item xs={12} mt={2}>
        <ConditionalField
          checkboxName="filterByMonsterType"
          checkboxLabel={t("search.filterByMonsterType")}
        >
          <CheckboxGroup
            name="monsterType"
            label={t("yugioh.monsterTypes")}
            options={YUGIOH_MONSTER_TYPES.map((c: string) => t(c))}
            columns={4}
          />
        </ConditionalField>
      </Grid>

      {/* Check card level/rank/link */}
      <Grid item xs={12} mt={2}>
        <ConditionalField
          checkboxName="filterByLevel"
          checkboxLabel={t("search.filterByLevel")}
        >
          <CheckboxGroup
            name="levels"
            label={t("yugioh.levelRankLink")}
            options={YUGIOH_MONSTER_LEVELS}
            columns={4}
          />
        </ConditionalField>
      </Grid>

      {/* Check monster ATK */}
      <Grid item xs={12} mt={2}>
        <ConditionalField
          checkboxName="filterByATK"
          checkboxLabel={t("search.filterByAtk")}
        >
          <MultiThumbSlider
            name="atk"
            label={t("search.atkRange")}
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
          checkboxLabel={t("search.filterByDef")}
        >
          <MultiThumbSlider
            name="def"
            label={t("search.defRange")}
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
