export type ygoCard = any;

export interface Card {
  name: string;
  details: ygoCard;
  copies: number;
}

export type Deck = Array<Card>;

export type CardOpeningProbabilities = Array<{
  name: string;
  chance: string;
}>;

export type BanType = "Forbidden" | "Semi-Limited" | "Limited";
