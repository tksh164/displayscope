import type { ForgeConfig } from '@electron-forge/shared-types';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import path from "path";
import fs  from "fs";
import packageJson from './package.json';
import { THIRD_PARTY_NOTICES_FILE_NAME, SET_MOUSE_CURSOR_POS_EXECUTABLE_FILE_NAME, APP_DEFAULT_SETTINGS_FILE_NAME, APP_ICON_PNG_FILE_NAME } from "./src/main/constants";

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    extraResource: [
      path.join('../setmousecursorpos', SET_MOUSE_CURSOR_POS_EXECUTABLE_FILE_NAME),
      path.join('./src/assets', APP_DEFAULT_SETTINGS_FILE_NAME),
      path.join('./src/assets', APP_ICON_PNG_FILE_NAME),
    ],
    icon: './src/assets/appicon',
    win32metadata: {
      CompanyName: packageJson.author.name,
      ProductName: packageJson.productName,
      InternalName: packageJson.productName,
      FileDescription: packageJson.description,
    },
    appCopyright: 'Copyright (C) 2020 ' + packageJson.author.name + '. All rights reserved.',
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: (arch: string) => {
        return {
          setupExe: `${packageJson.name}-setup-${packageJson.version}-${arch}.exe`,
          setupIcon: './src/assets/appicon.ico',
          iconUrl: 'https://raw.githubusercontent.com/tksh164/displayscope/master/src/app/src/assets/appicon.ico',
          productName: packageJson.productName,
          additionalFiles: [
            {
              src: THIRD_PARTY_NOTICES_FILE_NAME,
              target: 'lib/net45',
            },
          ],
        }
      }
    },
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  hooks: {
    postPackage: async (config, packageResult) => {
      // Copy files into the output directory.
      const files = [
        {
          sourcePath: path.join('../..', THIRD_PARTY_NOTICES_FILE_NAME),
          destination: path.join(packageResult.outputPaths[0], THIRD_PARTY_NOTICES_FILE_NAME),
        }
      ];
      files.map((file) => {
        console.log("Copy", 'ThirdPartyNotices.txt',);
        console.log("- Source file path:", file.sourcePath);
        console.log("- Destination file path:", file.destination);
        fs.copyFileSync(file.sourcePath, file.destination, fs.constants.COPYFILE_EXCL);
      });
    },
  },
};

export default config;
