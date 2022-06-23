// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

const REPO_PATH = 'ofrbg/pqrs'

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'use-pq',
  tagline: 'Queryless GraphQL',
  url: 'use-pq.com',
  baseUrl: '/',
  onBrokenLinks: 'error',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'ofrbg',
  projectName: 'pqrs',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        pages: false,
        blog: false,
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'use-pq',
        logo: {
          alt: 'use-pq',
          src: 'img/logo.png',
        },
        items: [
          {
            href: 'https://github.com/' + REPO_PATH,
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
}

module.exports = config
