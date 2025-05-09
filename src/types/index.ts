export type ygoCard = any;

export type mtgCard = any;

export type Game = "Yugioh" | "Magic the Gathering";

export interface Card {
  name: string;
  details: ygoCard | mtgCard;
  copies: number;
}

export type Deck = Array<Card>;

export type CardOpeningProbabilities = Array<{
  name: string;
  chance: string;
}>;

export type BanType = "Forbidden" | "Semi-Limited" | "Limited";
