import React, { isValidElement, useContext } from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import classnames from "classnames";

import styles from "../pages/styles.module.css";

const FeatureSideContext = React.createContext(false);

export function FeatureList(props: { children: React.ReactNode }): JSX.Element {
  return (
    <>
      {React.Children.map(props.children, (child, index) => {
        return (
          <FeatureSideContext.Provider value={index % 2 === 0}>
            <div className="row">{child}</div>
          </FeatureSideContext.Provider>
        );
      })}
    </>
  );
}

export function Feature(props: { children: React.ReactNode }): JSX.Element {
  const sideContext = useContext(FeatureSideContext);

  const children = React.Children.toArray(props.children);

  const describerArray = children.filter(
    (x) => isValidElement(x) && x.type === Feature.Describer
  );
  const visualArray = children.filter(
    (x) => isValidElement(x) && x.type === Feature.Visual
  );

  if (visualArray.length === 0 && describerArray.length === 2) {
    return (
      <>
        <div className={classnames("col", "col--6")}>{describerArray[0]}</div>
        <div className={classnames("col", "col--6")}>{describerArray[1]}</div>
      </>
    );
  } else if (visualArray.length === 0 && describerArray.length === 1) {
    return (
      <>
        <div className={classnames("col", "col--12")}>{describerArray[0]}</div>
      </>
    );
  } else if (sideContext.valueOf()) {
    return (
      <>
        <div className={classnames("col", "col--6")}>{describerArray[0]}</div>
        <div className={classnames("col", "col--6")}>{visualArray[0]}</div>
      </>
    );
  } else {
    return (
      <>
        <div className={classnames("col", "col--6")}>{visualArray[0]}</div>
        <div className={classnames("col", "col--6", styles.reorder)}>
          {describerArray[0]}
        </div>
      </>
    );
  }
}

Feature.Describer = function (props: {
  children: React.ReactNode;
}): JSX.Element {
  return <>{props.children}</>;
};

Feature.Visual = function (props: {
  children?: React.ReactNode;
  imageUrl?: string;
}): JSX.Element {
  if (props.imageUrl !== undefined) {
    return (
      <a href={useBaseUrl(props.imageUrl)} target="_blank">
        <img
          src={useBaseUrl(props.imageUrl)}
          className={classnames(styles.featureImage)}
        />
      </a>
    );
  } else {
    return <>{props.children}</>;
  }
};
