import { removeDuplicateCards } from "../util/util";

import { Deck, pokemonCard } from "../../types";

// https://pokemontcg.io/

const searchCardsUrl = "https://api.pokemontcg.io/";

export const searchCard = async (name: String): Promise<Deck> => {
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
    return removeDuplicateCards(cards);
  } catch (error: any) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};
