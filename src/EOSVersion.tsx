import * as React from "react";
import { useState, useEffect } from "react";

const EOSContext = React.createContext("...");

export function EOSVersionResolver(props) {
  const [status, setStatus] = useState("fetching");
  const [data, setData] = useState("...");

  useEffect(() => {
    const fetchData = async () => {
      setStatus("fetching");
      const response = await fetch(
        "https://licensing.redpoint.games/api/dependency-version/eos-online-subsystem-free"
      );
      const data = await response.text();
      setData(data.trim());
      setStatus("fetched");
    };
    fetchData();
  }, []);

  return (
    <EOSContext.Provider value={status === "fetched" ? data : "..."}>
      {props.children}
    </EOSContext.Provider>
  );
}
function LoadingText(props) {
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
export function EOSVersion() {
  return (
    <EOSContext.Consumer>
      {(value) => {
        if (value === "...") {
          return <LoadingText>████████-v██████</LoadingText>;
        } else {
          return value;
        }
      }}
    </EOSContext.Consumer>
  );
}
export function CodeWithEOSSuffix(props) {
  return (
    <EOSContext.Consumer>
      {(value) => {
        if (value === "...") {
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
    </EOSContext.Consumer>
  );
}
