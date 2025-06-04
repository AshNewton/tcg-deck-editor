import { mtgCard, MtgSymbol } from "../../types";

// https://scryfall.com/docs/api/cards/search

const searchCardsUrl = "https://api.scryfall.com/cards/search?";
const symbolsUrl = "https://api.scryfall.com/symbology";

export const searchCard = async (name: String): Promise<Array<mtgCard>> => {
  try {
    const response = await fetch(searchCardsUrl + "q=" + name);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const raw = await response.json();

    // format the result from searchCard into how we format the decks
    // https://scryfall.com/docs/api/cards/search    const seen = new Set<string>();
    return raw.data.map((card: mtgCard) => {
      return { name: card.name, details: card, copies: 1 };
    });
  } catch (error: any) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};

export const getSymbolUris = async (): Promise<Array<MtgSymbol>> => {
  try {
    const response = await fetch(symbolsUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const raw = await response.json();

    return raw.data.map((item: any) => {
      return { symbol: item.symbol, url: item.svg_uri, alt: item.english };
    });
  } catch (error: any) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};
