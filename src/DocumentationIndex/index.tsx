import clsx from "clsx";
import { useThemeConfig } from "@docusaurus/theme-common";
import { type Props as NavbarItemConfig } from "@theme/NavbarItem";
import { ReactNode } from "react";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import { useDocsVersionCandidates } from "@docusaurus/plugin-content-docs/client";
import { getLayoutDoc } from "../DocSidebarSection";

import styles from "./styles.module.css";

function CardContainer({
  className,
  href,
  children,
}: {
  className?: string;
  href: string;
  children: ReactNode;
}): ReactNode {
  return (
    <Link
      href={href}
      className={clsx("card padding--lg", styles.cardContainer, className)}
    >
      {children}
    </Link>
  );
}

function CardLayout({
  className,
  href,
  title,
  description,
}: {
  className?: string;
  href: string;
  title: string;
  description: string;
}): ReactNode {
  let hint: React.ReactNode = description;
  if (description.indexOf("Click here!") !== -1) {
    hint = (
      <>
        {description.substring(0, description.indexOf("Click here!"))}
        <span style={{ textDecoration: "underline" }}>Click here!</span>
      </>
    );
  }

  return (
    <CardContainer href={href} className={className}>
      <Heading
        as="h2"
        className={clsx("text--truncate", styles.cardTitle)}
        title={title}
      >
        {title}
      </Heading>
      {description && (
        <p
          className={clsx("text--truncate", styles.cardDescription)}
          title={description}
        >
          {hint}
        </p>
      )}
    </CardContainer>
  );
}

export default function DocumentationIndex() {
  const items = useThemeConfig().navbar.items as NavbarItemConfig[];
  const categories = items.filter(
    (x) => x.label.indexOf("Documentation") !== -1
  )[0].items;

  const versions = useDocsVersionCandidates(undefined);

  return (
    <section className={clsx("row")}>
      {categories.map((category, index) => {
        const doc = getLayoutDoc(versions, category.docId);
        return (
          <article className={clsx(styles.docCardListItem, "col col--12")}>
            <CardLayout
              href={doc.path}
              title={category.label}
              description={category.hint}
            />
          </article>
        );
      })}
    </section>
  );

  return <></>;
}
