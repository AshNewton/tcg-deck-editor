import MuiCard from "@mui/material/Card";

type Props = {
  children: React.ReactNode;
  [key: string]: any;
};

const DisplayCard = (props: Props) => {
  const { children, ...rest } = props;

  return (
    <MuiCard
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        borderRadius: 2,
        mt: 2,
        ml: 2,
        mr: 2,
        p: 2,
        ...rest,
      }}
    >
      {children}
    </MuiCard>
  );
};

export default DisplayCard;
