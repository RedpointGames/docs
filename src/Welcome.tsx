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
        <div className="card">
          <div className="card__header">
            <h3>Paid Edition</h3>
          </div>
          <div className="card__body">
            You can install the plugin through the Epic Games Launcher.
          </div>
          <div className="card__footer">
            <a
              className="button button--success button--block"
              href="https://www.fab.com/listings/b900b244-0ff6-49e3-8562-5fc630ba9515"
              target="_blank"
            >
              View on Fab
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
            Download the ZIP file for the latest stable version of Unreal
            Engine.
          </div>
          <div className="card__footer">
            <a
              className="button button--success button--block"
              href="https://licensing.redpoint.games/get/eos-online-subsystem-free/"
              target="_blank"
            >
              Download now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InstallSdk() {
  return (
    <EOSVersionResolver>
      <p>
        If you are not using the Paid Edition installed through Fab, you will
        need to download and unzip the EOS SDK in one of the following supported
        locations. You can download the EOS SDK from the Epic Games developer
        portal.
      </p>
      <Admonition type="warning">
        The Free Edition currently requires{" "}
        <strong>
          <EOSVersion />
        </strong>
        . If you can't download this version from the Epic Games developer
        portal, you will either need to wait until the Free Edition is updated
        to be compatible with the latest version, or purchase the Paid Edition
        (which includes the required EOS SDK for you).
      </Admonition>
      <p>
        You need to extract the ZIP into a folder with a matching name. For
        example, if you were installing SDK <CodeWithEOSSuffix />, you would
        extract it to one of the following locations.{" "}
        <strong>
          Substitute the version number in the folder path for the version
          number of the SDK you are using.
        </strong>
      </p>
      <ul>
        <li>
          <CodeWithEOSSuffix>
            &lt;project&gt;\Plugins\EOS-SDK-
          </CodeWithEOSSuffix>
        </li>
        <li>
          <CodeWithEOSSuffix>
            C:\Users\&lt;username&gt;\Downloads\EOS-SDK-
          </CodeWithEOSSuffix>
        </li>
        <li>
          <CodeWithEOSSuffix>C:\ProgramData\EOS-SDK-</CodeWithEOSSuffix>
        </li>
        <li>
          <CodeWithEOSSuffix>C:\EOS-SDK-</CodeWithEOSSuffix>
        </li>
        <li>
          <CodeWithEOSSuffix>
            /Users/&lt;username&gt;/Downloads/EOS-SDK-
          </CodeWithEOSSuffix>
        </li>
      </ul>
      <p>
        If you need iOS support, you can download the EOS iOS SDK from the Epic
        Games developer portal and extract it in one of the following locations:
      </p>
      <ul>
        <li>
          <CodeWithEOSSuffix>
            &lt;project&gt;\Plugins\EOS-SDK-IOS-
          </CodeWithEOSSuffix>
        </li>
        <li>
          <CodeWithEOSSuffix>
            C:\Users\&lt;username&gt;\Downloads\EOS-SDK-IOS-
          </CodeWithEOSSuffix>
        </li>
        <li>
          <CodeWithEOSSuffix>C:\ProgramData\EOS-SDK-IOS-</CodeWithEOSSuffix>
        </li>
        <li>
          <CodeWithEOSSuffix>C:\EOS-SDK-IOS-</CodeWithEOSSuffix>
        </li>
        <li>
          <CodeWithEOSSuffix>
            /Users/&lt;username&gt;/Downloads/EOS-SDK-IOS-
          </CodeWithEOSSuffix>
        </li>
      </ul>
      <p>
        If you need Android or Quest support, you can download the EOS Android
        SDK from the Epic Games developer portal and extract it in one of the
        following locations:
      </p>
      <ul>
        <li>
          <CodeWithEOSSuffix>
            &lt;project&gt;\Plugins\EOS-SDK-Android-
          </CodeWithEOSSuffix>
        </li>
        <li>
          <CodeWithEOSSuffix>
            C:\Users\&lt;username&gt;\Downloads\EOS-SDK-Android-
          </CodeWithEOSSuffix>
        </li>
        <li>
          <CodeWithEOSSuffix>C:\ProgramData\EOS-SDK-Android-</CodeWithEOSSuffix>
        </li>
        <li>
          <CodeWithEOSSuffix>C:\EOS-SDK-Android-</CodeWithEOSSuffix>
        </li>
        <li>
          <CodeWithEOSSuffix>
            /Users/&lt;username&gt;/Downloads/EOS-SDK-Android-
          </CodeWithEOSSuffix>
        </li>
      </ul>
    </EOSVersionResolver>
  );
}
