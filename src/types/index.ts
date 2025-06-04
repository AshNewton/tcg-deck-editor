export type ygoCard = {
  id: number;
  name: string;
  type: string;
  frameType: string;
  desc: string;
  atk: number;
  def: number;
  level: number;
  race: string;
  attribute: string;
  card_sets?: YGOCardSet[];
  card_images: YGOCardImage[];
  card_prices: YGOCardPrice[];
};

export type YGOCardSet = {
  set_name: string;
  set_code: string;
  set_rarity: string;
  set_rarity_code: string;
  set_price: string;
};

export type YGOCardImage = {
  id: number;
  image_url: string;
  image_url_small: string;
  image_url_cropped: string;
};

export type YGOCardPrice = {
  cardmarket_price: string;
  tcgplayer_price: string;
  ebay_price: string;
  amazon_price: string;
  coolstuffinc_price: string;
};

export type mtgCard = any;

export type MtgSymbol = {
  symbol: string;
  url: string;
  alt: string;
};

export type Game = "Yugioh" | "Magic the Gathering";

export type Menu = "Starting Hand" | "Deck Search" | "Mana";

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
