export interface ExposedApi {
  getAllScreenSpecs: (thumbnailWidth: number, thumbnailHeight: number) => Promise<ScreenSpec[]>;
  setAlwaysOnTopSetting: (newAlwaysOnTopSetting: boolean) => Promise<void>;
}
