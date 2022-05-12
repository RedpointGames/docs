import * as React from "react";

export default function CoverageBadge(props: { coverage: number }) {
    if (props.coverage >= 95) {
        return <span className="badge badge--success">{props.coverage}%</span>;
    } else if (props.coverage >= 75) {
        return <span className="badge badge--primary" style={{ backgroundColor: 'rgb(53, 120, 229)', borderColor: 'rgb(53, 120, 229)'}}>{props.coverage}%</span>;
    } else if (props.coverage >= 50) {
        return <span className="badge badge--warning" style={{color: 'var(--ifm-color-black)'}}>{props.coverage}%</span>;
    } else {
        return <span className="badge badge--danger">{props.coverage}%</span>;
    }
}