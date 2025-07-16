import { BulkCardResponse, Card, ygoCard } from "../../types";

// https://ygoprodeck.com/api-guide/

const searchCardsUrl = "https://db.ygoprodeck.com/api/v7/cardinfo.php?";

export const searchCard = async (name: String): Promise<Array<Card>> => {
  try {
    const response = await fetch(searchCardsUrl + "fname=" + name);
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

export const bulkSearchCard = async (
  cardNames: Array<string>
): Promise<BulkCardResponse> => {
  try {
    const response = await fetch(
      searchCardsUrl + "name=" + cardNames.join("|")
    );
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
