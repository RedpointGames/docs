import { useCallback, useState } from "react";
import MDXContent from "@theme/MDXContent";

export default function DeprecatedApiWarning(props: {
  children: React.ReactNode;
  warning: React.ReactNode;
}) {
  const [show, setShow] = useState(false);

  const onClick = useCallback(() => {
    setShow(true);
  }, [setShow]);

  if (show) {
    return <>{props.children}</>;
  }

  return (
    <>
      <div
        style={{
          backgroundColor: "var(--ifm-hover-overlay)",
          borderRadius: "20px",
        }}
        className="padding--lg"
      >
        <h3 className="text--center">⚠️ Legacy Documentation</h3>
        <p>
          The APIs described by this section have been replaced by newer
          alternatives. If you're not yet using these APIs, please see the
          recommended alternatives:
        </p>
        <MDXContent>{props.warning}</MDXContent>
        <div style={{ textAlign: "center" }}>
          <button
            className="button button--primary"
            style={{ margin: "0 auto" }}
            onClick={onClick}
          >
            View anyway
          </button>
        </div>
      </div>
    </>
  );
}
