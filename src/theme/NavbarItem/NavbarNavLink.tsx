import React, { type ReactNode } from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import isInternalUrl from "@docusaurus/isInternalUrl";
import { isRegexpStringMatch } from "@docusaurus/theme-common";
import IconExternalLink from "@theme/Icon/ExternalLink";
import type { Props } from "@theme/NavbarItem/NavbarNavLink";

function LinkWithHint(props: {
  label: ReactNode;
  isExternalLink: boolean;
  isDropdownLink: boolean;
  hint: string;
  blueprint?: boolean;
  cpp?: boolean;
}) {
  let hint: React.ReactNode = props.hint;
  if (props.hint.indexOf("Click here!") !== -1) {
    hint = (
      <>
        {props.hint.substring(0, props.hint.indexOf("Click here!"))}
        <span style={{ textDecoration: "underline" }}>Click here!</span>
      </>
    );
  }

  let pips: React.ReactNode[] = [];
  if (props.blueprint) {
    pips.push(
      <span className="badge badge--primary margin-left--sm" key="blueprint">
        Blueprints
      </span>
    );
  }
  if (props.cpp) {
    pips.push(
      <span className="badge badge--success margin-left--sm" key="blueprint">
        C++
      </span>
    );
  }

  return (
    <>
      <div>
        <div>
          <span>
            <strong className="wants-active">{props.label}</strong>
            <span style={{ float: "right" }}>{pips}</span>
          </span>
          {props.isExternalLink && (
            <IconExternalLink
              {...(props.isDropdownLink && { width: 12, height: 12 })}
            />
          )}
        </div>
        <div style={{ opacity: 0.7 }}>{hint}</div>
      </div>
    </>
  );
}

export default function NavbarNavLink({
  activeBasePath,
  activeBaseRegex,
  to,
  href,
  label,
  html,
  isDropdownLink,
  prependBaseUrlToHref,
  ...props
}: Props): ReactNode {
  // TODO all this seems hacky
  // {to: 'version'} should probably be forbidden, in favor of {to: '/version'}
  const toUrl = useBaseUrl(to);
  const activeBaseUrl = useBaseUrl(activeBasePath);
  const normalizedHref = useBaseUrl(href, { forcePrependBaseUrl: true });
  const isExternalLink = label && href && !isInternalUrl(href);

  // Link content is set through html XOR label
  const linkContentProps = html
    ? { dangerouslySetInnerHTML: { __html: html } }
    : (props as any).hint !== undefined
    ? {
        children: (
          <LinkWithHint
            label={label}
            isExternalLink={!!isExternalLink}
            isDropdownLink={!!isDropdownLink}
            hint={(props as any).hint}
            blueprint={(props as any).blueprint}
            cpp={(props as any).cpp}
          />
        ),
      }
    : {
        children: (
          <>
            {label}
            {isExternalLink && (
              <IconExternalLink
                {...(isDropdownLink && { width: 12, height: 12 })}
              />
            )}
            {(props as any).hint !== undefined ? (
              <>{(props as any).hint}</>
            ) : null}
          </>
        ),
      };

  if (href) {
    return (
      <Link
        href={prependBaseUrlToHref ? normalizedHref : href}
        {...props}
        {...linkContentProps}
      />
    );
  }

  return (
    <Link
      to={toUrl}
      isNavLink
      {...((activeBasePath || activeBaseRegex) && {
        isActive: (_match, location) =>
          activeBaseRegex
            ? isRegexpStringMatch(activeBaseRegex, location.pathname)
            : location.pathname.startsWith(activeBaseUrl),
      })}
      {...props}
      {...linkContentProps}
    />
  );
}
