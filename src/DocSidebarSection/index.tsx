import clsx from "clsx";
import { uniq, useThemeConfig } from "@docusaurus/theme-common";
import { type Props as NavbarItemConfig } from "@theme/NavbarItem";
import {
  useActiveDocContext,
  useDocsVersionCandidates,
} from "@docusaurus/plugin-content-docs/client";
import Link from "@docusaurus/Link";

import styles from "./styles.module.css";

export const getLayoutDoc = (versions, docId) => {
  const allDocs = versions.flatMap((version) => version.docs);
  const doc = allDocs.find((versionDoc) => versionDoc.id === docId);
  if (!doc) {
    const isDraft = versions
      .flatMap((version) => version.draftIds)
      .includes(docId);
    // Drafts should be silently filtered instead of throwing
    if (isDraft) {
      return null;
    }
    throw new Error(
      `Couldn't find any doc with id "${docId}" in version${
        versions.length > 1 ? "s" : ""
      } "${versions.map((version) => version.name).join(", ")}".
Available doc ids are:
- ${uniq(allDocs.map((versionDoc) => versionDoc.id)).join("\n- ")}`
    );
  }
  return doc;
};

export default function DocSidebarSection(props: { activePath: string }) {
  const items = useThemeConfig().navbar.items as NavbarItemConfig[];
  const categories = [
    ...items.filter((x) => x.label.indexOf("Documentation") !== -1)[0].items,
  ];
  categories.push(
    items.filter((x) => x.label.indexOf("Example Projects") !== -1)[0]
  );

  const { activeDoc } = useActiveDocContext(undefined);
  const versions = useDocsVersionCandidates(undefined);

  const categoriesByDistance: [NavbarItemConfig | null, number][] = categories
    .map((category): [NavbarItemConfig | null, number] => {
      if (category.type === "doc") {
        const doc = getLayoutDoc(versions, category.docId);
        if (
          activeDoc !== undefined &&
          doc !== undefined &&
          doc !== null &&
          activeDoc.path.startsWith(doc.path)
        ) {
          return [category, activeDoc.path.length - doc.path.length];
        }
      }
      return [category, 1000];
    })
    .sort((a, b) => {
      return a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0;
    });
  const selectedCategory = categoriesByDistance[0][0];

  return (
    <div className={clsx("card margin-bottom--sm", styles.sidebarCategory)}>
      <div className={clsx(styles.viewLead)}>Viewing documentation for</div>
      <div className={clsx(styles.sectionName)}>
        <strong>{selectedCategory?.label}</strong>
      </div>
      <div className={clsx(styles.switchTo)}>
        <Link to="/docs/index" className="">
          ← Back to index
        </Link>
      </div>
    </div>
  );
}
