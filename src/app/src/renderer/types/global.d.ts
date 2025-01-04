export type ExposedApi = {
  readonly screenSpec: {
    readonly getAll: (thumbnailWidth: number, thumbnailHeight: number) => Promise<ScreenSpec[]>;
  };

  readonly mouseCursorPosition: {
    readonly set: (posX: number, posY: number) => Promise<void>;
  };

  readonly alwaysOnTopState: {
    readonly get: () => Promise<boolean>;
    readonly set: (newAlwaysOnTopState: boolean) => Promise<void>;
    readonly addChangedEventListener: (listener: (event: Electron.IpcRendererEvent, newAlwaysOnTopState: boolean) => void) => Promise<void>;
    readonly removeChangedEventListener: (listener: (event: Electron.IpcRendererEvent, newAlwaysOnTopState: boolean) => void) => Promise<void>;
  };

  readonly appSettings: {
    readonly shortcutKey: {
      readonly get(settingItemName: string): Promise<string>;
    }
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
