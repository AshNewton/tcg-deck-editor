export const getBannedSeverity = (banType) => {
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

export const getCardLevelName = (card) => {
  return card.details.type === "Link Monster"
    ? "Link Rating"
    : card.details.type === "XYZ Monster"
    ? "Rank"
    : "Level";
};
