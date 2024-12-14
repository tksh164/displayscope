export type ExposedApi = {
  getAllScreenSpecs: (thumbnailWidth: number, thumbnailHeight: number) => Promise<ScreenSpec[]>;
  setAlwaysOnTopSetting: (newAlwaysOnTopSetting: boolean) => Promise<void>;
};

declare global {
  interface Window {
    exposedApi: ExposedApi;
  }
}
