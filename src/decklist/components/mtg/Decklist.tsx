import CardPreview from "../CardPreview";
import Text from "../mui/Text";

import Box from "@mui/material/Box";

import { getDeckSize } from "../../util/deckAnalytics";

import { Deck, mtgCard } from "../../../types";

type Props = {
  deck: Deck;
  onDelete: (deck: string) => void;
  onAddCopy: (deck: string) => void;
  onRemoveCopy: (deck: string) => void;
};

type SubtitleProps = {
  deck: Deck;
  deckname: string;
};

const Subtitle = (props: SubtitleProps) => {
  const { deckname, deck } = props;

  return (
    <Box
      mt={2}
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap={2}
      px={4}
      py={1}
    >
      <Text text={deckname} fontSize={18} />
      <Text text={`(${getDeckSize(deck)})`} />
    </Box>
  );
};

const CARD_TYPES = [
  { label: "Creatures", keyword: "Creature" },
  { label: "Instants", keyword: "Instant" },
  { label: "Sorceries", keyword: "Sorcery" },
  { label: "Enchantments", keyword: "Enchantment" },
  { label: "Artifacts", keyword: "Artifact" },
  { label: "Planeswalkers", keyword: "Planeswalker" },
  { label: "Lands", keyword: "Land" },
];

const Decklist = (props: Props) => {
  const { deck, onDelete, onAddCopy, onRemoveCopy } = props;

  const groupedDecks: Record<string, Deck> = {};
  CARD_TYPES.forEach(({ label }) => {
    groupedDecks[label] = [];
  });

  deck.forEach((card) => {
    const typeLine = (card.details as mtgCard).type_line;

    for (const { label, keyword } of CARD_TYPES) {
      if (typeLine.includes(keyword)) {
        groupedDecks[label].push(card);
        break;
      }
    }
  });

  return (
    <>
      {CARD_TYPES.map(({ label }) => {
        const cards = groupedDecks[label];
        if (!cards.length) return null;

        return (
          <Box key={label}>
            <Subtitle deckname={label} deck={cards} />
            {cards.map((card) => (
              <CardPreview
                key={card.name}
                card={card}
                onDelete={onDelete}
                onAddCopy={onAddCopy}
                onRemoveCopy={onRemoveCopy}
              />
            ))}
          </Box>
        );
      })}
    </>
  );
};

export default Decklist;
