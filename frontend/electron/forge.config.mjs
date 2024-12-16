import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

const config = {
  packagerConfig: {
    name: 'Fast Notes',
    asar: true,
    icon: './public/assets/icons/fast-notes-icon',
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({ setupIcon: './public/assets/icons/fast-notes-icon.ico', icon: './public/assets/icons/fast-notes-icon.ico' }, ['win32']),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({ icon: './public/assets/icons/fast-notes-icon.ico'}, ['linux']),
    new MakerDeb(
        {
          options: {
            maintainer: 'Fynnian Brosius',
            homepage: 'https://fast-notes.fynnian-brosius.de',
            icon: './public/assets/icons/fast-notes-icon.ico',
          }
        },
        ['linux']
    ),
  ],
  plugins: [
    new VitePlugin({
      build: [
        {
          entry: 'main/main.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'preload/main-window.preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
        {
          entry: 'preload/overlay.preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'react_renderer',
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
};

export default config;
