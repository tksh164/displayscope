import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import path from 'path';
import fs  from 'fs';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: 'src/assets/icon',
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({}),
    new MakerDeb({})
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
    postPackage: async (forgeConfig, options) => {
      copyResourceFiles(options.outputPaths[0]);
    },
  },
};

function copyResourceFiles(outputPath: string) {
  // Copy files into the resources directory.
  const copyFileIntoResourcesDir = (outputPath: string, sourceRelativePathFromOutputPath: string, fileName: string) => {
    const sourceFilePath = path.join(outputPath, sourceRelativePathFromOutputPath, fileName);
    const destinationFilePath = path.join(outputPath, 'resources', fileName);
    console.log('Copy', fileName);
    console.log('sourceFilePath', sourceFilePath);
    console.log('destinationFilePath', destinationFilePath);
    fs.copyFileSync(sourceFilePath, destinationFilePath, fs.constants.COPYFILE_EXCL);
  }

  const filesToCopy = [
    {
      sourceRelativePath: '../../../setmousecursorpos',
      fileName: 'setmousecursorpos.exe',
    },
    {
      sourceRelativePath: '../../src/assets',
      fileName: 'appicon.png',
    },
  ];

  filesToCopy.forEach((file) => {
    copyFileIntoResourcesDir(outputPath, file.sourceRelativePath, file.fileName);
  });
}

export default config;
