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
  humanReadableCardType: string;
  ygoprodeck_url: string;
  card_sets?: YGOCardSet[];
  banlist_info?: YGOLegality;
  card_images: YGOCardImage[];
  card_prices: YGOCardPrice[];
};

export type YGOLegality = {
  ban_tcg: BanType;
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

export type mtgCard = {
  object: "card";
  id: string;
  oracle_id: string;
  multiverse_ids: number[];
  mtgo_id?: number;
  arena_id?: number;
  tcgplayer_id?: number;
  cardmarket_id?: number;
  name: string;
  lang: string;
  released_at: string;
  uri: string;
  scryfall_uri: string;
  layout: string;
  highres_image: boolean;
  image_status: string;
  image_uris: {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
  };
  mana_cost?: string;
  cmc: number;
  type_line: string;
  oracle_text?: string;
  power?: string;
  toughness?: string;
  colors: string[];
  color_identity: string[];
  keywords: string[];
  legalities: Record<string, "legal" | "not_legal" | "restricted" | "banned">;
  games: string[];
  reserved: boolean;
  game_changer: boolean;
  foil: boolean;
  nonfoil: boolean;
  finishes: string[];
  oversized: boolean;
  promo: boolean;
  reprint: boolean;
  variation: boolean;
  set_id: string;
  set: string;
  set_name: string;
  set_type: string;
  set_uri: string;
  set_search_uri: string;
  scryfall_set_uri: string;
  rulings_uri: string;
  prints_search_uri: string;
  collector_number: string;
  digital: boolean;
  rarity: string;
  flavor_text?: string;
  card_back_id: string;
  artist: string;
  artist_ids: string[];
  illustration_id?: string;
  border_color: string;
  frame: string;
  frame_effects?: string[];
  full_art: boolean;
  textless: boolean;
  booster: boolean;
  story_spotlight: boolean;
  edhrec_rank?: number;
  preview?: {
    source: string;
    source_uri: string;
    previewed_at: string;
  };
  prices: {
    usd?: string;
    usd_foil?: string;
    usd_etched?: string | null;
    eur?: string;
    eur_foil?: string;
    tix?: string;
  };
  related_uris?: Record<string, string>;
  purchase_uris?: Record<string, string>;
  card_faces?: Array<{
    object: string;
    name: string;
    mana_cost?: string;
    type_line: string;
    oracle_text?: string;
    power?: string;
    toughness?: string;
    artist?: string;
    artist_id?: string;
    illustration_id?: string;
  }>;
  all_parts?: Array<{
    object: string;
    id: string;
    component: string;
    name: string;
    type_line: string;
    uri: string;
  }>;
};

export type MtgSymbol = {
  symbol: string;
  url: string;
  alt: string;
};

export type pokemonCard = {
  id: string;
  name: string;
  supertype: string;
  subtypes?: string[];
  hp?: string;
  types?: string[];
  rules?: string[];
  abilities?: PokemonAbility[];
  attacks?: PokemonAttack[];
  weaknesses?: PokemonWeakness[];
  resistances?: PokemonResistance[];
  retreatCost?: string[];
  convertedRetreatCost?: number;
  set: {
    id: string;
    name: string;
    series: string;
    printedTotal: number;
    total: number;
    legalities: PokemonLegalities;
    ptcgoCode: string;
    releaseDate: string;
    updatedAt: string;
    images: {
      symbol: string;
      logo: string;
    };
  };
  number: string;
  rarity?: string;
  legalities: PokemonLegalities;
  regulationMark?: string;
  images: {
    small: string;
    large: string;
  };
  tcgplayer?: {
    url: string;
    updatedAt: string;
    prices: {
      holofoil: {
        low: number;
        mid: number;
        high: number;
        market: number;
        directLow: number | null;
      };
    };
  };
};

export type PokemonLegalities = {
  unlimited?: string;
  standard?: string;
  expanded?: string;
};

export type PokemonAbility = {
  name: string;
  text: string;
  type: string;
};

export type PokemonAttack = {
  name: string;
  cost: string[];
  convertedEnergyCost: number;
  damage: string;
  text: string;
};

export type PokemonWeakness = {
  type: string;
  value: string;
};

export type PokemonResistance = {
  type: string;
  value: string;
};

export type Game = "Yugioh" | "Magic the Gathering" | "Pokemon TCG";

export type Menu = "Starting Hand" | "Deck Search" | "Mana";

export interface Card {
  name: string;
  details: ygoCard | mtgCard | pokemonCard;
  copies: number;
}

export type Deck = Array<Card>;

export type CardOpeningProbabilities = Array<{
  name: string;
  chance: string;
}>;

export type BanType = "Forbidden" | "Semi-Limited" | "Limited";
