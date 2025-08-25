import {
  EOSVersionResolver,
  EOSVersion,
  CodeWithEOSSuffix,
} from "@site/src/EOSVersion.tsx";
import Admonition from "@theme/Admonition";

export function DownloadPlugin() {
  return (
    <div className="row">
      <div className="col">
        <div className="card" style={{ marginBottom: "1em" }}>
          <div className="card__header">
            <h3>Paid Edition</h3>
          </div>
          <div className="card__body">
            <p style={{ marginBottom: "var(--ifm-paragraph-margin-bottom)" }}>
              You can install the plugin through the Epic Games Launcher, or get
              early access to fixes and features via the Redpoint GitLab.
            </p>
            ✅ Includes exclusive features such as team-based matchmaking,
            professional support and source code.
          </div>
          <div className="card__footer">
            <a
              className="button button--success button--block"
              href="https://www.fab.com/listings/b900b244-0ff6-49e3-8562-5fc630ba9515"
              target="_blank"
            >
              View on Fab
            </a>
            <a
              className="button button--secondary button--block"
              href="https://licensing.redpoint.games/download"
              target="_blank"
              style={{ marginTop: "0.5em" }}
            >
              Install via Redpoint License Manager
            </a>
            <a
              className="button button--secondary button--block"
              href="/docs/support/clone_from_gitlab"
              target="_blank"
              style={{ marginTop: "0.5em" }}
            >
              Install via Redpoint GitLab
            </a>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card">
          <div className="card__header">
            <h3>Free Edition</h3>
          </div>
          <div className="card__body">
            <p style={{ marginBottom: "var(--ifm-paragraph-margin-bottom)" }}>
              Download the ZIP file for the latest version of Unreal Engine, via
              the Redpoint License Manager.
            </p>
            ⚠️ The Free Edition only supports the latest version of Unreal
            Engine. If you need support for an older Unreal Engine version,
            you'll need to use the Paid Edition instead.
          </div>
          <div className="card__footer">
            <a
              className="button button--secondary button--block"
              href="https://licensing.redpoint.games/get/eos-online-subsystem-free/"
              target="_blank"
              style={{ minHeight: "8.5em", paddingTop: "3.5em" }}
            >
              Download now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
