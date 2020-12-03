export interface DisplayMetadataValue {
  size: Electron.Size;
  scaleFactor: number;
  isPrimary: boolean;
}

export interface ScreenMetadata {
  id: string;
  name: string;
  thumbnailDataUrl: string;
  display: {
    size: Electron.Size;
    scaleFactor: number;
    isPrimary: boolean;
  }
}
