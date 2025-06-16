import { Card, pokemonCard } from "../../types";

// https://pokemontcg.io/

const searchCardsUrl = "https://api.pokemontcg.io/";

export const searchCard = async (name: String): Promise<Array<Card>> => {
  try {
    const response = name.includes(" ")
      ? await fetch(searchCardsUrl + 'v2/cards?q=name:"*' + name + '*"')
      : await fetch(searchCardsUrl + "v2/cards?q=name:*" + name + "*");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const raw = await response.json();

    // format the result from searchCard into how we format the decks
    // see pokemonCard in types/index.ts
    const cards = raw.data.map((card: pokemonCard) => {
      return {
        name: card.name + " - " + card.set.name,
        details: card,
        copies: 1,
      };
    });

    // remove duplicates of name/set combination - these are just different rarities
    const seen = new Set();
    return cards.filter((card: Card) => {
      const value = card.name;
      if (seen.has(value)) {
        return false; // Skip duplicate
      }
      seen.add(value);
      return true; // Keep unique item
    });
  } catch (error: any) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};
