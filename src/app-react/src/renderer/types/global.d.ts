export type ExposedApi = {
  getAllScreenSpecs: (thumbnailWidth: number, thumbnailHeight: number) => Promise<ScreenSpec[]>;
  setMouseCursorPosition: (posX: number, posY: number) => Promise<void>;
  getCurrentAlwaysOnTopSetting: () => Promise<boolean>;
  setAlwaysOnTopSetting: (shouldAlwaysOnTop: boolean) => Promise<void>;
  addAlwaysOnTopSettingChangedEventListener: (listener: (event: Electron.IpcRendererEvent, shouldAlwaysOnTop: boolean) => void) => Promise<void>;
  removeAlwaysOnTopSettingChangedEventListener: (listener: (event: Electron.IpcRendererEvent, shouldAlwaysOnTop: boolean) => void) => Promise<void>;
  getMouseCursorReturnShortcutKey(): Promise<string>;
};

declare global {
  interface Window {
    exposedApi: ExposedApi;
  }
}
