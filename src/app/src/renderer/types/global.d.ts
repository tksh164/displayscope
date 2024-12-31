export type ExposedApi = {
  readonly screenSpec: {
    readonly getAll: (thumbnailWidth: number, thumbnailHeight: number) => Promise<ScreenSpec[]>;
  };

  readonly mouseCursorPosition: {
    readonly set: (posX: number, posY: number) => Promise<void>;
  };

  readonly alwaysOnTopSetting: {
    readonly get: () => Promise<boolean>;
    readonly set: (shouldAlwaysOnTop: boolean) => Promise<void>;
    readonly addChangedEventListener: (listener: (event: Electron.IpcRendererEvent, shouldAlwaysOnTop: boolean) => void) => Promise<void>;
    readonly removeChangedEventListener: (listener: (event: Electron.IpcRendererEvent, shouldAlwaysOnTop: boolean) => void) => Promise<void>;
  };

  readonly mouseCursorReturnShortcutKey: {
    readonly get(): Promise<string>;
  };

  readonly navigateToInteractiveScreenShortcutKey: {
    readonly addPressedEventListener(listener: (event: Electron.IpcRendererEvent, screenSpec: ScreenSpec) => void): Promise<void>;
    readonly removePressedEventListener(listener: (event: Electron.IpcRendererEvent, screenSpec: ScreenSpec) => void): Promise<void>;
    readonly registerShortcutKeys(screenSpecs: ScreenSpec[]): Promise<void>;
    readonly unregisterShortcutKeys(): Promise<void>;
  };
};

declare global {
  interface Window {
    exposedApi: ExposedApi;
  }
}
