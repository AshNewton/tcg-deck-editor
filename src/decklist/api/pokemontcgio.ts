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
    return raw.data.map((card: pokemonCard) => {
      return {
        name: card.name + " - " + card.set.name,
        details: card,
        copies: 1,
      };
    });
  } catch (error: any) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};
