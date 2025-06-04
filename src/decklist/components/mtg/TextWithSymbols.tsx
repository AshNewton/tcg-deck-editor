import Typography from "@mui/material/Typography";
import { MtgSymbol } from "../../../types";

type Props = {
  text: string;
  symbols: Array<MtgSymbol>;
};

type Part = string | { symbol: string; src: string; alt: string };

const TextWithSymbols = ({ text, symbols }: Props) => {
  // Create a map to look up both URL and alt by symbol
  const SYMBOL_MAP = new Map<string, { src: string; alt: string }>(
    symbols.map(({ symbol, url, alt }) => [symbol, { src: url, alt }])
  );

  const parseSymbols = (input: string) => {
    return [...input].reduce<Part[]>((acc, char) => {
      const last = acc[acc.length - 1];

      // Handle start of symbol
      if (char === "{") {
        acc.push(char);
        return acc;
      }

      // Handle end of symbol
      if (char === "}" && typeof last === "string" && last.startsWith("{")) {
        const maybeSymbol = last + char;
        const match = SYMBOL_MAP.get(maybeSymbol);

        acc.pop(); // remove partial symbol
        if (match) {
          acc.push({ symbol: maybeSymbol, ...match });
        } else {
          acc.push(maybeSymbol); // fallback: treat as plain text
        }
        return acc;
      }

      // If building symbol
      if (
        typeof last === "string" &&
        last.startsWith("{") &&
        !last.includes("}")
      ) {
        acc[acc.length - 1] += char;
        return acc;
      }

      // Append to last text part or start new one
      if (typeof last === "string") {
        acc[acc.length - 1] += char;
      } else {
        acc.push(char);
      }

      return acc;
    }, []);
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
