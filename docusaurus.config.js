module.exports = {
  title: "EOS Online Framework",
  tagline:
    "The professional solution to integrate EOS (Epic Online Services) into your Unreal Engine game, trusted by over 3,000 developers and millions of players. With support for consoles, team-based matchmaking, cross-platform friends and presence, cross-platform e-commerce, authentication done for you and over 400 blueprint nodes, EOS Online Framework gets your game online faster than anyone else.",
  url: "https://docs.redpoint.games",
  baseUrl: "/",
  favicon: "favicon.ico",
  organizationName: "redpointgames",
  projectName: "docs",
  onBrokenLinks: "throw",
  onBrokenAnchors: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "throw",
      onBrokenMarkdownImages: "throw",
    },
  },
  plugins: [
    () => ({
      name: "Raw Loader",
      configureWebpack: (config, isServer, utils) => {
        return {
          module: {
            rules: [
              {
                test: /\.bp$/,
                use: ["raw-loader"],
              },
            ],
          },
        };
      },
    }),
  ],
  themeConfig: {
    announcementBar: {
      id: "proximity_voice_chat",
      content:
        '🎉 Proximity voice chat is <a href="/docs/framework/voice_chat">now available</a>!',
      backgroundColor: "rgb(175, 255, 172)",
      textColor: "#000",
      isCloseable: false,
    },
    prism: {
      additionalLanguages: ["cpp", "csharp", "docker", "batch", "powershell"],
    },
    navbar: {
      title: "EOS Online Framework",
      logo: {
        alt: "EOS Online Framework Logo",
        src: "img/EOSLogo_TF_Alt.png",
        srcDark: "img/EOSLogo_TF.png",
      },
      items: [
        {
          label: "📙 Documentation",
          position: "left",
          type: "dropdown",
          items: [
            {
              type: "doc",
              docId: "setup/index",
              label: "👋 Getting started",
              hint: "Not sure where to start? Click here!",
            },
            {
              type: "doc",
              docId: "framework/index",
              label: "🧩 Framework components",
              hint: "Components, actors and blueprint nodes to quickly integrate EOS into your game.",
              blueprint: true,
            },
            {
              type: "doc",
              docId: "ossv1/index",
              label: "🌏 Online subsystem guide",
              hint: "Use blueprints or standardized C++ to integrate Epic Online Services into your game.",
              blueprint: true,
              cpp: true,
            },
            {
              type: "doc",
              docId: "systems/index",
              label: "📃 Modern C++ guide",
              hint: "Use modern C++ APIs to integrate Epic Online Services into your game.",
              cpp: true,
            },
            {
              type: "doc",
              docId: "matchmaking/index",
              label: "🥇 Team-based matchmaking",
              hint: "Add teams to your game without an external matchmaker.",
              blueprint: true,
              cpp: true,
            },
            {
              type: "doc",
              docId: "dedis/index",
              label: "🏢 Dedicated servers for EOS",
              hint: "Our recommended approach to running dedicated game servers.",
            },
            {
              type: "doc",
              docId: "ossv1/blueprints/reference/index",
              label: "📘 Blueprints reference (OSSv1)",
              hint: "A comprehensive reference of all auto-generated blueprint nodes.",
              blueprint: true,
            },
            {
              type: "doc",
              docId: "tools/index",
              label: "⚙️ Unreal Editor tools",
              hint: "Editor and debugging tools to help you implement Epic Online Services.",
            },
            {
              type: "doc",
              docId: "support/index",
              label: "🛟 Support",
              hint: "How to get help when things aren't working.",
            },
          ],
        },
        {
          type: "doc",
          docId: "examples/index",
          label: "🎮 Example Projects",
          position: "left",
        },
        {
          type: "doc",
          docId: "licensing",
          label: "⚖️ Editions & Licensing",
          position: "left",
        },
        {
          type: "doc",
          docId: "changelog",
          label: "🎉 Changelog",
          position: "left",
        },
        {
          type: "doc",
          docId: "support/index",
          label: "🛟 Support",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      copyright: `Copyright © ${new Date().getFullYear()} Redpoint Games.`,
    },
    algolia: {
      appId: "FIOCNMBFH4",
      apiKey: "4346d272d46def333bebaf4f3ffd05ec",
      indexName: "redpointgames",
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/RedpointGames/docs/edit/main/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
  scripts: [
    {
      src: "https://code.jquery.com/jquery-3.5.1.min.js",
      integrity: "sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=",
      crossorigin: "anonymous",
    },
    {
      src: "/bue/bue-osb.js",
    },
  ],
  stylesheets: [
    {
      href: "/bue/bue-original.css",
    },
    {
      href: "/bue/bue-osb.css",
    },
  ],
};
