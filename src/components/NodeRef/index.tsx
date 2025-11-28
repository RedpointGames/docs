import { useCallback, useState } from "react";

export default function NodeRef(props: {
  name: string;
  event?: true;
  pure?: true;
}) {
  return (
    <>
      <span
        style={{
          background: props.pure
            ? "linear-gradient(180deg, rgba(33, 78, 33, 1), rgba(30, 58, 30, 1))"
            : !props.event
            ? "linear-gradient(180deg, rgba(50, 50, 116, 1), rgba(40, 40, 83, 1))"
            : "linear-gradient(180deg, rgba(80, 34, 34, 1), rgba(51, 25, 25, 1))",
          color: "#fff",
          padding: "2px 10px",
          borderRadius: "14px",
          border: "solid 1px rgba(16, 16, 16, 0.8)",
          boxShadow: "2px 2px 3px rgba(0,0,0,0.5)",
          marginLeft: "3px",
          marginRight: "5px",
        }}
      >
        {props.name}
      </span>
    </>
  );
}
