import { useCallback, useState } from "react";
import Admonition from "@theme/Admonition";
import LicenseKeyGuidance from "./license_key.mdx";
import EosSdkVersionProvider, {
  CodeWithEosSdkVersionSuffix,
  ConditionalEosSdkVersion,
  EosSdkVersionContext,
  EosSdkVersionInfo,
  PendingEosSdkVersion,
} from "../../EosSdkVersionProvider";

type Edition = "not-set" | "paid" | "free";
type Install =
  | "not-set"
  | "epic-games-launcher"
  | "redpoint-gitlab"
  | "redpoint-license-manager";

const promptStyle: React.CSSProperties = { marginBottom: "0.5em" };
const selectStyle: React.CSSProperties = {
  width: "100%",
  textAlign: "left",
  padding:
    "calc( var(--ifm-button-padding-vertical) * var(--ifm-button-size-multiplier) ) calc( var(--ifm-button-padding-vertical) * var(--ifm-button-size-multiplier) )",
  margin: "0 0 calc(var(--ifm-paragraph-margin-bottom)/2)",
};

function tryGetLocalStorage(key: string, def: string) {
  if (globalThis === undefined || globalThis.localStorage === undefined) {
    return def;
  } else {
    return globalThis.localStorage.getItem(key) ?? def;
  }
}

function EOSSDKInstallWithDefault(props: {
  eosSdkVersionInfo?: EosSdkVersionInfo;
}) {
  let localEdition = tryGetLocalStorage("plugin-edition", "not-set");
  let localInstall = tryGetLocalStorage("plugin-install", "not-set");
  let localSdkVersion = tryGetLocalStorage(
    "plugin-sdk-version",
    props.eosSdkVersionInfo?.availableVersions[0] ?? "not-set"
  );

  const [edition, setEdition] = useState<Edition>(
    localEdition === "free" || localEdition === "paid"
      ? localEdition
      : "not-set"
  );
  const [install, setInstall] = useState<Install>(
    localInstall === "epic-games-launcher" ||
      localInstall === "redpoint-gitlab" ||
      localInstall === "redpoint-license-manager"
      ? localInstall
      : "not-set"
  );
  let [sdkVersion, setSdkVersion] = useState<string | undefined>(
    localSdkVersion !== null && localSdkVersion !== "not-set"
      ? localSdkVersion
      : undefined
  );

  if (
    props.eosSdkVersionInfo !== undefined &&
    (sdkVersion === undefined ||
      !props.eosSdkVersionInfo.availableVersions.includes(sdkVersion))
  ) {
    sdkVersion = props.eosSdkVersionInfo.availableVersions[0];
  }

  const changeEdition = useCallback(
    (ev: React.ChangeEvent<HTMLSelectElement>) => {
      setEdition(ev.target.value as Edition);
      window?.localStorage.setItem("plugin-edition", ev.target.value);
      if (ev.target.value === "free") {
        setInstall("redpoint-license-manager");
        window?.localStorage.setItem(
          "plugin-install",
          "redpoint-license-manager"
        );
      }
    },
    [setEdition, setInstall]
  );

  const changeInstall = useCallback(
    (ev: React.ChangeEvent<HTMLSelectElement>) => {
      setInstall(ev.target.value as Install);
      window?.localStorage.setItem("plugin-install", ev.target.value);
    },
    [setInstall]
  );

  const changeSdkVersion = useCallback(
    (ev: React.ChangeEvent<HTMLSelectElement>) => {
      setSdkVersion(ev.target.value);
      window?.localStorage.setItem("plugin-sdk-version", ev.target.value);
    },
    [setSdkVersion]
  );

  let targetVersion =
    edition === "free"
      ? props.eosSdkVersionInfo?.freeEditionVersion
      : sdkVersion;
  let adjustedVersion: string | undefined = undefined;
  if (targetVersion !== undefined) {
    let components = /^(.+)-v([^-]+)/.exec(targetVersion);
    adjustedVersion = `${components![2]}-CL${components![1]}`;
    if (parseInt(components![1]) <= 27379709) {
      adjustedVersion = `${components![2]}`;
      if (adjustedVersion === "1.16") {
        adjustedVersion = "1.16.0";
      }
    }
  }

  let installGuidance = (
    <div className="markdown">
      <h3>Download the EOS SDK</h3>
      <p></p>
      <ol>
        <li>
          Open the{" "}
          <a href="https://dev.epicgames.com/en-US" target="_blank">
            Epic Games Developer Portal
          </a>{" "}
          and locate your product. On your product page, click the{" "}
          <strong>Downloads & release notes</strong> button underneath "Download
          and configure EOS SDK".
        </li>
        <li>
          For desktop platforms, select <strong>C SDK</strong> as the SDK Type.
          <ul>
            <li>
              If you want to support Android, you'll also need to download{" "}
              <strong>SDK for Android</strong>.
            </li>
            <li>
              If you want to support iOS, you'll also need to download{" "}
              <strong>SDK for iOS</strong>.
            </li>
          </ul>
        </li>
        <li>
          Select <ConditionalEosSdkVersion version={adjustedVersion} /> as the
          SDK Version.
        </li>
        <li>
          Click <strong>Download EOS SDK</strong>. Repeat this process for
          additional platforms you need to support.
        </li>
      </ol>
      <h3>Extract the EOS SDK</h3>
      <p>
        Once you have downloaded the EOS SDK, you should extract each downloaded
        ZIP file to your project's <code>Plugins</code> folder. The files and
        folders in your project should look like this afterwards:
      </p>
      <ul>
        <li>
          <code>YourProject.uproject</code>
        </li>
        <li>
          <code>Content</code>
        </li>
        <li>
          <code>Plugins</code>
          <ul>
            <li>
              <code>EOS</code>:{" "}
              <strong>Install the Redpoint EOS Online Framework here</strong>;
              the following subdirectories and files should exist:
              <ul>
                <li>
                  <code>OnlineSubsystemRedpointEOS.uplugin</code>
                </li>
                <li>
                  <code>Config</code>
                </li>
                <li>
                  <code>Resources</code>
                </li>
                <li>
                  <code>Source</code>
                </li>
              </ul>
            </li>
            <li>
              {targetVersion === undefined ? (
                <code>
                  EOS-SDK-
                  <PendingEosSdkVersion />
                </code>
              ) : (
                <code>EOS-SDK-{targetVersion}</code>
              )}
              : <strong>Extract the EOS SDK ZIP here</strong>; the following
              subdirectories and files should exist:
              <ul>
                <li>
                  <code>Samples</code>
                </li>
                <li>
                  <code>SDK</code>
                </li>
                <li>
                  <code>ThirdPartyNotices</code>
                </li>
              </ul>
            </li>
            <li>
              {targetVersion === undefined ? (
                <code>
                  EOS-SDK-Android-
                  <PendingEosSdkVersion />
                </code>
              ) : (
                <code>EOS-SDK-Android-{targetVersion}</code>
              )}
              : <strong>Extract the SDK for Android ZIP here</strong>; if you
              also downloaded the SDK for Android
            </li>
            <li>
              {targetVersion === undefined ? (
                <code>
                  EOS-SDK-IOS-
                  <PendingEosSdkVersion />
                </code>
              ) : (
                <code>EOS-SDK-IOS-{targetVersion}</code>
              )}
              : <strong>Extract the SDK for iOS ZIP here</strong>; if you also
              downloaded the SDK for iOS
            </li>
          </ul>
        </li>
        <li>...</li>
      </ul>
      <p>
        After you have extracted the EOS SDK to these locations, check that the
        following file exists at exactly this path:
        <br />
        <strong>
          {targetVersion === undefined ? (
            <code>
              (Project Directory)\Plugins\EOS-SDK-
              <PendingEosSdkVersion />
              \SDK\Include\eos_version.h
            </code>
          ) : (
            <code>
              (Project Directory)\Plugins\EOS-SDK-{targetVersion}
              \SDK\Include\eos_version.h
            </code>
          )}
        </strong>
      </p>
      <p>
        If that file doesn't exist, or the path is slightly different, you've
        installed the EOS SDK into the wrong place. Make sure that{" "}
        <code>SDK</code> exists as a subdirectory of the{" "}
        {targetVersion === undefined ? (
          <code>
            EOS-SDK-
            <PendingEosSdkVersion />
          </code>
        ) : (
          <code>EOS-SDK-{targetVersion}</code>
        )}{" "}
        folder, otherwise the plugin won't work correctly.
      </p>
      <Admonition type="danger" title="Verify Before Continuing">
        <p>
          Make sure the file exists at the path listed above before continuing.
          The Redpoint EOS Online Framework plugin will not compile if the EOS
          SDK hasn't been installed correctly and may prevent you from opening
          your project.
        </p>
      </Admonition>
      {edition === "free" ? <LicenseKeyGuidance /> : null}
    </div>
  );

  let resultContent: React.ReactNode = null;
  if (edition === "not-set" || install === "not-set") {
    resultContent = (
      <div style={{ marginTop: "var(--ifm-paragraph-margin-bottom)" }}>
        <Admonition type="danger">
          <p>
            Please select missing options above for guidance on how to install
            the EOS SDK. The plugin will not work if you don't install the EOS
            SDK correctly.
          </p>
        </Admonition>
      </div>
    );
  } else if (edition === "paid" && install === "epic-games-launcher") {
    resultContent = (
      <div style={{ marginTop: "var(--ifm-paragraph-margin-bottom)" }}>
        <Admonition type="success" title="Already Installed">
          <p>
            You don't need to install the EOS SDK, as it is included when
            installing via the Epic Games Launcher.
          </p>
        </Admonition>
      </div>
    );
  } else if (edition === "free") {
    if (props.eosSdkVersionInfo === undefined) {
      resultContent = (
        <div style={{ marginTop: "var(--ifm-paragraph-margin-bottom)" }}>
          <Admonition type="warning" title="Please Wait">
            <p>
              We're checking the version of the EOS SDK you need to install with
              the Free Edition. If this message does not go away, please let us
              know in our Discord.
            </p>
          </Admonition>
        </div>
      );
    } else {
      resultContent = (
        <>
          <div style={{ marginTop: "var(--ifm-paragraph-margin-bottom)" }}>
            <Admonition type="warning" title="Exact Version Required">
              <p>
                You must download exactly{" "}
                <ConditionalEosSdkVersion
                  version={props.eosSdkVersionInfo?.freeEditionVersion}
                />
                . The Free Edition is built to work with exactly that version,
                and won't run with a different version installed.
              </p>
              <p>
                If this version of the EOS SDK is no longer available in the
                Epic Games Developer Portal, you will need to wait for the next
                release of EOS Online Framework.
              </p>
            </Admonition>
          </div>
          {installGuidance}
        </>
      );
    }
  } else {
    resultContent = installGuidance;
  }

  return (
    <>
      <p>
        You may need to download and install the EOS SDK to use Redpoint EOS
        Online Framework, depending on what edition you've installed and how
        you've downloaded it. This guide will help you install it into the
        correct place.
      </p>
      <div className="row">
        <div className="col col--12">
          <p style={promptStyle}>
            What edition of Redpoint EOS Online Framework are you using?
          </p>
          <select
            className="button button--secondary"
            style={selectStyle}
            onChange={changeEdition}
            value={edition}
          >
            {edition === "not-set" ? (
              <option value="not-set">(Please select an option)</option>
            ) : null}
            <option value="paid">Paid Edition</option>
            <option value="free">Free Edition</option>
          </select>
        </div>
        <div
          className="col col--12"
          style={edition === "not-set" ? { display: "none" } : undefined}
        >
          <p style={promptStyle}>
            How have you installed the Redpoint EOS Online Framework?
          </p>
          {edition === "free" ? (
            <select
              className="button button--secondary"
              style={selectStyle}
              disabled={true}
            >
              <option>From the Redpoint License Manager</option>
            </select>
          ) : (
            <select
              className="button button--secondary"
              style={selectStyle}
              onChange={changeInstall}
              value={install}
            >
              {install === "not-set" ? (
                <option value="not-set">(Please select an option)</option>
              ) : null}
              <option value="epic-games-launcher">
                From the Epic Games Launcher
              </option>
              <option value="redpoint-gitlab">From the Redpoint GitLab</option>
              <option value="redpoint-license-manager">
                From the Redpoint License Manager
              </option>
            </select>
          )}
        </div>
        <div
          className="col col--12"
          style={
            install === "not-set" ||
            (edition === "paid" && install === "epic-games-launcher")
              ? { display: "none" }
              : undefined
          }
        >
          <p style={promptStyle}>
            What version of the EOS SDK are you installing?
          </p>
          {edition === "free" ? (
            <select
              className="button button--secondary"
              style={selectStyle}
              disabled={true}
            >
              <option>
                {props.eosSdkVersionInfo === undefined
                  ? "Please wait while determine the supported EOS SDK versions..."
                  : props.eosSdkVersionInfo.freeEditionVersion}
              </option>
            </select>
          ) : (
            <select
              className="button button--secondary"
              style={selectStyle}
              onChange={changeSdkVersion}
              value={sdkVersion}
              disabled={props.eosSdkVersionInfo === undefined}
            >
              {props.eosSdkVersionInfo === undefined ? (
                <option>
                  Please wait while determine the supported EOS SDK versions...
                </option>
              ) : (
                props.eosSdkVersionInfo.availableVersions.map((x) => (
                  <option value={x} key={x}>
                    {x}
                  </option>
                ))
              )}
            </select>
          )}
        </div>
        <div className="col col--12">{resultContent}</div>
      </div>
    </>
  );
}

export function InstallSdk() {
  return (
    <EosSdkVersionProvider>
      <EosSdkVersionContext.Consumer>
        {(value) => {
          return <EOSSDKInstallWithDefault eosSdkVersionInfo={value} />;
        }}
      </EosSdkVersionContext.Consumer>
    </EosSdkVersionProvider>
  );
}
