import { ygoCard } from "../../types";

const searchCardsUrl = "https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=";

export const searchCard = async (name: String): Promise<Array<ygoCard>> => {
  try {
    const response = await fetch(searchCardsUrl + name);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const raw = await response.json();

    // format the result from searchCard into how we format the decks
    // see ygoCard in types/index.ts
    return raw.data.map((card: ygoCard) => {
      return { name: card.name, details: card, copies: 1 };
    });
  } catch (error: any) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};
