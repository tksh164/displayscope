import { ScreenMetadata } from "@/@type/pipapp/screen-capturer";

export interface ExposedApi {
  getAllScreenMetadata: (thumbnailWidth: number, thumbnailHeight: number) => Promise<ScreenMetadata[]>;
}
