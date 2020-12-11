export interface DisplayMetadataValue {
  bounds: Electron.Rectangle;
  scaleFactor: number;
  isPrimary: boolean;
}

export interface ScreenMetadata {
  id: string;
  name: string;
  thumbnailDataUri: string;
  display: {
    bounds: Electron.Rectangle;
    scaleFactor: number;
    isPrimary: boolean;
  }
}
