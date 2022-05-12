import React from "react";
import mermaid from "mermaid";
import { useEffect } from "react"; 
import "./css/mermaid.css";

export default function Mermaid({ chart }) {
    mermaid.initialize({
        startOnLoad: true,
        securityLevel: "loose",
    });

    useEffect(() => {
        mermaid.contentLoaded();
    }, [chart]);

    return (
        <div className="mermaid">
            {chart}
        </div>
    )
};