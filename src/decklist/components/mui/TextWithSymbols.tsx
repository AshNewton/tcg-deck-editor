import Typography from "@mui/material/Typography";

import { MtgSymbol } from "../../../types";

type Props = {
  text?: string;
  symbols: Array<MtgSymbol>;
};

type Part = string | { symbol: string; src: string; alt: string };

const TextWithSymbols = ({ text, symbols }: Props) => {
  // Create a map to look up both URL and alt by symbol
  const SYMBOL_MAP = new Map<string, { src: string; alt: string }>(
    symbols.map(({ symbol, url, alt }) => [symbol, { src: url, alt }])
  );

  const escapeRegex = (s: string) => s.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");

  const parseSymbols = (input?: string): Part[] => {
    if (!input) return [];

    // Match exact symbols, longest first to prevent partial matches
    const sortedSymbols = [...SYMBOL_MAP.keys()].sort(
      (a, b) => b.length - a.length
    );
    const pattern = sortedSymbols.map(escapeRegex).join("|");
    const regex = new RegExp(`(${pattern})`, "g");

    const parts: Part[] = [];
    let lastIndex = 0;

    input.replace(regex, (match, _, offset) => {
      if (offset > lastIndex) {
        parts.push(input.slice(lastIndex, offset)); // text before match
      }

      const symbolData = SYMBOL_MAP.get(match);
      if (symbolData) {
        parts.push({ symbol: match, ...symbolData });
      } else {
        parts.push(match); // fallback, should never happen
      }

      lastIndex = offset + match.length;
      return match;
    });

    if (lastIndex < input.length) {
      parts.push(input.slice(lastIndex)); // remaining text
    }

    return parts;
  };

  return (
    <Typography
      sx={{
        whiteSpace: "pre-line",
      }}
    >
      {parseSymbols(text).map((part, idx) =>
        typeof part === "string" ? (
          <span key={idx}>{part}</span>
        ) : (
          <img
            key={idx}
            src={part.src}
            alt={part.alt}
            title={part.alt}
            style={{ height: "1em", verticalAlign: "middle" }}
          />
        )
      )}
    </Typography>
  );
};

export default TextWithSymbols;
