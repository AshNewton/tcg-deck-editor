import { AlertProps } from "@mui/material";
import { BanType, Card } from "../../types";

export const getBannedSeverity = (banType: BanType): AlertProps["severity"] => {
  switch (banType) {
    case "Forbidden":
      return "error";
    case "Limited":
      return "warning";
    case "Semi-Limited":
      return "warning";
    default:
      return "success";
  }
};

export const getCardLevelName = (card: Card | null): string => {
  return card?.details?.type === "Link Monster"
    ? "Link Rating"
    : card?.details?.type === "XYZ Monster"
    ? "Rank"
    : "Level";
};
