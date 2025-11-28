import { useCallback, useState } from "react";

export default function NodeRef(props: { name: string }) {
  return (
    <>
      <span
        style={{
          background:
            "linear-gradient(180deg, rgba(50, 50, 116, 1), rgba(40, 40, 83, 1))",
          color: "#fff",
          padding: "2px 10px",
          borderRadius: "14px",
          border: "solid 1px rgba(16, 16, 16, 0.8)",
          boxShadow: "2px 2px 3px rgba(0,0,0,0.5)",
          marginRight: "5px",
        }}
      >
        {props.name}
      </span>
    </>
  );
}
