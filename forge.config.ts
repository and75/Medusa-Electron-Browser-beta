import type { ForgeConfig } from '@electron-forge/shared-types';
// import { MakerSquirrel } from '@electron-forge/maker-squirrel';
// import { MakerZIP } from '@electron-forge/maker-zip';
// import { MakerDeb } from '@electron-forge/maker-deb';
// import { MakerRpm } from '@electron-forge/maker-rpm';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import path from 'path';
import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';
import {platform, arch } from 'os'; // Import the 'arch' property from the 'os' module
import packageJSON from './package.json';

const config: ForgeConfig = {
  packagerConfig: {
    name: "Sairen Ai audio solutions",
    appBundleId: "com.sairen.audiosolution",
    icon: "./icon/icon",
    asar: true,
    extraResource: [
      path.join(process.cwd(), "icon"),
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        //name: "sairen_ai_audio_solution",
        setupExe: `${packageJSON.productName}-${packageJSON.version}-${platform}-${arch}.exe`,
        // The ICO file to use as the icon for the generated Setup.exe
        setupIcon: './icon/icon.ico',
        //loadingGif: './icon/installer.gif',
      }
    }
  ],
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
        "draft": false
      }
    }
  ]
};

export default config;
