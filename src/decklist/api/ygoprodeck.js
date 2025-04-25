const searchCardsUrl = "https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=";

export const searchCard = async (name) => {
  try {
    const response = await fetch(searchCardsUrl + name);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // format the result from searchCard into how we format the decks
    const raw = await response.json();
    return raw.data.map((card) => {
      return { name: card.name, details: card, copies: 1 };
    });
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};
