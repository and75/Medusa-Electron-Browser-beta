import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import path from 'path';
import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const appVersion = process.env.APP_VERSION || '1.0.1';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: path.join(process.cwd(), "icon"),
    extraResource: [
      path.join(process.cwd(), "icon"),
    ],
  },
  rebuildConfig: {},
  makers: [new MakerSquirrel({}), new MakerZIP({}, ['darwin']), new MakerRpm({}), new MakerDeb({})],
  plugins: [
    new WebpackPlugin({
      mainConfig,
      devContentSecurityPolicy: "connect-src 'self' * 'unsafe-eval'",
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/index.html',
            js: './src/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/preload.ts',
            },
          },
          {
            html: './src/webview-index.html',
            js: './src/webview-renderer.ts',
            name: 'webview_window',
            preload: {
              js: './src/webview-preload.ts',
            },
          },
          {
            html: './src/bookmarks-index.html',
            js: './src/bookmarks-renderer.ts',
            name: 'bookmarks_window',
            preload: {
              js: './src/bookmarks-preload.ts',
            },
          }
        ],
      },
    }),
  ],
  "publishers": [
    {
      "name": "@electron-forge/publisher-github",
      "config": {
        "repository": {
          "owner": "and75",
          "name": "Medusa-Electron-Browser-beta"
        },
        "draft": false,
        prerelease: appVersion.includes("beta"),
        tag: `v1.1.0`,
        releaseName: `Medusa Browser v1.1.0`,
      }
    }
  ]
};

export default config;
