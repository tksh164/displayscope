export type ExposedApi = {
  screenSpec: {
    getAll: (thumbnailWidth: number, thumbnailHeight: number) => Promise<ScreenSpec[]>;
  };

  mouseCursorPosition: {
    set: (posX: number, posY: number) => Promise<void>;
  };

  alwaysOnTopSetting: {
    get: () => Promise<boolean>;
    set: (shouldAlwaysOnTop: boolean) => Promise<void>;
    addChangedEventListener: (listener: (event: Electron.IpcRendererEvent, shouldAlwaysOnTop: boolean) => void) => Promise<void>;
    removeChangedEventListener: (listener: (event: Electron.IpcRendererEvent, shouldAlwaysOnTop: boolean) => void) => Promise<void>;
  };

  mouseCursorReturnShortcutKey: {
    get(): Promise<string>;
  };

  navigateToInteractiveScreenShortcutKey: {
    addPressedEventListener(listener: (event: Electron.IpcRendererEvent, screenSpec: ScreenSpec) => void): Promise<void>;
    removePressedEventListener(listener: (event: Electron.IpcRendererEvent, screenSpec: ScreenSpec) => void): Promise<void>;
    registerShortcutKeys(screenSpecs: ScreenSpec[]): Promise<void>;
    unregisterShortcutKeys(): Promise<void>;
  };
};

declare global {
  interface Window {
    exposedApi: ExposedApi;
  }
}
