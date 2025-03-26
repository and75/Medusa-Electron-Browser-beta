import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { MakerPKG } from '@electron-forge/maker-pkg';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import path from 'path';
import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const appVersion = process.env.APP_VERSION || '1.0.1';
const os = process.env.OS || 'unknown';

/**
 * Configuration object for Electron Forge.
 * 
 * This configuration defines the settings for packaging, rebuilding, 
 * making distributable builds, and publishing the Electron application.
 * 
 * @type {ForgeConfig}
 * @property {object} packagerConfig - Configuration for the Electron Packager.
 * @property {boolean} packagerConfig.asar - Whether to package the app's source code into an ASAR archive.
 * @property {string} packagerConfig.icon - Path to the application icon.
 * @property {string[]} packagerConfig.extraResource - Additional resources to include in the packaged app.
 * 
 * @property {object} rebuildConfig - Configuration for rebuilding native modules.
 * 
 * @property {Array} makers - List of makers for creating distributable builds.
 * @property {MakerSquirrel} makers[] - Maker for Windows installer.
 * @property {MakerZIP} makers[] - Maker for ZIP archives (Windows/macOS/Linux).
 * @property {MakerDeb} makers[] - Maker for Linux `.deb` packages.
 * @property {MakerDMG} makers[] - Maker for macOS `.dmg` images.
 * @property {MakerPKG} makers[] - Maker for macOS `.pkg` installers (optional).
 * 
 * @property {Array} plugins - List of plugins for extending Electron Forge functionality.
 * @property {WebpackPlugin} plugins[] - Webpack plugin for bundling the application.
 * @property {object} plugins[].renderer - Configuration for the renderer process.
 * @property {string} plugins[].renderer.devContentSecurityPolicy - Content Security Policy for development.
 * @property {Array} plugins[].renderer.entryPoints - Entry points for the renderer process.
 * @property {object} plugins[].renderer.entryPoints[].preload - Preload script configuration.
 * @property {string} plugins[].renderer.entryPoints[].preload.js - Path to the preload script.
 * 
 * @property {Array} publishers - List of publishers for releasing the application.
 * @property {object} publishers[] - Publisher configuration.
 * @property {string} publishers[].name - Name of the publisher.
 * @property {object} publishers[].config - Configuration for the publisher.
 * @property {object} publishers[].config.repository - GitHub repository details.
 * @property {string} publishers[].config.repository.owner - Repository owner.
 * @property {string} publishers[].config.repository.name - Repository name.
 * @property {boolean} publishers[].config.draft - Whether to create a draft release.
 * @property {boolean} publishers[].config.prerelease - Whether the release is a prerelease (based on app version).
 * @property {string} publishers[].config.tag - Tag for the release.
 * @property {string} publishers[].config.releaseName - Name of the release.
 */
const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: path.join(process.cwd(), "icon"),
    extraResource: [
      path.join(process.cwd(), "icon"),
    ],
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel(),  // Per Windows
    new MakerZIP(),  // Per Windows/macOS/Linux
    new MakerDeb(),  // Per Linux .deb
    new MakerDMG(),  // Per macOS .dmg
    new MakerPKG(),  // Per macOS .pkg (opzionale)
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
        "draft": false,
        "prerelease": appVersion.includes("beta"),
        "tag": `v${appVersion}-${os}`,
        "releaseName": `Medusa Browser v${appVersion} (${os})`,
      }
    }
  ]
};

export default config;