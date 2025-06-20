import React from "react";
import classnames from "classnames";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";
import { Feature, FeatureList } from "../Feature";
import ReactPlayer from "react-player";
import CodeBlock from "@theme/CodeBlock";

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`${siteConfig.title} for Unreal Engine`}
      description={siteConfig.tagline}
    >
      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html: ".hide-on-non-docs { display: none; }",
        }}
      ></style>
      <header className={classnames("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">
            <strong style={{ textShadow: "1px 1px 4px #000" }}>
              Trusted by over 3,000 developers and millions of players
            </strong>
            ;<br />
            the professional solution to integrate Epic Online Services into
            your Unreal Engine game.
          </p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                "button button--success button--lg shadow--tl",
                styles.getStarted
              )}
              style={{
                border: "solid 4px rgb(50, 198, 50)",
              }}
              to={
                "https://www.fab.com/listings/b900b244-0ff6-49e3-8562-5fc630ba9515"
              }
            >
              Download EOS Online Framework
            </Link>
            <Link
              className={classnames(
                "button button--secondary button--lg shadow--tl",
                styles.getStarted
              )}
              to={useBaseUrl("docs/")}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        <section>
          <div className="container">
            <FeatureList>
              <Feature>
                <Feature.Describer>
                  <h2>The trusted Epic Online Services integration</h2>
                  <p>
                    Developed since the launch of Epic Online Services, and with
                    over 3,000 developers and millions of players worldwide,
                    Redpoint EOS Online Framework is the professional solution
                    for game developers integrating Epic Online Services into
                    Unreal Engine games.
                  </p>
                  <p>
                    Our plugin is used everywhere - from the smallest indie
                    games up to AAA titles. If you've played a game with Epic
                    Online Services integration, there's a good chance it's
                    built on the Redpoint EOS Online Framework.
                  </p>
                </Feature.Describer>
                <Feature.Visual>
                  <div className={classnames(styles.review)}>
                    <h3>
                      ⭐⭐⭐⭐⭐ "Exemplary. One of the best implemented,
                      maintained, and supported products on the marketplace."
                    </h3>
                    <p>
                      "I have used this for several years now and on many
                      projects. [...] I have no complaints and the utmost praise
                      for the plugin, the support, and the level of ancillary
                      value they've added with the professional setup of their
                      GitLab and the additional projects available there. I am a
                      professional developer who has been making games for 30
                      years and this is one of the best implemented projects
                      I've ever worked with."
                    </p>
                  </div>
                </Feature.Visual>
              </Feature>
              <Feature>
                <Feature.Describer>
                  <h2>True cross-play, your way</h2>
                  <p>
                    We provide cross-platform friends, presence, invites and
                    cross-play, even when you don't use Epic Games accounts.
                  </p>
                  <p>
                    Build your game for Windows, macOS, Linux, iOS, Android,
                    XR/VR and console platforms, and give your players a true
                    cross-play experience with EOS Online Framework.
                  </p>
                  <p>
                    You can even wire up your own cross-platform account system
                    and leverage the existing authentication integrations we've
                    done for desktop, mobile and console platforms.
                  </p>
                </Feature.Describer>
                <Feature.Describer>
                  <h2>Full console support</h2>
                  <p>
                    With support for Nintendo Switch&trade;, PlayStation&reg;4,
                    PlayStation&reg;5 and Xbox, EOS Online Framework is the
                    easiest way to use Epic Online Services in your console
                    game. We handle mirroring sessions, parties and invites to
                    console friends, as well as displaying console friends and
                    avatars in-game.
                  </p>
                  <p>
                    With EOS Online Framework, you get to focus more on building
                    your game and less on platform-specific code.
                  </p>
                </Feature.Describer>
              </Feature>
              <Feature>
                <Feature.Describer>
                  <h2>One plugin for everything online</h2>
                  <p>
                    We don't split our features or platform integrations into
                    other plugins, and we don't upsell you on other products.
                    You buy EOS Online Framework once, and you get everything:
                    seamless platform integrations, blueprints, team-based
                    matchmaking, professional support, and much more.
                  </p>
                </Feature.Describer>
                <Feature.Visual imageUrl="img/features/all-in-one.png" />
              </Feature>
              <Feature>
                <Feature.Describer>
                  <h2>No cost, scalable matchmaking</h2>
                  <p>
                    Looking to get parties or solo players into your team-based
                    game? Exclusive to EOS Online Framework, we provide scalable
                    matchmaking that gets players into teams, while preserving
                    parties and matching on skill ratings.
                  </p>
                  <p>
                    There's no monthly fees and no matchmaking servers to run:
                    team-based matchmaking is built on top of the Epic Online
                    Services lobbies and stats services.
                  </p>
                </Feature.Describer>
                <Feature.Visual imageUrl="img/features/matchmaking.png" />
              </Feature>
              <Feature>
                <Feature.Describer>
                  <h2>Seamless platform integrations</h2>
                  <p>
                    You don't need to write platform-specific code when you use
                    EOS Online Framework.
                  </p>
                  <p>
                    <em>Sending a game invite to a friend?</em> We handle
                    sending it over the local platform (e.g. Steam) to make it
                    as easy as possible for players to get into your game.
                  </p>
                  <p>
                    <em>Integrating e-commerce?</em> We provide e-commerce
                    integrations for Steam, Google Play and Epic Games Store, in
                    addition to the e-commerce support in the engine. You don't
                    need a third-party e-commerce solution when you use EOS
                    Online Framework.
                  </p>
                </Feature.Describer>
                <Feature.Visual imageUrl="img/features/seamless-invite.png" />
              </Feature>
              <Feature>
                <Feature.Describer>
                  <h2>Easy Anti-Cheat support</h2>
                  <p>
                    Protect your multiplayer game against cheating. EOS Online
                    Framework fully supports Easy Anti-Cheat on Windows and
                    console platforms. Just download your signing keys from the
                    Epic Online Services developer portal, and tick a checkbox
                    in Project Settings.
                  </p>
                </Feature.Describer>
                <Feature.Visual imageUrl="img/features/easy-anti-cheat.png" />
              </Feature>
              <Feature>
                <Feature.Describer>
                  <h2>Comprehensive blueprint support</h2>
                  <p>
                    With{" "}
                    <Link href={useBaseUrl("/docs/ossv1/")}>
                      over 400 blueprint nodes
                    </Link>{" "}
                    covering every major offering of Epic Online Services, you
                    don't need to write C++ to integrate Epic Online Services
                    into your game.
                  </p>
                </Feature.Describer>
                <Feature.Visual imageUrl="img/features/blueprints.png" />
              </Feature>
              <Feature>
                <Feature.Describer>
                  <h2>Out-of-the-box framework components</h2>
                  <p>
                    EOS Online Framework provides{" "}
                    <Link href={useBaseUrl("/docs/framework/")}>
                      high-level framework components
                    </Link>{" "}
                    such as:
                  </p>
                  <ul>
                    <li>
                      Add a startup screen to your game that automatically signs
                      players in, configurable with a logo texture or UMG
                      widget.
                    </li>
                    <li>
                      Automatically managed parties; we'll create a party when
                      players sign in and automatically re-create a party for
                      them if they leave the one they're currently in.
                    </li>
                    <li>
                      Display avatars of other players in game, with avatars
                      from Steam, Xbox, Discord and more all handled for you.
                    </li>
                    <li>
                      Automatically keep party members up-to-date in your lobby
                      screen using the <code>RedpointPartyMember</code> actor.
                    </li>
                    <li>
                      Bind the friends list and party members to a UMG tree view
                      widget; we'll keep entries up-to-date and you can focus on
                      design.
                    </li>
                  </ul>
                </Feature.Describer>
                <Feature.Visual>
                  <div className={classnames(styles.featureImage)}>
                    <ReactPlayer
                      playing
                      loop
                      muted
                      url={useBaseUrl("img/features/startup.mp4")}
                      width="100%"
                      height="auto"
                      style={{
                        marginTop: "1em",
                        marginBottom: "1em",
                        // fixes weird extra bottom margin around videos
                        display: "flex",
                      }}
                    />
                  </div>
                </Feature.Visual>
              </Feature>
              <Feature>
                <Feature.Describer>
                  <h2>Modern C++ APIs</h2>
                  <p>
                    If you prefer to work in C++, EOS Online Framework has{" "}
                    <Link href={useBaseUrl("/docs/systems/")}>
                      modern C++ APIs for Epic Online Services
                    </Link>{" "}
                    that are much nicer to work with than the online APIs
                    provided by Unreal Engine.
                  </p>
                  <p>
                    With namespaced functions and classes, C++20{" "}
                    <code>co_await</code> support and modern design principles,
                    our APIs make integrating Epic Online Services in C++ a
                    pleasant experience.
                  </p>
                </Feature.Describer>
                <Feature.Visual>
                  <div style={{ marginTop: "4em" }}>
                    <CodeBlock language="cpp">
                      {`
using namespace ::Redpoint::EOS::Core::Utils;
using namespace ::Redpoint::EOS::Identity;

// Get the handle to the Epic Online Services platform.
auto PlatformHandle = FWorldResolution::GetPlatformHandle(
                          this->GetWorld());

// Get the identity system.
auto Identity = PlatformHandle->GetSystem<IIdentitySystem>();

// Sign the local player in.
Identity->Login(
    FLoginRequest(0 /* User slot a.k.a. controller index. */)
    IIdentitySystem::FOnLoginComplete::CreateSPLambda(
        this, 
        [this](FError ErrorCode, FIdentityUserPtr NewUser) {
            if (ErrorCode.WasSuccessful())
            {
                // The user is signed in, and NewUser is valid.
            }
        }));`.trim()}
                    </CodeBlock>
                  </div>
                </Feature.Visual>
              </Feature>
              <Feature>
                <Feature.Describer>
                  <h2>Test using play-in-editor</h2>
                  <p>
                    With EOS Online Framework, there's no need to set up
                    multiple machines for testing. You can test parties,
                    multiplayer games, the Epic Games overlay, and all online
                    features directly from the editor.
                  </p>
                  <p>
                    Start the Developer Authentication Tool from the editor and
                    turn on "login-before-PIE", and each play-in-editor window
                    or standalone game will be automatically signed into an Epic
                    Games account for testing.
                  </p>
                </Feature.Describer>
                <Feature.Visual imageUrl="img/features/play-in-editor.png" />
              </Feature>
              <Feature>
                <Feature.Describer>
                  <h2>Free for students &amp; hobbyists</h2>
                  <p>
                    We offer a Free Edition of EOS Online Framework to students
                    &amp; hobbyists to make Epic Online Services accessible to
                    all developers!
                  </p>
                  <p>
                    If you earn less than $30k USD per year from any income
                    source, you're eligible to download EOS Online Framework for
                    free.
                  </p>
                  <p>
                    To download the Free Edition and use Epic Online Services
                    for free, see the{" "}
                    <Link href="/docs/licensing">Editions &amp; Licensing</Link>{" "}
                    page.
                  </p>
                </Feature.Describer>
                <Feature.Visual imageUrl="img/features/free-edition.png" />
              </Feature>
              <Feature>
                <Feature.Describer>
                  <h2>Professional support</h2>
                  <p>
                    If you get stuck, we're here to help. We provide
                    professional support during Australian business hours, and
                    can often get a resolution or bug fix to you within a few
                    days.
                  </p>
                  <p>
                    To get support for EOS Online Framework, upload your receipt
                    to our{" "}
                    <a href="https://licensing.redpoint.games/" target="_blank">
                      License Manager
                    </a>{" "}
                    and join{" "}
                    <a href="https://discord.gg/hm7ytagaCc">
                      our Discord server
                    </a>{" "}
                    to open a case.
                  </p>
                </Feature.Describer>
                <Feature.Visual>
                  <div className={classnames(styles.review)}>
                    <h3>⭐⭐⭐⭐⭐ "Amazing support and product"</h3>
                    <p>
                      "Discord Support is 10 stars, the developer saved me tons
                      of time and helped me to get started really quickly.
                      <br />
                      <br />
                      The plugin itself works like a charm. The sample project
                      provides functionality that you can easily copy paste into
                      your project and use it as a Subsystem to be able to call
                      all the EOS APIs.
                      <br />
                      <br />
                      Really recommended."
                    </p>
                  </div>
                </Feature.Visual>
              </Feature>
              <Feature>
                <Feature.Describer>
                  <h2>Fully featured</h2>
                  <p>
                    With comprehensive support for Epic Online Services, EOS
                    Online Framework provides you the tools you need to ship
                    online multiplayer games:
                  </p>
                  <div className="row">
                    <div className="col col--6">
                      <ul className={classnames(styles.noMarginOnSmallScreen)}>
                        <li>
                          Automatic authentication for:
                          <ul>
                            <li>
                              <Link href="/docs/setup/platforms/steam">
                                Steam
                              </Link>
                            </li>
                            <li>
                              <Link href="/docs/setup/platforms/epic">
                                Epic Games
                              </Link>
                            </li>
                            <li>
                              <Link href="/docs/setup/platforms/itchio">
                                itch.io
                              </Link>
                            </li>
                            <li>
                              <Link href="/docs/setup/platforms/gog">
                                GOG Galaxy
                              </Link>
                            </li>
                            <li>
                              <Link href="/docs/setup/platforms/meta">
                                Meta Quest
                              </Link>
                            </li>
                            <li>
                              <Link href="/docs/setup/platforms/apple">
                                Apple on iOS
                              </Link>
                            </li>
                            <li>
                              <Link href="/docs/setup/platforms/google">
                                Google on Android
                              </Link>
                            </li>
                            <li>
                              <Link href="/docs/setup/platforms/consoles">
                                Nintendo Switch&trade;
                              </Link>
                            </li>
                            <li>
                              <Link href="/docs/setup/platforms/consoles">
                                PlayStation&reg;
                              </Link>
                            </li>
                            <li>
                              <Link href="/docs/setup/platforms/consoles">
                                Xbox
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <Link href="/docs/auth/xplat/epic">
                            Cross-platform accounts with Epic Games
                          </Link>{" "}
                          or{" "}
                          <Link href="/docs/auth/write_your_own_cross_platform_account_provider">
                            your own account system
                          </Link>
                        </li>
                        <li>
                          <Link href="/docs/setup/crossplatform/friends">
                            Cross-platform friends
                          </Link>{" "}
                          &amp;{" "}
                          <Link href="/docs/framework/displaying_avatars">
                            avatars
                          </Link>
                        </li>
                        <li>
                          <Link href="/docs/ossv1/presence/updating">
                            Cross-platform presence
                          </Link>
                        </li>
                        <li>
                          Friend discovery with{" "}
                          <Link href="/docs/ossv1/user/displayname#query-a-user-by-their-friend-code">
                            friend codes
                          </Link>
                        </li>
                        <li>
                          <Link href="/docs/matchmaking/">Matchmaking</Link>,{" "}
                          <Link href="/docs/ossv1/sessions/creating">
                            sessions
                          </Link>{" "}
                          &amp; metrics
                        </li>
                        <li>
                          <Link href="/docs/framework/automatic_parties">
                            Parties
                          </Link>
                          ,{" "}
                          <Link href="/docs/ossv1/lobbies/creating">
                            lobbies
                          </Link>{" "}
                          &amp;{" "}
                          <Link href="/docs/setup/crossplatform/invites">
                            seamless invites
                          </Link>
                        </li>
                        <li>
                          Session and/or party mirroring to local platforms
                        </li>
                        <li>
                          <Link href="/docs/ossv1/stats/configuring">
                            Stats
                          </Link>{" "}
                          &amp;{" "}
                          <Link href="/docs/ossv1/achievements/querying">
                            achievements
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="col col--6">
                      <ul>
                        <li>
                          <Link href="/docs/ossv1/leaderboards/querying">
                            Leaderboards
                          </Link>
                        </li>
                        <li>
                          <Link href="/docs/ossv1/user_cloud/reading">
                            Player Data Storage
                          </Link>{" "}
                          &amp;{" "}
                          <Link href="/docs/ossv1/title_file/reading">
                            Title Storage
                          </Link>
                        </li>
                        <li>
                          <Link href="/docs/ossv1/voice_chat/parties">
                            Voice chat in parties
                          </Link>{" "}
                          &amp;{" "}
                          <Link href="/docs/ossv1/voice_chat/listen_servers">
                            on servers
                          </Link>
                        </li>
                        <li>
                          Multiplayer features:
                          <ul>
                            <li>
                              <Link href="/docs/setup/networking/p2p_vs_ip">
                                Peer-to-peer over EOS P2P
                              </Link>
                            </li>
                            <li>
                              <Link href="/docs/dedis/">
                                Secure dedicated servers
                              </Link>
                            </li>
                            <li>
                              <Link href="/docs/setup/networking/anticheat">
                                Easy Anti-Cheat integration
                              </Link>
                            </li>
                            <li>
                              <Link href="/docs/setup/networking/authentication">
                                Network authentication
                              </Link>{" "}
                              &amp;{" "}
                              <Link href="/docs/setup/networking/authentication#enabling-sanction-checks">
                                sanction checks
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li>Play-in-editor support</li>
                        <li>
                          <Link href="/docs/ossv1/ecom/offers">
                            E-commerce support on Steam, Google Play and Epic
                            Games Store
                          </Link>
                        </li>
                        <li>Unified friends list across platforms</li>
                        <li>iOS, Android, Meta Quest &amp; console support</li>
                        <li>Join games from Steam, Discord, etc.</li>
                        <li>
                          <Link href="/docs/licensing">
                            Free Edition available
                          </Link>{" "}
                          for students &amp; hobbyists
                        </li>
                        <li>
                          Over{" "}
                          <Link href="/docs/ossv1/blueprints/reference/">
                            400+ blueprint nodes
                          </Link>{" "}
                          to integrate EOS without C++
                        </li>
                        <li>
                          <Link href="/docs/framework/automatic_login">
                            Startup screens
                          </Link>{" "}
                          to simplify automatic login on launch
                        </li>
                        <li>
                          Framework components to{" "}
                          <Link href="/docs/framework/party_members">
                            display party members
                          </Link>{" "}
                          in your game lobby
                        </li>
                        <li>
                          Complete{" "}
                          <Link href="/docs/example_project">
                            example project
                          </Link>{" "}
                          using blueprints, with parties, invites, team-based
                          matchmaking and gameplay
                        </li>
                      </ul>
                    </div>
                  </div>
                </Feature.Describer>
              </Feature>
            </FeatureList>
            <div className="row">
              <div className="col col--12">
                <div
                  className={classnames("margin-top--xl", styles.buttons)}
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginBottom: "1em",
                  }}
                >
                  <strong>So what are you waiting for?</strong> Download EOS
                  Online Framework and use Epic Online Services in your game
                  today!
                </div>
                <div
                  className={classnames("margin-bottom--xl", styles.buttons)}
                >
                  <Link
                    className={classnames(
                      "button button--secondary button--lg shadow--tl",
                      styles.getStarted
                    )}
                    style={{ marginRight: "1em" }}
                    to={
                      "https://licensing.redpoint.games/get/eos-online-subsystem-free/"
                    }
                  >
                    Download Free Edition
                  </Link>
                  <Link
                    className={classnames(
                      "button button--success button--lg shadow--tl",
                      styles.getStarted
                    )}
                    style={{
                      marginRight: "1em",
                      border: "solid 4px rgb(50, 198, 50)",
                    }}
                    to={
                      "https://www.fab.com/listings/b900b244-0ff6-49e3-8562-5fc630ba9515"
                    }
                  >
                    Get Paid Edition
                  </Link>
                  <Link
                    className={classnames(
                      "button button--secondary button--lg shadow--tl",
                      styles.getStarted
                    )}
                    to={useBaseUrl("docs/")}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Home;
