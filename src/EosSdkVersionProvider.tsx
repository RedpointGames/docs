import * as React from "react";
import { useState, useEffect } from "react";

export interface EosSdkVersionInfo {
  freeEditionVersion: string;
  availableVersions: string[];
}

export const EosSdkVersionContext = React.createContext<
  EosSdkVersionInfo | undefined
>(undefined);

async function fetchFreeEditionVersion(): Promise<string> {
  const response = await fetch(
    "https://licensing-api.redpoint.games/api/dependency-version/eos-online-subsystem-free"
  );
  const data = await response.text();
  return data;
}

async function fetchAvailableVersions(): Promise<string[]> {
  const response = await fetch(
    "https://licensing-api.redpoint.games/api/eos-sdk-supported-versions"
  );
  const data = await response.text();
  return data
    .split("\n")
    .map((x) => x.trim())
    .filter((x) => x !== "");
}

async function fetchEosSdkVersionInfo(): Promise<EosSdkVersionInfo> {
  const results = await Promise.all([
    fetchFreeEditionVersion(),
    fetchAvailableVersions(),
  ]);
  return {
    freeEditionVersion: results[0],
    availableVersions: results[1],
  };
}

export default function EosSdkVersionProvider(props: {
  children?: React.ReactNode;
}) {
  const [data, setData] = useState<EosSdkVersionInfo | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      setData(await fetchEosSdkVersionInfo());
    };
    fetchData();
  }, []);

  return (
    <EosSdkVersionContext.Provider value={data}>
      {props.children}
    </EosSdkVersionContext.Provider>
  );
}

export function LoadingText(props: { children: string }) {
  return (
    <span className="loading-animation" aria-label={props.children}>
      {props.children
        .toString()
        .split("")
        .map((val, idx) => (
          <span
            key={idx}
            style={{
              animationDelay:
                (props.children.toString().length - idx) * -100 + "ms",
            }}
          >
            {val}
          </span>
        ))}
    </span>
  );
}

export function PendingEosSdkVersion() {
  return (
    <span
      className="loading-animation"
      aria-label="The required EOS SDK version has not loaded from our API server yet."
    >
      {"████████-v██████"
        .toString()
        .split("")
        .map((val, idx) => (
          <span
            key={idx}
            style={{
              animationDelay:
                ("████████-v██████".toString().length - idx) * -100 + "ms",
            }}
          >
            {val}
          </span>
        ))}
    </span>
  );
}

export function ConditionalEosSdkVersion(props: { version?: string }) {
  if (props.version !== undefined) {
    return <strong>{props.version}</strong>;
  } else {
    return <PendingEosSdkVersion />;
  }
}

export function CodeWithEosSdkVersionSuffix(props: {
  children?: React.ReactNode;
}) {
  return (
    <EosSdkVersionContext.Consumer>
      {(value) => {
        if (value === undefined) {
          return (
            <code>
              {props.children}
              <LoadingText>████████-v██████</LoadingText>
            </code>
          );
        } else {
          return (
            <code>
              {props.children}
              {value}
            </code>
          );
        }
      }}
    </EosSdkVersionContext.Consumer>
  );
}
