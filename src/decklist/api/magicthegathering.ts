import { mtgCard } from "../../types";

// https://docs.magicthegathering.io/#advancedcards_get_by_name

const searchCardsUrl = "https://api.magicthegathering.io/v1/cards?";

export const searchCard = async (name: String): Promise<Array<mtgCard>> => {
  try {
    const response = await fetch(searchCardsUrl + "name=" + name);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const raw = await response.json();

    // format the result from searchCard into how we format the decks
    // see ygoCard in types/index.ts
    return raw.data.map((card: mtgCard) => {
      return { name: card.name, details: card, copies: 1 };
    });
  } catch (error: any) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};
