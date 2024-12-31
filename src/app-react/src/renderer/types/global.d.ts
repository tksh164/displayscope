export type ExposedApi = {
  getAllScreenSpecs: (thumbnailWidth: number, thumbnailHeight: number) => Promise<ScreenSpec[]>;
  setMouseCursorPosition: (posX: number, posY: number) => Promise<void>;
  getCurrentAlwaysOnTopSetting: () => Promise<boolean>;
  setAlwaysOnTopSetting: (shouldAlwaysOnTop: boolean) => Promise<void>;
  addAlwaysOnTopSettingChangedEventListener: (listener: (event: Electron.IpcRendererEvent, shouldAlwaysOnTop: boolean) => void) => Promise<void>;
  removeAlwaysOnTopSettingChangedEventListener: (listener: (event: Electron.IpcRendererEvent, shouldAlwaysOnTop: boolean) => void) => Promise<void>;
  getMouseCursorReturnShortcutKey(): Promise<string>;
  addNavigateToInteractiveScreenShortcutKeyPressedEventListener(listener: (event: Electron.IpcRendererEvent, screenSpec: ScreenSpec) => void): Promise<void>;
  removeNavigateToInteractiveScreenShortcutKeyPressedEventListener(listener: (event: Electron.IpcRendererEvent, screenSpec: ScreenSpec) => void): Promise<void>;
  registerNavigateToInteractiveScreenShortcutKeys(screenSpecs: ScreenSpec[]): Promise<void>;
  unregisterNavigateToInteractiveScreenShortcutKeys(): Promise<void>;
};

declare global {
  interface Window {
    exposedApi: ExposedApi;
  }
}
