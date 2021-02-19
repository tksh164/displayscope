import { ScreenMetadata } from "@/@type/pipapp/screen-capturer";

export interface ExposedApi {
  getAllScreenMetadata: (thumbnailWidth: number, thumbnailHeight: number) => Promise<ScreenMetadata[]>;
  getCurrentAlwaysOnTopSetting: () => Promise<boolean | undefined>;
  setAlwaysOnTopSetting: (newAlwaysOnTopSetting: boolean) => Promise<void>;
}
