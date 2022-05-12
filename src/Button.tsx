import Link from "@docusaurus/Link";

export default function Button(props: {
  href: string;
  children?: React.ReactNode;
  text?: string;
}) {
  return (
    <Link to={props.href} className="button button--primary">
      {props.text ?? props.children}
    </Link>
  );
}
