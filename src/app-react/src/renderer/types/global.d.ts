export type ExposedApi = {
  getAllScreenSpecs: (thumbnailWidth: number, thumbnailHeight: number) => Promise<ScreenSpec[]>;
  setMouseCursorPosition: (posX: number, posY: number) => Promise<void>;
  setAlwaysOnTopSetting: (newAlwaysOnTopSetting: boolean) => Promise<void>;
};

declare global {
  interface Window {
    exposedApi: ExposedApi;
  }
}
