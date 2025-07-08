import { Link } from "@mui/material";

type Props = {
  href: string;
  label: string;
  [key: string]: any;
};

const ExternalLink = (props: Props) => {
  const { href, label, ...rest } = props;

  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {label}
    </Link>
  );
};

export default ExternalLink;
